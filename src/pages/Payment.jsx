import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import userService from '../services/userService';
import orderService from '../services/orderService';
import './Payment.css';

const Payment = () => {
  const navigate = useNavigate();
  
  // Lấy dữ liệu giỏ hàng từ context
  const { cartItems, totalAmount, clearCart } = useCart();
  
  // Lấy thông tin authentication
  const { isAuthenticated, user, logout } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [discountCode, setDiscountCode] = useState('');
  
  // State cho địa chỉ người dùng
  const [userAddresses, setUserAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  
  // State cho loading khi tạo đơn hàng
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  // Tính toán
  const subtotal = totalAmount;
  const shippingFee = 0; // Free shipping
  const discount = 0;

  const total = subtotal - discount + shippingFee;

  // Format số tiền
  const formatPrice = (price) => {
    return (price || 0).toLocaleString('vi-VN') + 'đ';
  };

  // Fetch user addresses when component mounts and set default address
  useEffect(() => {
    const fetchUserAddresses = async () => {
      if (isAuthenticated) {
        try {
          const addresses = await userService.getUserAddresses();
          setUserAddresses(addresses);

          // --- BẮT ĐẦU THAY ĐỔI ---
          // Tìm địa chỉ mặc định trong danh sách
          const defaultAddress = addresses.find(addr => addr.isDefault);

          // Nếu có địa chỉ mặc định, tự động điền thông tin
          if (defaultAddress) {
            // Cập nhật form với thông tin từ địa chỉ mặc định
            setFormData(prev => ({
              ...prev, // Giữ lại email đã được điền từ useEffect khác
              fullName: defaultAddress.recipientName,
              phone: defaultAddress.phoneNumber,
              address: defaultAddress.addressDetail
            }));
            
            // Cập nhật ID của địa chỉ được chọn để hiển thị đúng trên dropdown
            setSelectedAddressId(defaultAddress.id);
          }
          // --- KẾT THÚC THAY ĐỔI ---

        } catch (error) {
          console.error('Failed to fetch user addresses:', error);
        }
      }
    };

    fetchUserAddresses();
  }, [isAuthenticated]); // Dependency không đổi

  // Pre-fill email if user is authenticated
  useEffect(() => {
    if (isAuthenticated && user && user.email && !formData.email) {
      setFormData(prev => ({
        ...prev,
        email: user.email
      }));
    }
  }, [isAuthenticated, user, formData.email]);

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
    // TODO: Implement discount code logic
  };

  // Handle order completion
  const handleCompleteOrder = async () => {
    // Validate form
    if (!formData.fullName || !formData.email || !formData.phone || !formData.address) {
      alert('Vui lòng điền đầy đủ thông tin giao hàng');
      return;
    }

    // Check if user is authenticated
    if (!isAuthenticated) {
      alert('Vui lòng đăng nhập để tiếp tục đặt hàng');
      navigate('/login');
      return;
    }

    // Check if cart is empty
    if (!cartItems || cartItems.length === 0) {
      alert('Giỏ hàng của bạn đang trống');
      return;
    }

    setIsCreatingOrder(true);
    
    try {
      // Call backend API to create order from cart
      const backendOrderResponse = await orderService.createOrderFromCart();
      
      // Clear the cart after successful order creation
      await clearCart();

      // Prepare order data for checkout page using ACTUAL order data from backend
      const orderData = {
        orderId: `#${backendOrderResponse.id}`,
        orderInfo: {
          id: backendOrderResponse.id,
          totalPrice: backendOrderResponse.totalPrice,
          status: backendOrderResponse.status,
          createdAt: backendOrderResponse.createdAt
        },
        customerInfo: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address
        },
        paymentMethod: paymentMethod,
        // Use actual order items from backend response
        items: backendOrderResponse.orderItems.map(item => ({
          productVariantId: item.productVariantId,
          name: item.productName,
          color: item.colorName,
          size: item.sizeName,
          quantity: item.quantity,
          price: item.price,
          image: item.imageUrl,
          // Calculate total price for each item
          totalPrice: item.price * item.quantity
        })),
        // Use actual order totals from backend
        total: backendOrderResponse.totalPrice,
        subtotal: backendOrderResponse.totalPrice,
        shippingFee: 0, // Free shipping as defined in UI
        discount: 0,    // No discount applied in current flow
        orderDate: backendOrderResponse.createdAt
      };

      // Navigate to checkout page with order data
      navigate('/checkout', { state: { orderData } });
      
    } catch (error) {
      console.error('Error creating order:', error);
      
      // Handle different error scenarios
      const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.';
      alert(errorMessage);
    } finally {
      setIsCreatingOrder(false);
    }
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
              
              {/* User Info Section - Only show if authenticated */}
              {isAuthenticated && user ? (
                <div className="user-info-section">
                  <div className="user-info-display">
                    <div className="user-details">
                      <span className="user-name">{user.fullname || user.username}</span>
                      {user.email && <span className="user-email">({user.email})</span>}
                    </div>
                    <button onClick={handleLogout} className="logout-btn">
                      Đăng xuất
                    </button>
                  </div>

                  {/* Address Selection */}
                  {userAddresses.length > 0 && (
                    <div className="address-selection">
                      <label className="address-selection-label">
                        Chọn địa chỉ có sẵn:
                      </label>
                      <select
                        value={selectedAddressId}
                        onChange={(e) => handleAddressSelection(e.target.value)}
                        className="address-select"
                      >
                        <option value="">-- Chọn địa chỉ --</option>
                        {userAddresses.map((address) => (
                          <option key={address.id} value={address.id}>
                            {address.recipientName} - {address.addressDetail}
                            {address.isDefault ? ' (Mặc định)' : ''}
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
              </form>
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
              <button 
                onClick={handleCompleteOrder} 
                className="complete-order-btn"
                disabled={isCreatingOrder}
              >
                {isCreatingOrder ? 'Đang xử lý...' : 'Hoàn tất đơn hàng'}
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