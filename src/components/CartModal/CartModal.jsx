import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CartModal.css';

const CartModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  
  // Mock data cho giỏ hàng - sau này sẽ thay bằng data thật từ state management
  const cartItems = [
    {
      id: 1,
      name: "ÁO KHOÁC TRƯỢT NƯỚC NỮ 12IN1 TRANSFORM JACKET WOP 2020",
      color: "Cam",
      size: "L",
      quantity: 1,
      price: 499000,
      image: "/uploads/product1.webp" // Thay bằng đường dẫn ảnh thật
    },
    {
      id: 2,
      name: "ÁO KHOÁC NỮ AIRLAYER BY COLOR WOK 2067",
      color: "Hồng Smoke",
      size: "S",
      quantity: 1,
      price: 729000,
      image: "/uploads/product2.webp"
    },
    {
      id: 3,
      name: "ÁO KHOÁC THUN NỮ ANTI UV NINJA WOK 2071",
      color: "Hồng Đậm Orchid Haze",
      size: "L",
      quantity: 4,
      price: 2796000,
      image: "/uploads/product3.webp"
    },
    {
      id: 4,
      name: "ÁO KHOÁC NỮ AIRLAYER ORIGINAL LOGO VER 2.0 WOK 2066",
      color: "Xanh Lago",
      size: "L",
      quantity: 4,
      price: 2716000,
      image: "/uploads/product4.webp"
    }
  ];

  // Tính tổng tiền
  const totalAmount = cartItems.reduce((total, item) => total + item.price, 0);

  // Format số tiền
  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN') + ' VND';
  };

  // Xử lý xóa sản phẩm khỏi giỏ hàng
  const handleRemoveItem = (itemId) => {
    // Logic xóa sản phẩm - sẽ implement sau
    console.log('Remove item:', itemId);
  };

  // Xử lý thanh toán
  const handleCheckout = () => {
    // Navigate đến trang cart
    navigate('/cart');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="cart-modal-overlay" onClick={onClose}>
      <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="cart-modal-header">
          <h2 className="cart-modal-title">GIỎ HÀNG CỦA BẠN</h2>
          <button className="cart-modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        {/* Cart Items */}
        <div className="cart-modal-body">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <p>Giỏ hàng của bạn đang trống</p>
            </div>
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
                      <span className="cart-item-quantity">Số lượng: {item.quantity}</span>
                    </div>
                    <div className="cart-item-price">
                      {formatPrice(item.price)}
                    </div>
                  </div>

                  <button 
                    className="cart-item-remove"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="cart-modal-footer">
            <div className="cart-total">
              <span className="total-label">TỔNG TIỀN:</span>
              <span className="total-amount">{formatPrice(totalAmount)}</span>
            </div>
            <button className="checkout-button" onClick={handleCheckout}>
              THANH TOÁN
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal; 