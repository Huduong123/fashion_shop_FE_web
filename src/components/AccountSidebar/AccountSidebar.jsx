import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
// Import các icon cần thiết từ thư viện react-icons
import { 
  FaUser, 
  FaBoxOpen, 
  FaHeart, 
  FaHome, 
  FaGem, 
  FaSignOutAlt 
} from 'react-icons/fa';
import './AccountSidebar.css';

// URL logo của John Henry để làm ví dụ
const logoUrl = 'https://file.hstatic.net/1000353426/file/logo-john-henry-09_1a3c6319807548a29b400a581432f9c4.png';

const AccountSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    {
      path: '/account/profile',
      label: 'THÔNG TIN CÁ NHÂN',
      icon: <FaUser />
    },
    {
      path: '/account/orders',
      label: 'ĐƠN HÀNG CỦA BẠN',
      icon: <FaBoxOpen />
    },
    {
      path: '/account/favorites',
      label: 'SẢN PHẨM YÊU THÍCH',
      icon: <FaHeart />
    },
    {
      path: '/account/addresses',
      label: 'ĐỊA CHỈ GIAO HÀNG',
      icon: <FaHome />
    },
    {
      path: '/account/membership',
      label: 'CHÍNH SÁCH MEMBERSHIP',
      icon: <FaGem />
    }
  ];

  return (
    <div className="account-sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        {/* Thay thế logoUrl bằng logo của bạn */}
        <img src={logoUrl} alt="Brand Logo" className="logo-image" />
      </div>

      {/* User Info */}
      <div className="user-info">
        <div className="user-name">{user?.name || 'Nguyễn Tư'}</div>
        <div className="user-email">{user?.email || 'nguyentuanh09788@gmail.com'}</div>
        <div className="user-points">
          <span>Điểm: </span>
          <span className="points-value">0</span>
        </div>
      </div>

      {/* Menu Items */}
      <div className="sidebar-menu">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="menu-icon">{item.icon}</span>
            <span className="menu-label">{item.label}</span>
          </Link>
        ))}
        
        {/* Logout */}
        <button className="menu-item logout-item" onClick={handleLogout}>
          <span className="menu-icon"><FaSignOutAlt /></span>
          <span className="menu-label">ĐĂNG XUẤT</span>
        </button>
      </div>
    </div>
  );
};

export default AccountSidebar;