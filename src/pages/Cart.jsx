import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  
  // Mock data cho giỏ hàng
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Quần Short Nam Nâng Đồng SP25FH32P-AK",
      color: "GREY",
      size: "XXL",
      quantity: 1,
      price: 600000,
      image: "/uploads/product1.webp"
    },
    {
      id: 2,
      name: "Áo Khoác Nam Thời Trang JK25SSO1T-PA",
      color: "LIGHT GREY",
      size: "S",
      quantity: 1,
      price: 1200000,
      image: "/uploads/product2.webp"
    },
    {
      id: 3,
      name: "Áo Khoác Nam Thời Trang JK25SSO1T-PA",
      color: "LIGHT GREY",
      size: "XL",
      quantity: 1,
      price: 1200000,
      image: "/uploads/product3.webp"
    },
    {
      id: 4,
      name: "Áo Polo Nam Tay Ngắn Form Vừa KS25SS16C-SCHE",
      color: "WHITE",
      size: "2XL",
      quantity: 1,
      price: 980000,
      image: "/uploads/product4.webp"
    }
  ]);

  const [note, setNote] = useState('');
  const [invoiceRequired, setInvoiceRequired] = useState(false);

  // Tính tổng tiền
  const totalAmount = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const savings = 0; // Có thể tính toán discount nếu có

  // Format số tiền
  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN') + 'đ';
  };

  // Xử lý thay đổi số lượng
  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity <= 0) return;
    setCartItems(cartItems.map(item => 
      item.id === itemId 
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  // Xử lý xóa sản phẩm
  const handleRemoveItem = (itemId) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };

  // Xử lý thanh toán
  const handleCheckout = () => {
    // Navigate đến trang payment
    navigate('/payment');
  };

  // Xử lý tiếp tục mua hàng
  const handleContinueShopping = () => {
    // Navigate về trang sản phẩm
    window.location.href = '/products';
  };

  return (
    <div className="cart-page">
      <div className="cart-container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/" className="breadcrumb-link">Trang chủ</Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">Giỏ hàng ({cartItems.length})</span>
        </div>

        {/* Page Title */}
        <div className="cart-header">
          <h1 className="cart-title">Giỏ hàng của bạn</h1>
          <p className="cart-subtitle">Có {cartItems.length} sản phẩm trong giỏ hàng</p>
        </div>

        <div className="cart-content">
          {/* Left Content - Cart Items */}
          <div className="cart-main">
            {cartItems.length === 0 ? (
              <div className="empty-cart">
                <p>Giỏ hàng của bạn đang trống</p>
                <Link to="/products" className="continue-shopping-btn">
                  Tiếp tục mua hàng
                </Link>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cartItems.map((item) => (
                    <div key={item.id} className="cart-item">
                      <div className="cart-item-image">
                        <img src={item.image} alt={item.name} />
                      </div>
                      
                      <div className="cart-item-details">
                        <h3 className="cart-item-name">{item.name}</h3>
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
                        >
                          ×
                        </button>
                        <div className="quantity-controls">
                          <button 
                            className="quantity-btn"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          >
                            -
                          </button>
                          <span className="quantity-value">{item.quantity}</span>
                          <button 
                            className="quantity-btn"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
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
                    <p>→ KHÔNG ÁP DỤNG ĐỔI TRẢ ĐỐI VỚI SẢN PHẨM MUA TRONG CHƯƠNG TRÌNH KHUYẾN MÃI</p>
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

                {/* Related Products Section */}
                <div className="related-products">
                  <h3>SẢN PHẨM LIÊN QUAN</h3>
                  <div className="no-related-products">
                    <p>KHÔNG CÓ SẢN PHẨM PHÙ HỢP</p>
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
                  <button className="checkout-btn" onClick={handleCheckout}>
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