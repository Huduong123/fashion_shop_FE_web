import React, { useState, useEffect } from 'react';
import './ProductModal.css';
import productService from '../../services/productService';
import colorService from '../../services/colorService';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext'; // Import useAuth to check login status

const ProductModal = ({ productId, isOpen, onClose }) => {
  // State to manage data fetched from the API
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // State to manage user selections
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedSizeInfo, setSelectedSizeInfo] = useState(null);
  const [quantity, setQuantity] = useState(1);
  
  // Get functions and state from contexts
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth(); // Check if the user is logged in

  // Effect to fetch product details when the modal opens or productId changes
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

            // Set default selections
            if (data.productVariants && data.productVariants.length > 0) {
              const firstVariant = data.productVariants[0];
              setSelectedVariant(firstVariant);

              if (firstVariant.sizes && firstVariant.sizes.length > 0) {
                // Prioritize selecting an available size first
                const firstAvailableSize = firstVariant.sizes.find(s => s.available) || firstVariant.sizes[0];
                setSelectedSizeInfo(firstAvailableSize);
              }
            }
            // Reset quantity to 1
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

  // Event handlers for selections
  const handleColorSelect = (variant) => {
    setSelectedVariant(variant);
    // When color changes, reset size selection to the first available one
    if (variant.sizes?.length > 0) {
        const firstAvailableSize = variant.sizes.find(s => s.available) || variant.sizes[0];
        setSelectedSizeInfo(firstAvailableSize);
    }
    setQuantity(1); // Reset quantity
  };
  
  const handleSizeSelect = (size) => {
    setSelectedSizeInfo(size);
    setQuantity(1); // Reset quantity
  };

  const handleQuantityChange = (change) => {
    const stockQuantity = selectedSizeInfo?.quantity || 0;
    const purchaseLimit = 10;
    const maxAllowed = Math.min(stockQuantity, purchaseLimit);
    setQuantity(prev => Math.max(1, Math.min(prev + change, maxAllowed)));
  };

  // --- UPDATED: Add to Cart Logic ---
  const handleAddToCart = () => {
    if (!selectedVariant || !selectedSizeInfo || !productData || !selectedSizeInfo.available) {
      alert('Vui lòng chọn đầy đủ thông tin hoặc sản phẩm đã hết hàng.');
      return;
    }

    // This object structure is now generic.
    // The CartContext will decide how to handle it based on authentication status.
    const itemToAdd = {
      // For a guest, a unique client-side ID is created.
      // For a logged-in user, this ID is temporary; the backend will assign the real cart_item.id.
      id: isAuthenticated ? null : `${selectedVariant.id}-${selectedSizeInfo.id}`,
      
      product_id: productData.id,
      name: productData.name,
      
      // These fields are crucial for the backend API call
      product_variant_id: selectedVariant.id,
      size_id: selectedSizeInfo.id,
      quantity: quantity,

      // Other display properties
      color: selectedVariant.colorName,
      size: selectedSizeInfo.sizeName,
      price: selectedSizeInfo.price,
      image: selectedVariant.images?.[0]?.imageUrl || '/images/product-placeholder.jpg',
      stock: selectedSizeInfo.quantity
    };

    // The addToCart function from the context handles both guest and logged-in scenarios
    addToCart(itemToAdd);
    onClose(); // Close the modal after adding the item
  };

  const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price || 0) + 'đ';

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    // Close the modal only if the overlay itself is clicked
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