import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import QuantitySelector from '../components/common/QuantitySelector/QuantitySelector'; // Đường dẫn đã được cập nhật
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  
  // Lấy dữ liệu và các hàm từ CartContext
  const { cartItems, removeFromCart, totalAmount, totalItems, isLoading } = useCart();

  // State cho các trường chỉ thuộc về trang này
  const [note, setNote] = useState('');
  const [invoiceRequired, setInvoiceRequired] = useState(false);

  // Tổng tiền tiết kiệm (tạm thời, có thể tính toán sau này)
  const savings = 0; 

  // Format số tiền
  const formatPrice = (price) => {
    return (price || 0).toLocaleString('vi-VN') + 'đ';
  };

  // Hàm xử lý xóa sản phẩm
  const handleRemoveItem = (itemId) => {
    removeFromCart(itemId);
  };

  // Hàm xử lý thanh toán
  const handleCheckout = () => {
    navigate('/payment');
  };

  // Hàm xử lý tiếp tục mua hàng
  const handleContinueShopping = () => {
    navigate('/products');
  };

  // Hàm handleQuantityChange đã được xóa bỏ vì logic đã chuyển vào QuantitySelector

  return (
    <div className="cart-page">
      <div className="cart-container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/" className="breadcrumb-link">Trang chủ</Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">Giỏ hàng ({totalItems})</span>
        </div>

        {/* Page Title */}
        <div className="cart-header">
          <h1 className="cart-title">Giỏ hàng của bạn</h1>
          <p className="cart-subtitle">Có {cartItems.length} sản phẩm trong giỏ hàng</p>
        </div>

        <div className="cart-content">
          {/* Left Content - Cart Items */}
          <div className="cart-main">
            {isLoading ? (
                <div className="loading-cart"><p>Đang tải giỏ hàng...</p></div>
            ) : cartItems.length === 0 ? (
              <div className="empty-cart">
                <p>Giỏ hàng của bạn đang trống</p>
                <button onClick={handleContinueShopping} className="continue-shopping-btn">
                  Tiếp tục mua hàng
                </button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cartItems.map((item) => (
                    <div key={item.id} className="cart-item">
                      <Link to={`/product/${item.productId}`}>
                        <div className="cart-item-image">
                          <img src={item.image || '/placeholder.png'} alt={item.name} />
                        </div>
                      </Link>
                      
                      <div className="cart-item-details">
                        <Link to={`/product/${item.productId}`} className="cart-item-name-link">
                          <h3 className="cart-item-name">{item.name}</h3>
                        </Link>
                        <div className="cart-item-variant">
                          <span>{item.color} / {item.size}</span>
                        </div>
                        <div className="cart-item-price">
                          {formatPrice(item.price)}
                        </div>
                      </div>

                      <div className="cart-item-actions">
                        <button 
                          className="cart-item-remove"
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={isLoading}
                        >
                          ×
                        </button>
                        {/* SỬ DỤNG COMPONENT TÁI SỬ DỤNG */}
                        <QuantitySelector item={item} isLoading={isLoading} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Notes */}
                <div className="order-notes">
                  <h3>Ghi chú đơn hàng</h3>
                  <textarea
                    placeholder="Ghi chú"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="note-textarea"
                  />
                  <div className="policy-notice">
                    <strong>Chính sách mua hàng</strong>
                    <p>→ KHÔNG ÁP DỤNG ĐỔI TRẢ ĐỐI VỚI SẢN PHẨM MUA TRONG CHƯƠG TRÌNH KHUYẾN MÃI</p>
                    <p>→ Lưu ý: Quý Khách có nhu cầu xuất hóa đơn vui lòng điền thông tin ở phần Xuất Hóa Đơn Cho Đơn Hàng ở bên dưới</p>
                  </div>
                  
                  <div className="invoice-option">
                    <label className="checkbox-container">
                      <input
                        type="checkbox"
                        checked={invoiceRequired}
                        onChange={(e) => setInvoiceRequired(e.target.checked)}
                      />
                      <span className="checkmark"></span>
                      Xuất hóa đơn cho đơn hàng
                    </label>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Right Sidebar - Order Summary */}
          {cartItems.length > 0 && (
            <div className="cart-sidebar">
              <div className="order-summary">
                <div className="summary-row">
                  <span className="summary-label">Tổng tiền:</span>
                  <span className="summary-value">{formatPrice(totalAmount)}</span>
                </div>
                
                <div className="summary-row savings">
                  <span className="summary-label">Tiết kiệm:</span>
                  <span className="summary-value savings-value">{formatPrice(savings)}</span>
                </div>

                <div className="checkout-actions">
                  <button className="checkout-btn" onClick={handleCheckout} disabled={isLoading}>
                    THANH TOÁN
                  </button>
                  <button className="continue-shopping-btn" onClick={handleContinueShopping}>
                    ← Tiếp tục mua hàng
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;