import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import './AccountMyOrder.css';

const AccountMyOrder = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [expandedOrders, setExpandedOrders] = useState(new Set());

  // Mock data cho đơn hàng
  const [orders, setOrders] = useState([
    {
      id: 'DH001',
      date: '2024-12-15',
      status: 'delivered',
      statusText: 'Đã giao',
      total: 850000,
      items: [
        {
          id: 1,
          name: 'Áo Thun Nam Basic',
          image: '/uploads/product1.webp',
          size: 'L',
          color: 'Trắng',
          quantity: 2,
          price: 250000
        },
        {
          id: 2,
          name: 'Quần Jeans Slim Fit',
          image: '/uploads/product2.webp',
          size: 'M',
          color: 'Xanh đậm',
          quantity: 1,
          price: 350000
        }
      ]
    },
    {
      id: 'DH002',
      date: '2024-12-20',
      status: 'shipping',
      statusText: 'Đang giao',
      total: 1200000,
      items: [
        {
          id: 3,
          name: 'Áo Hoodie Unisex',
          image: '/uploads/product3.webp',
          size: 'XL',
          color: 'Đen',
          quantity: 1,
          price: 450000
        },
        {
          id: 4,
          name: 'Giày Sneaker Nam',
          image: '/uploads/product4.webp',
          size: '42',
          color: 'Trắng',
          quantity: 1,
          price: 750000
        }
      ]
    },
    {
      id: 'DH003',
      date: '2024-12-22',
      status: 'processing',
      statusText: 'Đang xử lý',
      total: 650000,
      items: [
        {
          id: 5,
          name: 'Áo Khoác Bomber',
          image: '/uploads/product5.webp',
          size: 'L',
          color: 'Xanh navy',
          quantity: 1,
          price: 650000
        }
      ]
    },
    {
      id: 'DH004',
      date: '2024-12-25',
      status: 'cancelled',
      statusText: 'Đã hủy',
      total: 400000,
      items: [
        {
          id: 6,
          name: 'Áo Polo Nam',
          image: '/uploads/product6.webp',
          size: 'M',
          color: 'Xanh dương',
          quantity: 2,
          price: 200000
        }
      ]
    }
  ]);

  const tabs = [
    { id: 'all', label: 'Tất cả', count: orders.length },
    { id: 'processing', label: 'Đang xử lý', count: orders.filter(o => o.status === 'processing').length },
    { id: 'shipping', label: 'Đang giao', count: orders.filter(o => o.status === 'shipping').length },
    { id: 'delivered', label: 'Đã giao', count: orders.filter(o => o.status === 'delivered').length },
    { id: 'cancelled', label: 'Đã hủy', count: orders.filter(o => o.status === 'cancelled').length }
  ];

  const filteredOrders = activeTab === 'all' 
    ? orders 
    : orders.filter(order => order.status === activeTab);

  const getStatusColor = (status) => {
    switch (status) {
      case 'processing': return '#ffc107';
      case 'shipping': return '#17a2b8';
      case 'delivered': return '#28a745';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const toggleOrderExpansion = (orderId) => {
    const newExpandedOrders = new Set(expandedOrders);
    if (newExpandedOrders.has(orderId)) {
      newExpandedOrders.delete(orderId);
    } else {
      newExpandedOrders.add(orderId);
    }
    setExpandedOrders(newExpandedOrders);
  };

  return (
    <div className="account-orders-container">
      <h1 className="page-title">Đơn hàng của bạn</h1>
      
      {/* Tabs */}
      <div className="order-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="orders-list">
        {filteredOrders.length === 0 ? (
          <div className="empty-orders">
            <div className="empty-icon">📦</div>
            <h3>Chưa có đơn hàng nào</h3>
            <p>Bạn chưa có đơn hàng nào trong danh mục này.</p>
            <button className="shop-now-btn" onClick={() => window.location.href = '/products'}>
              Mua sắm ngay
            </button>
          </div>
        ) : (
          filteredOrders.map(order => (
            <div key={order.id} className="order-card">
              {/* Order Header */}
              <div className="order-header">
                <div className="order-info">
                  <div className="order-id">
                    <strong>Đơn hàng #{order.id}</strong>
                  </div>
                  <div className="order-date">
                    Đặt hàng: {formatDate(order.date)}
                  </div>
                </div>
                <div className="order-status">
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    {order.statusText}
                  </span>
                  <button 
                    className="expand-btn"
                    onClick={() => toggleOrderExpansion(order.id)}
                    title={expandedOrders.has(order.id) ? "Thu gọn" : "Xem chi tiết"}
                  >
                    <span className={`arrow ${expandedOrders.has(order.id) ? 'expanded' : ''}`}>
                      ▼
                    </span>
                  </button>
                </div>
              </div>

              {/* Order Items */}
              {expandedOrders.has(order.id) && (
                <div className="order-items">
                  {order.items.map(item => (
                    <div key={item.id} className="order-item">
                      <div className="item-image">
                        <img src={item.image} alt={item.name} />
                      </div>
                      <div className="item-details">
                        <h4 className="item-name">{item.name}</h4>
                        <div className="item-specs">
                          <span>Size: {item.size}</span>
                          <span>Màu: {item.color}</span>
                          <span>SL: {item.quantity}</span>
                        </div>
                      </div>
                      <div className="item-price">
                        {formatCurrency(item.price)}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Order Footer */}
              <div className="order-footer">
                <div className="order-total">
                  <strong>Tổng tiền: {formatCurrency(order.total)}</strong>
                </div>
                <div className="order-actions">
                  <button className="btn-secondary">Xem chi tiết</button>
                  {order.status === 'delivered' && (
                    <button className="btn-primary">Đánh giá</button>
                  )}
                  {order.status === 'processing' && (
                    <button className="btn-danger">Hủy đơn</button>
                  )}
                  {order.status === 'delivered' && (
                    <button className="btn-primary">Mua lại</button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AccountMyOrder;
