import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import orderService from '../../../services/orderService'; 
import './AccountMyOrder.css';
import { useAuth } from '../../../contexts/AuthContext';

const AccountMyOrder = () => {
  const { user } = useAuth(); 
  const [activeTab, setActiveTab] = useState('all');
  const [expandedOrders, setExpandedOrders] = useState(new Set());

  // --- STATE ĐỂ QUẢN LÝ DỮ LIỆU TỪ API ---
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // --- GỌI API KHI COMPONENT ĐƯỢC MOUNT ---
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        // Gọi API để lấy danh sách đơn hàng, bạn có thể truyền tham số phân trang ở đây
        const response = await orderService.getUserOrders(0, 10);
        setOrders(response.content); // API trả về dữ liệu trong thuộc tính 'content'
      } catch (err) {
        console.error("Lỗi khi tải đơn hàng:", err);
        setError("Không thể tải danh sách đơn hàng. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []); 

 const handleCancelOrder = async (orderId) => {
  if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?')) {
    return;
  }
  try {
    await orderService.cancelOrder(orderId);
    setOrders(currentOrders =>
      currentOrders.map(order =>
        order.id === orderId
          ? { ...order, status: 'CANCELLED' } // Cập nhật trạng thái của đơn hàng vừa hủy
          : order
      )
    );

    // (Tùy chọn) Hiển thị thông báo thành công
    alert('Đã hủy đơn hàng thành công!');

  } catch (err) {
    console.error("Lỗi khi hủy đơn hàng:", err);
    // (Tùy chọn) Hiển thị thông báo lỗi
    alert('Hủy đơn hàng thất bại. Vui lòng thử lại.');
  }
};
  // --- HÀM HỖ TRỢ ---

  // Ánh xạ trạng thái từ backend sang frontend (text, class, color)
  const mapOrderStatus = (status) => {
    switch (status) {
      case 'PENDING':
        return { text: 'Đang xử lý', className: 'processing', color: '#ffc107' };
      case 'PAID':
        return { text: 'Đã thanh toán', className: 'processing', color: '#ffc107' }; // Có thể coi là đang xử lý
      case 'SHIPPED':
        return { text: 'Đang giao', className: 'shipping', color: '#17a2b8' };
      // Giả sử bạn sẽ có trạng thái DELIVERED trong tương lai
      case 'DELIVERED':
        return { text: 'Đã giao', className: 'delivered', color: '#28a745' };
      case 'CANCELLED':
        return { text: 'Đã hủy', className: 'cancelled', color: '#dc3545' };
      default:
        return { text: status, className: 'default', color: '#6c757d' };
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

  // --- LOGIC LỌC VÀ HIỂN THỊ ---

  const tabs = [
    { id: 'all', label: 'Tất cả' },
    { id: 'processing', label: 'Đang xử lý', apiStatus: ['PENDING', 'PAID'] },
    { id: 'shipping', label: 'Đang giao', apiStatus: ['SHIPPED'] },
    { id: 'delivered', label: 'Đã giao', apiStatus: ['DELIVERED'] }, // Giả định
    { id: 'cancelled', label: 'Đã hủy', apiStatus: ['CANCELLED'] }
  ];

  const filteredOrders = activeTab === 'all'
    ? orders
    : orders.filter(order => {
        const activeTabData = tabs.find(tab => tab.id === activeTab);
        return activeTabData.apiStatus.includes(order.status);
      });

  // --- RENDER ---

  if (loading) {
    return <div className="account-orders-container"><p>Đang tải đơn hàng...</p></div>;
  }

  if (error) {
    return <div className="account-orders-container"><p style={{ color: 'red' }}>{error}</p></div>;
  }

  return (
    <div className="account-orders-container">
      <h1 className="page-title">Đơn hàng của bạn</h1>

      {/* Tabs */}
      <div className="order-tabs">
        {tabs.map(tab => {
           const count = tab.id === 'all'
           ? orders.length
           : orders.filter(o => tab.apiStatus.includes(o.status)).length;

          return (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label} ({count})
            </button>
          )
        })}
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
          filteredOrders.map(order => {
            const orderStatus = mapOrderStatus(order.status);
            return (
              <div key={order.id} className="order-card">
                {/* Order Header */}
                <div className="order-header">
                  <div className="order-info">
                    <div className="order-id">
                      <strong>Đơn hàng #{order.id}</strong>
                    </div>
                    <div className="order-date">
                      Đặt hàng: {formatDate(order.createdAt)}
                    </div>
                  </div>
                  <div className="order-status">
                    <span
                      className="status-badge"
                      style={{ backgroundColor: orderStatus.color }}
                    >
                      {orderStatus.text}
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
                                        {order.orderItems.map(item => (
                                            // BƯỚC 2: BỌC CÁC PHẦN TỬ BẰNG THẺ LINK
                                            <div key={item.productVariantId} className="order-item">
                                                {/* Bọc hình ảnh */}
                                                <Link to={`/product/${item.productId}`} className="item-image">
                                                    <img src={item.imageUrl} alt={item.productName} />
                                                </Link>
                                                <div className="item-details">
                                                    {/* Bọc tên sản phẩm */}
                                                    <h4 className="item-name">
                                                        <Link to={`/product/${item.productId}`} className="product-link">
                                                            {item.productName}
                                                        </Link>
                                                    </h4>
                                                    <div className="item-specs">
                                                        <span>Size: {item.sizeName}</span>
                                                        <span>Màu: {item.colorName}</span>
                                                        <span>SL: {item.quantity}</span>
                                                    </div>
                                                </div>
                                                <div className="item-price">{formatCurrency(item.price)}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                {/* Order Footer */}
                <div className="order-footer">
                  <div className="order-total">
                    <strong>Tổng tiền: {formatCurrency(order.totalPrice)}</strong>
                  </div>
                  <div className="order-actions">

                    {order.status === 'DELIVERED' && ( // Giả định
                      <button className="btn-primary">Đánh giá</button>
                    )}
                    {order.status === 'PENDING' && (
                      <button className="btn-danger" onClick={() => handleCancelOrder(order.id)}>Hủy đơn</button>
                    )}
                   
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  );
};

export default AccountMyOrder;