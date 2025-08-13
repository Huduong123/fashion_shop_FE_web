import React, { useState, useEffect } from 'react';
import './ProductModal.css';
import productService from '../../services/productService';
import colorService from '../../services/colorService';
import { useProductSelector } from '../../hooks/useProductSelector'; // Đã import hook

const ProductModal = ({ productId, isOpen, onClose }) => {
  // --- STATE DÀNH RIÊNG CHO MODAL NÀY ---
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- GỌI CUSTOM HOOK ĐỂ LẤY LOGIC VÀ STATE CHUNG ---
  const {
    selectedVariant,
    selectedSizeInfo,
    quantity,
    handleColorSelect,
    handleSizeSelect,
    handleQuantityChange,
    handleAddToCart: addToCartFromHook, // Đổi tên để tránh trùng lặp
    maxAllowedQuantity,
    isAddToCartDisabled,
  } = useProductSelector(productData);

  // --- USE EFFECTS ---

  // Effect để lấy dữ liệu sản phẩm khi modal mở
  useEffect(() => {
    if (isOpen && productId) {
      const fetchProductDetails = async () => {
        setLoading(true);
        setError(null);
        try {
          const result = await productService.getProductById(productId);
          if (result.success && result.data) {
            setProductData(result.data);
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
    } else {
      // Reset dữ liệu khi modal đóng để lần mở sau không bị hiển thị dữ liệu cũ
      setProductData(null);
    }
  }, [productId, isOpen]);

  // --- CÁC HÀM XỬ LÝ CỦA RIÊNG MODAL ---

  // Hàm này gọi hàm thêm vào giỏ từ hook, và nếu thành công thì đóng modal
  const handleAddToCartAndClose = async () => {
    const wasAdded = await addToCartFromHook(); // Gọi hàm từ hook, nhận lại kết quả true/false
    if (wasAdded) {
      onClose(); // Chỉ đóng modal nếu thêm thành công
    }
  };

  const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price || 0) + 'đ';

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // --- RENDER LOGIC ---

  if (!isOpen) return null;

  const renderContent = () => {
    if (loading) return <div className="modal-loading">Đang tải chi tiết sản phẩm...</div>;
    if (error) return <div className="modal-error">Lỗi: {error}</div>;
    if (!productData) return null; // Không hiển thị gì nếu chưa có dữ liệu

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
          
          <button className="add-to-cart-btn" onClick={handleAddToCartAndClose} disabled={isAddToCartDisabled}>
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