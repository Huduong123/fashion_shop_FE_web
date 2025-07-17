import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CartModal.css';
import { useCart } from '../../contexts/CartContext';

const CartModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, totalAmount } = useCart();

  const formatPrice = (price) => (price || 0).toLocaleString('vi-VN') + ' VND';
  
  const handleRemoveItem = (itemId) => {
    removeFromCart(itemId);
  };
  
  const handleQuantityChange = (item, change) => {
    const newQuantity = item.quantity + change;
    updateQuantity(item.id, newQuantity);
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
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <p>Giỏ hàng của bạn đang trống</p>
            </div>
          ) : (
            <div className="cart-items-list">
              {cartItems.map((item) => {
                // --- TÍNH TOÁN GIỚI HẠN CHO TỪNG SẢN PHẨM TRONG GIAO DIỆN ---
                const purchaseLimit = 10;
                // Nếu item.stock không tồn tại, mặc định là 10 để tránh lỗi
                const maxAllowedQuantity = Math.min(item.stock || purchaseLimit, purchaseLimit);
                const hasReachedLimit = item.quantity >= maxAllowedQuantity;

                return (
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
                           {/* Vô hiệu hóa nút giảm khi số lượng là 1 */}
                           <button 
                             onClick={() => handleQuantityChange(item, -1)} 
                             disabled={item.quantity <= 1}
                           >
                             -
                           </button>
                           <span>{item.quantity}</span>
                           {/* Vô hiệu hóa nút tăng khi đã đạt giới hạn */}
                           <button 
                             onClick={() => handleQuantityChange(item, 1)} 
                             disabled={hasReachedLimit}
                           >
                             +
                           </button>
                        </div>

                        {/* Hiển thị thông báo khi đạt giới hạn */}
                        {hasReachedLimit && (
                            <p className="cart-item-limit-notice">
                                Đã đạt số lượng tối đa
                            </p>
                        )}
                      </div>
                      <div className="cart-item-price">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>

                    <button 
                      className="cart-item-remove"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-modal-footer">
            <div className="cart-total">
              <span className="total-label">TỔNG TIỀN:</span>
              <span className="total-amount">{formatPrice(totalAmount)}</span>
            </div>
            <button className="checkout-button" onClick={handleCheckout}>
              XEM GIỎ HÀNG
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;