import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CartModal.css';
import { useCart } from '../../contexts/CartContext';

const CartModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  // The hooks now provide the correct data regardless of login state
  const { cartItems, removeFromCart, updateQuantity, totalAmount, isLoading } = useCart();

  const formatPrice = (price) => (price || 0).toLocaleString('vi-VN') + ' VND';

  // No changes needed here, just calls the context function
  const handleRemoveItem = (itemId) => {
    removeFromCart(itemId);
  };

  // The function now takes the change (-1 or 1) directly
  const handleQuantityChange = (item, change) => {
    updateQuantity(item.id, change);
  };

  const handleCheckout = () => {
    navigate('/cart');
    onClose();
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
            <div className="empty-cart"><p>Đang cập nhật giỏ hàng...</p></div>
          ) : cartItems.length === 0 ? (
            <div className="empty-cart"><p>Giỏ hàng của bạn đang trống</p></div>
          ) : (
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="cart-item-details">
                    <h4 className="cart-item-name">{item.name}</h4>
                    <div className="cart-item-info">
                      <span className="cart-item-color">Màu sắc: {item.color}</span>
                      <span className="cart-item-size">Size: {item.size}</span>
                      <div className="cart-item-quantity-selector">
                        <button onClick={() => handleQuantityChange(item, -1)} disabled={item.quantity <= 1}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => handleQuantityChange(item, 1)}>+</button>
                      </div>
                    </div>
                    <div className="cart-item-price">{formatPrice(item.price * item.quantity)}</div>
                  </div>
                  <button className="cart-item-remove" onClick={() => handleRemoveItem(item.id)}>×</button>
                </div>
              ))}
            </div>
          )}
        </div>

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
      </div>
    </div>
  );
};

export default CartModal;