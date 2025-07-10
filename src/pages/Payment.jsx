import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Payment.css';

const Payment = () => {
  const navigate = useNavigate();
  
  // Mock data cho giỏ hàng (giống như trong Cart)
  const cartItems = [
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
  ];

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    province: '',
    district: '',
    ward: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [discountCode, setDiscountCode] = useState('');

  // Tính toán
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shippingFee = 0; // Free shipping
  const discount = 0;
  const total = subtotal - discount + shippingFee;

  // Format số tiền
  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN') + 'đ';
  };

  // Handle form input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle payment method change
  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  // Handle discount code
  const handleApplyDiscount = () => {
    // Logic áp dụng mã giảm giá
    console.log('Apply discount code:', discountCode);
  };

  // Handle order completion
  const handleCompleteOrder = () => {
    // Validate form
    if (!formData.fullName || !formData.email || !formData.phone || !formData.address) {
      alert('Vui lòng điền đầy đủ thông tin giao hàng');
      return;
    }

    // Process order
    console.log('Complete order with data:', { formData, paymentMethod, cartItems });
    alert('Đặt hàng thành công!');
  };

  return (
    <div className="payment-page">
      <div className="payment-container">
        {/* Header */}
        <div className="payment-header">
          
          {/* Breadcrumb */}
          <div className="breadcrumb">
            <Link to="/cart" className="breadcrumb-link">Giỏ hàng</Link>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-current">Thông tin giao hàng</span>
          </div>
        </div>

        <div className="payment-content">
          {/* Left Side - Form */}
          <div className="payment-form-section">
            {/* Shipping Information */}
            <div className="form-section">
              <h2 className="section-title">Thông tin giao hàng</h2>
              
              <div className="login-prompt">
                <span>Bạn đã có tài khoản? </span>
                <Link to="/login" className="login-link">Đăng nhập</Link>
              </div>

              <form className="shipping-form">
                <div className="form-group">
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Họ và tên"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group half">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group half">
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Số điện thoại"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    name="address"
                    placeholder="Địa chỉ"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group third">
                    <select
                      name="province"
                      value={formData.province}
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      <option value="">Chọn tỉnh / thành</option>
                      <option value="hcm">TP. Hồ Chí Minh</option>
                      <option value="hn">Hà Nội</option>
                      <option value="dn">Đà Nẵng</option>
                    </select>
                  </div>
                  <div className="form-group third">
                    <select
                      name="district"
                      value={formData.district}
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      <option value="">Chọn quận / huyện</option>
                      <option value="q1">Quận 1</option>
                      <option value="q3">Quận 3</option>
                      <option value="q7">Quận 7</option>
                    </select>
                  </div>
                  <div className="form-group third">
                    <select
                      name="ward"
                      value={formData.ward}
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      <option value="">Chọn phường / xã</option>
                      <option value="p1">Phường 1</option>
                      <option value="p2">Phường 2</option>
                      <option value="p3">Phường 3</option>
                    </select>
                  </div>
                </div>
              </form>
            </div>

            {/* Shipping Method */}
            <div className="form-section">
              <h2 className="section-title">Phương thức vận chuyển</h2>
              <div className="shipping-method">
                <div className="shipping-option">
                  <div className="shipping-icon">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <line x1="9" y1="9" x2="15" y2="9"/>
                      <line x1="9" y1="12" x2="15" y2="12"/>
                      <line x1="9" y1="15" x2="15" y2="15"/>
                    </svg>
                  </div>
                  <p>Vui lòng chọn tỉnh / thành để có danh sách phương thức vận chuyển.</p>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="form-section">
              <h2 className="section-title">Phương thức thanh toán</h2>
              <div className="payment-methods">
                <label className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => handlePaymentMethodChange('cod')}
                  />
                  <div className="payment-info">
                    <div className="payment-icon cod-icon">💰</div>
                    <span>Thanh toán khi giao hàng (COD)</span>
                  </div>
                </label>

                <label className={`payment-option ${paymentMethod === 'momo' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="momo"
                    checked={paymentMethod === 'momo'}
                    onChange={() => handlePaymentMethodChange('momo')}
                  />
                  <div className="payment-info">
                    <div className="payment-icon momo-icon">
                      <img src="/src/assets/images/icons/momo.png" alt="MoMo" />
                    </div>
                    <span>Ví MoMo</span>
                  </div>
                </label>

                <label className={`payment-option ${paymentMethod === 'vnpay' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="vnpay"
                    checked={paymentMethod === 'vnpay'}
                    onChange={() => handlePaymentMethodChange('vnpay')}
                  />
                  <div className="payment-info">
                    <div className="payment-icon vnpay-icon">
                      <img src="/src/assets/images/icons/vnpay.png" alt="VNPAY" />
                    </div>
                    <span>Thẻ ATM/Visa/Master/JCB/QR Pay qua cổng VNPAY</span>
                  </div>
                </label>

                <label className={`payment-option ${paymentMethod === 'shopeepay' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="shopeepay"
                    checked={paymentMethod === 'shopeepay'}
                    onChange={() => handlePaymentMethodChange('shopeepay')}
                  />
                  <div className="payment-info">
                    <div className="payment-icon shopeepay-icon">🛒</div>
                    <span>Ví ShopeePay</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="form-actions">
              <Link to="/cart" className="back-btn">Giỏ hàng</Link>
              <button onClick={handleCompleteOrder} className="complete-order-btn">
                Hoàn tất đơn hàng
              </button>
            </div>
          </div>

          {/* Right Side - Order Summary */}
          <div className="order-summary-section">
            <div className="order-summary-sticky">
              {/* Cart Items */}
              <div className="summary-items">
                {cartItems.map((item) => (
                  <div key={item.id} className="summary-item">
                    <div className="item-image">
                      <img src={item.image} alt={item.name} />
                      <span className="item-quantity">{item.quantity}</span>
                    </div>
                    <div className="item-details">
                      <h4 className="item-name">{item.name}</h4>
                      <p className="item-variant">{item.color} / {item.size}</p>
                    </div>
                    <div className="item-price">
                      {formatPrice(item.price)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Discount Code */}
              <div className="discount-section">
                <div className="discount-input">
                  <input
                    type="text"
                    placeholder="Mã giảm giá"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    className="discount-code-input"
                  />
                  <button onClick={handleApplyDiscount} className="apply-discount-btn">
                    Sử dụng
                  </button>
                </div>
              </div>

              {/* Customer Login */}
              <div className="customer-section">
                <div className="customer-login">
                  <span>Khách hàng thân thiết</span>
                  <button 
                    className="customer-login-btn"
                    onClick={() => navigate('/login')}
                  >
                    Đăng nhập
                  </button>
                </div>
              </div>

              {/* Order Total */}
              <div className="order-total">
                <div className="total-row">
                  <span className="total-label">Tạm tính</span>
                  <span className="total-value">{formatPrice(subtotal)}</span>
                </div>
                <div className="total-row">
                  <span className="total-label">Phí vận chuyển</span>
                  <span className="total-value">—</span>
                </div>
                <div className="total-row final">
                  <span className="total-label">Tổng cộng</span>
                  <div className="final-total">
                    <span className="currency">VND</span>
                    <span className="amount">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              {/* Powered by */}
              <div className="powered-by">
                <span>Powered by Haravan</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment; 