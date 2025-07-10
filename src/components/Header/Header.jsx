import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Header.css';
import CartModal from '../CartModal';
import UserDropdown from '../UserDropdown';

const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const [showCartModal, setShowCartModal] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Function to handle navigation to products page
  const handleProductNavigation = (category, subcategory = '') => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (subcategory) params.set('subcategory', subcategory);
    navigate(`/products?${params.toString()}`);
  };

  // Function to handle user icon click
  const handleUserIconClick = () => {
    if (isAuthenticated) {
      setShowUserDropdown(!showUserDropdown);
    } else {
      navigate('/login');
    }
  };



  // Function to handle cart icon click
  const handleCartIconClick = () => {
    setShowCartModal(true);
  };

  // Function to close cart modal
  const closeCartModal = () => {
    setShowCartModal(false);
  };

  // Function to close user dropdown
  const closeUserDropdown = () => {
    setShowUserDropdown(false);
  };

  // Function to handle logout
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Menu data structure with dropdowns
  const menuData = [
    {
      label: 'HÀNG MỚI',
      action: () => handleProductNavigation('all', 'Hàng mới'),
      dropdown: [
        { label: 'Sản phẩm mới nhất', action: () => handleProductNavigation('all', 'Sản phẩm mới nhất') },
        { label: 'Xu hướng hot', action: () => handleProductNavigation('all', 'Xu hướng hot') },
        { label: 'Best seller', action: () => handleProductNavigation('all', 'Best seller') }
      ]
    },
    {
      label: 'ÁO KHOÁC',
      action: () => handleProductNavigation('ao-khoac'),
      dropdown: [
        { label: 'Áo khoác nam', action: () => handleProductNavigation('ao-khoac', 'Nam') },
        { label: 'Áo khoác nữ', action: () => handleProductNavigation('ao-khoac', 'Nữ') },
        { label: 'Áo khoác cặp', action: () => handleProductNavigation('ao-khoac', 'Cặp') }
      ]
    },
    {
      label: 'NAM',
      action: () => handleProductNavigation('all', 'Nam'),
      dropdown: [
        {
          label: 'ÁO NAM',
          action: () => handleProductNavigation('all', 'Áo Nam'),
          submenu: [
            { label: 'ÁO POLO', action: () => handleProductNavigation('ao-polo') },
            { label: 'ÁO SƠ MI', action: () => handleProductNavigation('ao-so-mi') },
            { label: 'ÁO THUN', action: () => handleProductNavigation('ao-thun') },
            { label: 'ÁO LEN', action: () => handleProductNavigation('ao-len') },
            { label: 'ÁO KHOÁC', action: () => handleProductNavigation('ao-khoac') },
            { label: 'ÁO VEST - BLAZER', action: () => handleProductNavigation('ao-vest-blazer') }
          ]
        },
        {
          label: 'QUẦN NAM',
          action: () => handleProductNavigation('all', 'Quần Nam'),
          submenu: [
            { label: 'Quần jean', action: () => handleProductNavigation('quan-jean') },
            { label: 'Quần kaki', action: () => handleProductNavigation('quan-kaki') },
            { label: 'Quần short', action: () => handleProductNavigation('quan-short') },
            { label: 'Quần tây', action: () => handleProductNavigation('quan-tay') }
          ]
        },
        {
          label: 'PHỤ KIỆN NAM',
          action: () => handleProductNavigation('all', 'Phụ kiện Nam'),
          submenu: [
            { label: 'Giày dép', action: () => handleProductNavigation('giay-dep') },
            { label: 'Túi xách', action: () => handleProductNavigation('tui-xach') },
            { label: 'Đồng hồ', action: () => handleProductNavigation('dong-ho') },
            { label: 'Mũ nón', action: () => handleProductNavigation('mu-non') }
          ]
        }
      ]
    },
    {
      label: 'NỮ',
      action: () => handleProductNavigation('all', 'Nữ'),
      dropdown: [
        {
          label: 'ÁO NỮ',
          action: () => handleProductNavigation('all', 'Áo Nữ'),
          submenu: [
            { label: 'Áo thun nữ', action: () => handleProductNavigation('ao-thun-nu') },
            { label: 'Áo sơ mi nữ', action: () => handleProductNavigation('ao-so-mi-nu') },
            { label: 'Áo kiểu', action: () => handleProductNavigation('ao-kieu') },
            { label: 'Áo len nữ', action: () => handleProductNavigation('ao-len-nu') }
          ]
        },
        {
          label: 'QUẦN NỮ',
          action: () => handleProductNavigation('all', 'Quần Nữ'),
          submenu: [
            { label: 'Quần jean nữ', action: () => handleProductNavigation('quan-jean-nu') },
            { label: 'Quần tây nữ', action: () => handleProductNavigation('quan-tay-nu') },
            { label: 'Quần short nữ', action: () => handleProductNavigation('quan-short-nu') },
            { label: 'Váy', action: () => handleProductNavigation('vay') }
          ]
        },
        {
          label: 'PHỤ KIỆN NỮ',
          action: () => handleProductNavigation('all', 'Phụ kiện Nữ'),
          submenu: [
            { label: 'Giày cao gót', action: () => handleProductNavigation('giay-cao-got') },
            { label: 'Túi xách nữ', action: () => handleProductNavigation('tui-xach-nu') },
            { label: 'Trang sức', action: () => handleProductNavigation('trang-suc') },
            { label: 'Mũ nón nữ', action: () => handleProductNavigation('mu-non-nu') }
          ]
        }
      ]
    },
    {
      label: 'ĐỒ ĐÔI',
      action: () => handleProductNavigation('all', 'Đồ đôi'),
      dropdown: [
        { label: 'Áo đôi', action: () => handleProductNavigation('ao-doi') },
        { label: 'Quần đôi', action: () => handleProductNavigation('quan-doi') },
        { label: 'Set đồ đôi', action: () => handleProductNavigation('set-do-doi') }
      ]
    },
    {
      label: 'SALE',
      action: () => handleProductNavigation('all', 'Sale'),
      dropdown: [
        { label: 'Sale 30%', action: () => handleProductNavigation('all', 'Sale 30%') },
        { label: 'Sale 50%', action: () => handleProductNavigation('all', 'Sale 50%') },
        { label: 'Sale 70%', action: () => handleProductNavigation('all', 'Sale 70%') },
        { label: 'Liquidation', action: () => handleProductNavigation('all', 'Liquidation') }
      ]
    },
    {
      label: 'PHỤ KIỆN',
      action: () => handleProductNavigation('all', 'Phụ kiện'),
      dropdown: [
        { label: 'Giày dép', action: () => handleProductNavigation('giay-dep') },
        { label: 'Túi xách', action: () => handleProductNavigation('tui-xach') },
        { label: 'Đồng hồ', action: () => handleProductNavigation('dong-ho') },
        { label: 'Mũ nón', action: () => handleProductNavigation('mu-non') },
        { label: 'Kính mát', action: () => handleProductNavigation('kinh-mat') }
      ]
    },
    {
      label: 'BLOG',
      action: () => navigate('/blog')
    }
  ];

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <div className="logo">
          <Link to="/" className="logo-link">
            <h1>NTA GROUP</h1>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="nav-menu">
          <ul className="nav-list">
            {menuData.map((item, index) => (
              <li key={index} className="nav-item">
                <button 
                  onClick={item.action} 
                  className="nav-link"
                >
                  {item.label}
                </button>
                
                {/* Level 1 Dropdown */}
                {item.dropdown && (
                  <div className="dropdown">
                    <ul className="dropdown-list">
                      {item.dropdown.map((dropdownItem, dropdownIndex) => (
                        <li key={dropdownIndex} className="dropdown-item">
                          <button 
                            onClick={dropdownItem.action} 
                            className="dropdown-link"
                          >
                            {dropdownItem.label}
                            {dropdownItem.submenu && <span className="arrow">›</span>}
                          </button>
                          
                          {/* Level 2 Submenu */}
                          {dropdownItem.submenu && (
                            <div className="submenu">
                              <ul className="submenu-list">
                                {dropdownItem.submenu.map((submenuItem, submenuIndex) => (
                                  <li key={submenuIndex} className="submenu-item">
                                    <button 
                                      onClick={submenuItem.action} 
                                      className="submenu-link"
                                    >
                                      {submenuItem.label}
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Right Side - Search, User, Cart */}
        <div className="header-right">
          {/* Search */}
          <div className="search-container">
            <input 
              type="text" 
              placeholder="TÌM KIẾM" 
              className="search-input"
            />
            <button className="search-btn">
              {/* Thay icon tìm kiếm cho giống hình ảnh */}
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="6" cy="6" r="5" />
              </svg>
            </button>
          </div>

          {/* User Icon */}
          <div className="header-icon user-icon-container" onClick={handleUserIconClick} style={{ cursor: 'pointer', position: 'relative' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            
            {/* User Dropdown */}
            <UserDropdown 
              isVisible={showUserDropdown}
              onClose={closeUserDropdown}
              onLogout={handleLogout}
            />
          </div>

          {/* Cart Icon */}
          <div className="header-icon cart-icon" onClick={handleCartIconClick} style={{ cursor: 'pointer' }}>
            <div className="cart-wrapper">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="8" cy="21" r="1"></circle>
                <circle cx="19" cy="21" r="1"></circle>
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
              </svg>
              <span className="cart-count">4</span>
            </div>
          </div>
        </div>
      </div>



      {/* Cart Modal */}
      <CartModal 
        isOpen={showCartModal} 
        onClose={closeCartModal} 
      />
    </header>
  );
};

export default Header;