import React from 'react';
import { Link } from 'react-router-dom';
import './UserDropdown.css';

const UserDropdown = ({ isVisible, onClose, onLogout }) => {
  const handleLogout = () => {
    onLogout();
    onClose();
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Overlay to close dropdown when clicking outside */}
      <div className="dropdown-overlay" onClick={onClose}></div>
      
      <div className="user-dropdown">
        <div className="dropdown-header">
          <span className="greeting">HI</span>
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