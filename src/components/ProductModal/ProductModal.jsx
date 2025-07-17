import React, { useState, useEffect } from 'react';
import './ProductModal.css';
import productService from '../../services/productService';
import colorService from '../../services/colorService';
import { useCart } from '../../contexts/CartContext';

const ProductModal = ({ productId, isOpen, onClose }) => {
  // State để quản lý dữ liệu được fetch từ API
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // State để quản lý các lựa chọn của người dùng
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedSizeInfo, setSelectedSizeInfo] = useState(null);
  const [quantity, setQuantity] = useState(1);
  
  // Lấy hàm addToCart từ context
  const { addToCart } = useCart();

  // Effect để fetch dữ liệu chi tiết sản phẩm khi modal được mở hoặc productId thay đổi
  useEffect(() => {
    if (isOpen && productId) {
      const fetchProductDetails = async () => {
        setLoading(true);
        setError(null);
        setProductData(null);
        try {
          const result = await productService.getProductById(productId);
          if (result.success && result.data) {
            const data = result.data;
            setProductData(data);

            if (data.productVariants && data.productVariants.length > 0) {
              const firstVariant = data.productVariants[0];
              setSelectedVariant(firstVariant);

              if (firstVariant.sizes && firstVariant.sizes.length > 0) {
                const firstAvailableSize = firstVariant.sizes.find(s => s.available) || firstVariant.sizes[0];
                setSelectedSizeInfo(firstAvailableSize);
              }
            }
            setQuantity(1);
          } else {
            setError(result.message || 'Không tìm thấy sản phẩm.');
          }
        } catch (err) {
          setError('Đã xảy ra lỗi khi kết nối đến máy chủ.');
        } finally {
          setLoading(false);
        }
      };
      fetchProductDetails();
    }
  }, [productId, isOpen]);

  // Các hàm xử lý sự kiện lựa chọn
  const handleColorSelect = (variant) => {
    setSelectedVariant(variant);
    if (variant.sizes?.length > 0) {
        const firstAvailableSize = variant.sizes.find(s => s.available) || variant.sizes[0];
        setSelectedSizeInfo(firstAvailableSize);
    }
    setQuantity(1);
  };
  
  const handleSizeSelect = (size) => {
    setSelectedSizeInfo(size);
    setQuantity(1);
  };

  const handleQuantityChange = (change) => {
    const stockQuantity = selectedSizeInfo?.quantity || 0;
    const purchaseLimit = 10;
    const maxAllowed = Math.min(stockQuantity, purchaseLimit);
    setQuantity(prev => Math.max(1, Math.min(prev + change, maxAllowed)));
  };

  // Hàm xử lý thêm vào giỏ hàng
  const handleAddToCart = () => {
    if (!selectedVariant || !selectedSizeInfo || !productData || !selectedSizeInfo.available) {
      alert('Vui lòng chọn đầy đủ thông tin hoặc sản phẩm đã hết hàng.');
      return;
    }

    const itemToAdd = {
      id: `${selectedVariant.id}-${selectedSizeInfo.id}`,
      product_id: productData.id,
      name: productData.name,
      product_variant_id: selectedVariant.id,
      color: selectedVariant.colorName,
      size_id: selectedSizeInfo.id,
      size: selectedSizeInfo.sizeName,
      quantity: quantity,
      price: selectedSizeInfo.price,
      image: selectedVariant.images?.[0]?.imageUrl || '/images/product-placeholder.jpg',
      stock: selectedSizeInfo.quantity
    };

    addToCart(itemToAdd);
    onClose();
  };

  const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price || 0) + 'đ';

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const renderContent = () => {
    if (loading) return <div className="modal-loading">Đang tải chi tiết sản phẩm...</div>;
    if (error) return <div className="modal-error">Lỗi: {error}</div>;
    if (!productData) return null;

    const maxAllowedQuantity = Math.min(selectedSizeInfo?.quantity || 0, 10);
    const isAddToCartDisabled = !selectedSizeInfo?.available || maxAllowedQuantity === 0;

    return (
      <div className="modal-content">
        <div className="modal-image-section">
          <img 
            src={selectedVariant?.images?.[0]?.imageUrl || '/images/product-placeholder.jpg'} 
            alt={productData.name}
            className="modal-product-image"
            onError={(e) => { e.target.src = '/images/product-placeholder.jpg'; }}
          />
        </div>
        <div className="modal-details-section">
          <h2 className="modal-product-name">{productData.name}</h2>
          {/* Dòng SKU đã được xóa khỏi đây */}
          <div className="modal-product-price">{formatPrice(selectedSizeInfo?.price)}</div>

          <div className="modal-option-group">
            <label className="modal-option-label">Màu sắc: <span className="selected-option-name">{selectedVariant?.colorName}</span></label>
            <div className="color-options">
              {productData.productVariants.map((variant) => (
                <div
                  key={variant.id}
                  className={`color-option ${selectedVariant?.id === variant.id ? 'selected' : ''}`}
                  style={{ backgroundColor: colorService.getColorHexCode(variant.colorName) }}
                  onClick={() => handleColorSelect(variant)}
                  title={variant.colorName}
                />
              ))}
            </div>
          </div>

          <div className="modal-option-group">
            <label className="modal-option-label">Kích thước:</label>
            <div className="size-options">
              {selectedVariant?.sizes.map((size) => (
                <button
                  key={size.id}
                  className={`size-option ${selectedSizeInfo?.id === size.id ? 'selected' : ''}`}
                  onClick={() => handleSizeSelect(size)}
                  disabled={!size.available}
                >
                  {size.sizeName}
                </button>
              ))}
            </div>
          </div>
          
          <div className="modal-option-group">
            <label className="modal-option-label">Số lượng:</label>
            <div className="modal-quantity-section">
                <button className="quantity-btn" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>-</button>
                <span className="quantity-display">{quantity}</span>
                <button className="quantity-btn" onClick={() => handleQuantityChange(1)} disabled={quantity >= maxAllowedQuantity}>+</button>
            </div>
          </div>
          
          <button className="add-to-cart-btn" onClick={handleAddToCart} disabled={isAddToCartDisabled}>
            {isAddToCartDisabled ? 'Hết hàng' : 'Thêm vào giỏ'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="product-modal-overlay" onClick={handleOverlayClick}>
      <div className="product-modal">
        <button className="modal-close-btn" onClick={onClose}>×</button>
        {renderContent()}
      </div>
    </div>
  );
};

export default ProductModal;