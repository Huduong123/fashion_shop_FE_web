// src/components/Payment.jsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import userService from '../services/userService';
import orderService from '../services/orderService';
import paymentMethodService from '../services/paymentMethodService'; // Import service mới
import './Payment.css';

const Payment = () => {
  const navigate = useNavigate();
  
  // Lấy dữ liệu giỏ hàng từ context
  const { cartItems, totalAmount, clearCart } = useCart();
  
  // Lấy thông tin authentication
  const { isAuthenticated, user, logout } = useAuth();

  // State để lưu danh sách phương thức thanh toán từ API
  const [paymentMethods, setPaymentMethods] = useState([]);
  
  // State này giờ sẽ lưu ID của phương thức thanh toán được chọn
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: ''
  });

  const [discountCode, setDiscountCode] = useState('');
  
  // State cho địa chỉ người dùng
  const [userAddresses, setUserAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  
  // State cho loading khi tạo đơn hàng
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  // useEffect để fetch danh sách phương thức thanh toán
  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const methods = await paymentMethodService.getPaymentMethods();
        setPaymentMethods(methods);
        // Tự động chọn phương thức đầu tiên làm mặc định nếu có
        if (methods.length > 0) {
          setSelectedPaymentMethodId(methods[0].id);
        }
      } catch (error) {
        console.error("Không thể tải phương thức thanh toán:", error);
      }
    };

    fetchPaymentMethods();
  }, []); // Mảng rỗng đảm bảo chỉ chạy 1 lần


  // Tính toán
  const subtotal = totalAmount;
  const shippingFee = 0; // Free shipping
  const discount = 0;
  const total = subtotal - discount + shippingFee;

  // Format số tiền
  const formatPrice = (price) => {
    return (price || 0).toLocaleString('vi-VN') + 'đ';
  };

  // Fetch user addresses và điền thông tin mặc định
  useEffect(() => {
    const fetchUserAddresses = async () => {
      if (isAuthenticated) {
        try {
          const addresses = await userService.getUserAddresses();
          setUserAddresses(addresses);
          const defaultAddress = addresses.find(addr => addr.isDefault);
          if (defaultAddress) {
            setFormData(prev => ({
              ...prev,
              fullName: defaultAddress.recipientName,
              phone: defaultAddress.phoneNumber,
              address: defaultAddress.addressDetail
            }));
            setSelectedAddressId(defaultAddress.id);
          }
        } catch (error) {
          console.error('Failed to fetch user addresses:', error);
        }
      }
    };
    fetchUserAddresses();
  }, [isAuthenticated]);

  // Pre-fill email nếu user đã đăng nhập
  useEffect(() => {
    if (isAuthenticated && user && user.email && !formData.email) {
      setFormData(prev => ({ ...prev, email: user.email }));
    }
  }, [isAuthenticated, user, formData.email]);

  // Handle form input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle address selection
  const handleAddressSelection = (addressId) => {
    setSelectedAddressId(addressId);
    if (addressId) {
      const selectedAddress = userAddresses.find(addr => addr.id === parseInt(addressId));
      if (selectedAddress) {
        setFormData(prev => ({
           ...prev,
           fullName: selectedAddress.recipientName,
           email: prev.email || (user && user.email) || '',
           phone: selectedAddress.phoneNumber,
           address: selectedAddress.addressDetail
         }));
      }
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Handle discount code
  const handleApplyDiscount = () => {
    // Logic áp dụng mã giảm giá
  };

  // Handle order completion
  const handleCompleteOrder = async () => {
    // Validate form
    if (!formData.fullName || !formData.email || !formData.phone || !formData.address) {
      alert('Vui lòng điền đầy đủ thông tin giao hàng');
      return;
    }
    // Validate payment method
    if (!selectedPaymentMethodId) {
      alert('Vui lòng chọn một phương thức thanh toán');
      return;
    }
    if (!isAuthenticated) {
      alert('Vui lòng đăng nhập để tiếp tục đặt hàng');
      navigate('/login');
      return;
    }
    if (!cartItems || cartItems.length === 0) {
      alert('Giỏ hàng của bạn đang trống');
      return;
    }

    setIsCreatingOrder(true);
    
    try {
      // Gọi backend API để tạo đơn hàng, truyền ID phương thức thanh toán
      const backendOrderResponse = await orderService.createOrderFromCart(selectedPaymentMethodId);
      
      await clearCart();

      // Chuẩn bị dữ liệu để gửi sang trang checkout
      const selectedMethodDetails = paymentMethods.find(m => m.id === selectedPaymentMethodId);
      const orderData = {
        orderId: `#${backendOrderResponse.id}`,
        orderInfo: backendOrderResponse,
        customerInfo: formData,
        paymentMethod: selectedMethodDetails ? selectedMethodDetails.name : 'Không xác định',
        items: backendOrderResponse.orderItems.map(item => ({
          ...item,
          totalPrice: item.price * item.quantity
        })),
        total: backendOrderResponse.totalPrice,
        subtotal: backendOrderResponse.totalPrice,
        shippingFee: 0,
        discount: 0,
        orderDate: backendOrderResponse.createdAt
      };

      navigate('/checkout', { state: { orderData } });
      
    } catch (error) {
      console.error('Error creating order:', error);
      const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.';
      alert(errorMessage);
    } finally {
      setIsCreatingOrder(false);
    }
  };

  return (
    <div className="payment-page">
      <div className="payment-container">
        <div className="payment-header">
          <div className="breadcrumb">
            <Link to="/cart" className="breadcrumb-link">Giỏ hàng</Link>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-current">Thông tin giao hàng</span>
          </div>
        </div>

        <div className="payment-content">
          <div className="payment-form-section">
            <div className="form-section">
              <h2 className="section-title">Thông tin giao hàng</h2>
              {isAuthenticated && user ? (
                <div className="user-info-section">
                  <div className="user-info-display">
                    <div className="user-details">
                      <span className="user-name">{user.fullname || user.username}</span>
                      {user.email && <span className="user-email">({user.email})</span>}
                    </div>
                    <button onClick={handleLogout} className="logout-btn">Đăng xuất</button>
                  </div>
                  {userAddresses.length > 0 && (
                    <div className="address-selection">
                      <label className="address-selection-label">Chọn địa chỉ có sẵn:</label>
                      <select
                        value={selectedAddressId}
                        onChange={(e) => handleAddressSelection(e.target.value)}
                        className="address-select"
                      >
                        <option value="">-- Chọn địa chỉ --</option>
                        {userAddresses.map((address) => (
                          <option key={address.id} value={address.id}>
                            {address.recipientName} - {address.addressDetail}{address.isDefault ? ' (Mặc định)' : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              ) : (
                <div className="login-prompt">
                  <span>Bạn đã có tài khoản? </span>
                  <Link to="/login" className="login-link">Đăng nhập</Link>
                </div>
              )}

              <form className="shipping-form">
                <div className="form-group">
                  <input type="text" name="fullName" placeholder="Họ và tên" value={formData.fullName} onChange={handleInputChange} className="form-input" required />
                </div>
                <div className="form-row">
                  <div className="form-group half">
                    <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} className="form-input" required />
                  </div>
                  <div className="form-group half">
                    <input type="tel" name="phone" placeholder="Số điện thoại" value={formData.phone} onChange={handleInputChange} className="form-input" required />
                  </div>
                </div>
                <div className="form-group">
                   <input type="text" name="address" placeholder="Địa chỉ" value={formData.address} onChange={handleInputChange} className="form-input" required />
                </div>
              </form>
            </div>

            <div className="form-section">
              <h2 className="section-title">Phương thức thanh toán</h2>
              <div className="payment-methods">
                {paymentMethods.length > 0 ? (
                  paymentMethods.map((method) => (
                    <label 
                      key={method.id} 
                      className={`payment-option ${selectedPaymentMethodId === method.id ? 'selected' : ''}`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={selectedPaymentMethodId === method.id}
                        onChange={() => setSelectedPaymentMethodId(method.id)}
                      />
                      <div className="payment-info">
                      <div className="payment-icon">                           
                        {method.imageUrl && (
                          <img src={method.imageUrl} alt={method.name} />)}
                            </div>
                              <div className="payment-details">
                                <span className="payment-name">{method.name}</span>

                              </div>
                      </div>
                    </label>
                  ))
                ) : (
                  <p>Đang tải các phương thức thanh toán...</p>
                )}
              </div>
            </div>

            <div className="form-actions">
              <Link to="/cart" className="back-btn">Giỏ hàng</Link>
              <button 
                onClick={handleCompleteOrder} 
                className="complete-order-btn"
                disabled={isCreatingOrder}
              >
                {isCreatingOrder ? 'Đang xử lý...' : 'Hoàn tất đơn hàng'}
              </button>
            </div>
          </div>

          <div className="order-summary-section">
            <div className="order-summary-sticky">
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
                    <div className="item-price">{formatPrice(item.price)}</div>
                  </div>
                ))}
              </div>
              <div className="discount-section">
                <div className="discount-input">
                  <input
                    type="text"
                    placeholder="Mã giảm giá"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    className="discount-code-input"
                  />
                  <button onClick={handleApplyDiscount} className="apply-discount-btn">Sử dụng</button>
                </div>
              </div>
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
                    <span className="amount">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
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