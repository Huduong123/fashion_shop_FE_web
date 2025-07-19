import React from 'react';
import { Link } from 'react-router-dom';
import './UserDropdown.css';
// import { useAuth } from '../../contexts/AuthContext'; // <--- XÓA DÒNG NÀY ĐI

// Component này chỉ nhận props, không gọi hook context.
const UserDropdown = ({ isVisible, onClose, onLogout, user }) => {

  const handleLogout = () => {
    onLogout();
    onClose();
  };

  if (!isVisible) return null;

  return (
    <>
      <div className="dropdown-overlay" onClick={onClose}></div>
      
      <div className="user-dropdown">
        <div className="dropdown-header">
          <span className="greeting">
            {/* Logic này đã an toàn và đúng */}
            Chào, {user?.fullname || user?.username || 'Khách'}
          </span>
        </div>
        
        <div className="dropdown-content">
          <Link to="/account/profile" className="dropdown-item" onClick={onClose}>
            <span>Tài khoản của tôi</span>
          </Link>
          
          <Link to="/account/addresses" className="dropdown-item" onClick={onClose}>
            <span>Danh sách địa chỉ</span>
          </Link>
          
          <button className="dropdown-item logout-item" onClick={handleLogout}>
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default UserDropdown;