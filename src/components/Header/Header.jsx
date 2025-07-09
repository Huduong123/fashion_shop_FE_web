import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <div className="logo">
          <h1>COUPLE TX</h1>
        </div>

        {/* Navigation Menu */}
        <nav className="nav-menu">
          <ul className="nav-list">
            <li className="nav-item">
              <a href="#" className="nav-link">HÀNG MỚI</a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">ÁO KHOÁC</a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">NAM</a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">NỮ</a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">ĐỒ ĐÔI</a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">SALE</a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">PHỤ KIỆN</a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">UCUSTOM</a>
            </li>
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
          <div className="header-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>

          {/* Cart Icon */}
          <div className="header-icon cart-icon">
            <div className="cart-wrapper">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="8" cy="21" r="1"></circle>
                <circle cx="19" cy="21" r="1"></circle>
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
              </svg>
              <span className="cart-count">0</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;