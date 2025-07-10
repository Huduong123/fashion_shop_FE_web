import React, { useState } from 'react';
import './ProductModal.css';

const ProductModal = ({ product, isOpen, onClose }) => {
  const [selectedColor, setSelectedColor] = useState('#FFFFFF');
  const [selectedSize, setSelectedSize] = useState('S');
  const [quantity, setQuantity] = useState(1);

  if (!isOpen || !product) return null;

  const availableColors = [
    { name: 'WHITE', value: '#FFFFFF' },
    { name: 'BLUE', value: '#87CEEB' },
    { name: 'GREEN', value: '#90EE90' },
    { name: 'NAVY', value: '#000080' },
    { name: 'BEIGE', value: '#F5F5DC' }
  ];

  const availableSizes = ['S', 'M', 'L', 'XL', '2XL', '3XL'];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  const handleQuantityChange = (change) => {
    setQuantity(prev => Math.max(1, prev + change));
  };

  const handleAddToCart = () => {
    console.log('Added to cart:', {
      product: product.id,
      color: selectedColor,
      size: selectedSize,
      quantity: quantity
    });
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="product-modal-overlay" onClick={handleOverlayClick}>
      <div className="product-modal">
        {/* Close Button */}
        <button className="modal-close-btn" onClick={onClose}>
          ×
        </button>

        <div className="modal-content">
          {/* Product Image */}
          <div className="modal-image-section">
            <img 
              src={product.image} 
              alt={product.name}
              className="modal-product-image"
            />
          </div>

          {/* Product Details */}
          <div className="modal-details-section">
            <h2 className="modal-product-name">
              {product.name}
            </h2>
            
            <div className="modal-product-sku">
              SKU: {product.sku || `WS25FH69T-CF`}
            </div>

            <div className="modal-product-price">
              {formatPrice(product.price)}
            </div>

            {/* Color Selection */}
            <div className="modal-option-group">
              <label className="modal-option-label">
                Color: <span className="selected-color-name">
                  {availableColors.find(c => c.value === selectedColor)?.name}
                </span>
                <span className="modal-dropdown-arrow">▼</span>
              </label>
              <div className="color-options">
                {availableColors.map((color) => (
                  <div
                    key={color.value}
                    className={`color-option ${selectedColor === color.value ? 'selected' : ''}`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => setSelectedColor(color.value)}
                  />
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="modal-option-group">
              <label className="modal-option-label">Kích thước:</label>
              <div className="size-options">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selection */}
            <div className="modal-quantity-section">
              <button 
                className="quantity-btn minus-btn"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="quantity-display">{quantity}</span>
              <button 
                className="quantity-btn plus-btn"
                onClick={() => handleQuantityChange(1)}
              >
                +
              </button>
            </div>

            {/* Add to Cart Button */}
            <button className="add-to-cart-btn" onClick={handleAddToCart}>
              Thêm vào giỏ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal; 