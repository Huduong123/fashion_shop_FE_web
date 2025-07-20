// File: src/components/CartModal/CartModal.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './CartModal.css';
import { useCart } from '../../contexts/CartContext';
import QuantitySelector from '../common/QuantitySelector/QuantitySelector';

const CartModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  
  const { cartItems, removeFromCart, totalAmount, isLoading } = useCart();

  const formatPrice = (price) => (price || 0).toLocaleString('vi-VN') + ' VND';
  const handleRemoveItem = (itemId) => removeFromCart(itemId);
  
  const handleCheckout = () => {
    navigate('/cart');
    onClose();
  };
  
  const handleNavigateAndClose = () => {
    onClose();
  };

  // --- HÀM MỚI ---
  // Xử lý khi nhấn nút "Bắt đầu mua sắm"
  const handleGoShopping = () => {
    navigate('/products');
    onClose(); // Đóng modal sau khi điều hướng
  };

  if (!isOpen) return null;

  return (
    <div className="cart-modal-overlay" onClick={onClose}>
      <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cart-modal-header">
          <h2 className="cart-modal-title">GIỎ HÀNG CỦA BẠN</h2>
          <button className="cart-modal-close" onClick={onClose}>×</button>
        </div>

        <div className="cart-modal-body">
          {isLoading ? (
            <div className="empty-cart-content"><p>Đang cập nhật giỏ hàng...</p></div>
          ) : cartItems.length === 0 ? (
            // Thay đổi cấu trúc một chút để trông đẹp hơn
            <div className="empty-cart-content">
              <p>Giỏ hàng của bạn đang trống</p>
            </div>
          ) : (
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <Link to={`/product/${item.productId}`} onClick={handleNavigateAndClose}>
                    <div className="cart-item-image">
                      <img src={item.image || '/placeholder.png'} alt={item.name} />
                    </div>
                  </Link>
                  <div className="cart-item-details">
                    <Link to={`/product/${item.productId}`} onClick={handleNavigateAndClose} className="cart-item-name-link">
                      <h4 className="cart-item-name">{item.name}</h4>
                    </Link>
                    <div className="cart-item-info">
                      <span className="cart-item-color">Màu sắc: {item.color}</span>
                      <span className="cart-item-size">Size: {item.size}</span>
                      <QuantitySelector item={item} isLoading={isLoading} />
                    </div>
                    <div className="cart-item-price">{formatPrice(item.price * item.quantity)}</div>
                  </div>
                  <button className="cart-item-remove" onClick={() => handleRemoveItem(item.id)} disabled={isLoading}>×</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer khi có sản phẩm */}
        {cartItems.length > 0 && (
          <div className="cart-modal-footer">
            <div className="cart-total">
              <span className="total-label">TỔNG TIỀN:</span>
              <span className="total-amount">{formatPrice(totalAmount)}</span>
            </div>
            <button className="checkout-button" onClick={handleCheckout} disabled={isLoading}>
              XEM GIỎ HÀNG
            </button>
          </div>
        )}

        {/* --- FOOTER MỚI KHI GIỎ HÀNG TRỐNG --- */}
        {/* Chỉ hiển thị khi không loading và giỏ hàng trống */}
        {!isLoading && cartItems.length === 0 && (
          <div className="cart-modal-footer">
            <button className="continue-shopping-btn-modal" onClick={handleGoShopping}>
              BẮT ĐẦU MUA SẮM
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;