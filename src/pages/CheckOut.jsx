import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import './CheckOut.css';

const CheckOut = () => {
  const location = useLocation();
  const { orderData } = location.state || {};



  // If no order data, redirect or show error
  if (!orderData) {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <div className="error-message">
            <h2>Không tìm thấy thông tin đơn hàng</h2>
            <Link to="/" className="back-home-btn">Về trang chủ</Link>
          </div>
        </div>
      </div>
    );
  }

  // Format price function
  const formatPrice = (price) => {
    return (price || 0).toLocaleString('vi-VN') + 'đ';
  };
  return (
    <div className="checkout-page">
      <div className="checkout-container">
        {/* Success Header */}
        <div className="success-header">
          <div className="success-icon">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22,4 12,14.01 9,11.01"></polyline>
            </svg>
          </div>
          <h1 className="success-title">Đặt hàng thành công</h1>
          <p className="order-id">Mã đơn hàng {orderData.orderId}</p>
          <p className="order-status">Trạng thái: {orderData.orderInfo?.status || 'PENDING'}</p>
          <p className="success-message">Cảm ơn bạn đã mua hàng!</p>
        </div>

        {/* Order Information */}
        <div className="order-info-section">
          <div className="info-card">
            <h2 className="section-title">Thông tin đơn hàng</h2>
            
            {/* Shipping Information */}
            <div className="info-group">
              <h3 className="info-label">Thông tin giao hàng</h3>
              <div className="customer-details">
                <p className="customer-name">{orderData.customerInfo.fullName}</p>
                <p className="customer-phone">{orderData.customerInfo.phone}</p>
                <p className="customer-address">{orderData.customerInfo.address}</p>
                <p className="customer-location">Vietnam</p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="info-group">
              <h3 className="info-label">Phương thức thanh toán</h3>
              <p className="payment-method-text">
                {orderData.paymentMethod?.name || 'Không xác định'}
              </p>
            </div>
          </div>
        </div>

        {/* Order Items Summary */}
        {orderData.items && orderData.items.length > 0 && (
          <div className="order-items-section">
            <div className="info-card">
              <h3 className="section-title">Chi tiết đơn hàng</h3>
              
              <div className="items-list">
                {orderData.items.map((item, index) => (
                    <div key={`${item.productVariantId || index}-${index}`} className="order-item">
                      <div className="item-image">
                        <img 
                          src={item.image || item.imageUrl || '/images/product-placeholder.jpg'} 
                          alt={item.name || item.productName || 'Product'} 
                          onError={(e) => {
                            e.target.src = '/images/product-placeholder.jpg';
                          }}
                        />
                        <span className="item-quantity">{item.quantity || 0}</span>
                      </div>
                      <div className="item-details">
                        <h4 className="item-name">{item.name || item.productName || 'Tên sản phẩm không xác định'}</h4>
                        <p className="item-variant">
                          {(item.color || item.colorName || 'N/A')} / {(item.size || item.sizeName || 'N/A')}
                        </p>
                      </div>
                      <div className="item-price">
                        {formatPrice(item.totalPrice || (item.price * item.quantity) || 0)}
                      </div>
                    </div>
                ))}
              </div>

              {/* Order Total */}
              <div className="order-total-section">
                <div className="total-row">
                  <span className="total-label">Tạm tính:</span>
                  <span className="total-value">{formatPrice(orderData.subtotal || orderData.orderInfo?.totalPrice)}</span>
                </div>
                <div className="total-row">
                  <span className="total-label">Phí vận chuyển:</span>
                  <span className="total-value">
                    {orderData.shippingFee > 0 ? formatPrice(orderData.shippingFee) : 'Miễn phí'}
                  </span>
                </div>
                {orderData.discount > 0 && (
                  <div className="total-row">
                    <span className="total-label">Giảm giá:</span>
                    <span className="total-value">-{formatPrice(orderData.discount)}</span>
                  </div>
                )}
                <div className="total-row final-total">
                  <span className="total-label">Tổng cộng:</span>
                  <span className="total-value">{formatPrice(orderData.total || orderData.orderInfo?.totalPrice)}</span>
                </div>
                
                {/* Order Metadata */}
                <div className="order-metadata">
                  <p className="order-date">
                    Ngày đặt: {new Date(orderData.orderDate || orderData.orderInfo?.createdAt).toLocaleDateString('vi-VN')}
                  </p>
                  <p className="order-id-detail">
                    ID đơn hàng: {orderData.orderInfo?.id}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="checkout-actions">
          <div className="help-section">
            <span className="help-text">Cần hỗ trợ? </span>
            <Link to="/support" className="help-link">Liên hệ chúng tôi</Link>
          </div>
          <Link to="/" className="continue-shopping-btn">
            Tiếp tục mua hàng
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;
