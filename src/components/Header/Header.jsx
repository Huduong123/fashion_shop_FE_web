import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Header.css';
import CartModal from '../CartModal';
import UserDropdown from '../UserDropdown';
import categoryService from '../../services/categoryService';

const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const [showCartModal, setShowCartModal] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [categories, setCategories] = useState([]);
  const [menuLoading, setMenuLoading] = useState(true);
  const [childrenCache, setChildrenCache] = useState({}); // Cache children by parentId
  const [loadingChildren, setLoadingChildren] = useState({}); // Track loading state for children

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setMenuLoading(true);
        const categoriesData = await categoryService.getRootCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        // Fallback to empty array if API fails
        setCategories([]);
      } finally {
        setMenuLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Function to handle navigation to products page
  const handleProductNavigation = (category, subcategory = '') => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (subcategory) params.set('subcategory', subcategory);
    navigate(`/products?${params.toString()}`);
  };

  // Function to handle category navigation with proper URL generation
  const handleCategoryNavigation = async (category) => {
    try {
      const slug = category.slug || await categoryService.getSlugByCategoryId(category.id);
      navigate(`/products?category=${slug}`);
    } catch (error) {
      console.error('Error navigating to category:', error);
      navigate('/products');
    }
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

  // Function to fetch children categories
  const fetchChildrenCategories = async (parentId) => {
    // Return from cache if already loaded
    if (childrenCache[parentId]) {
      return childrenCache[parentId];
    }

    // Return empty if already loading
    if (loadingChildren[parentId]) {
      return [];
    }

    try {
      setLoadingChildren(prev => ({ ...prev, [parentId]: true }));
      const children = await categoryService.getChildrenByParentId(parentId);
      
      // Cache the result
      setChildrenCache(prev => ({ ...prev, [parentId]: children }));
      
      return children;
    } catch (error) {
      console.error('Failed to fetch children categories:', error);
      return [];
    } finally {
      setLoadingChildren(prev => ({ ...prev, [parentId]: false }));
    }
  };

  // Function to handle mouse enter on category item
  const handleCategoryMouseEnter = async (categoryId, hasChildren) => {
    if (hasChildren && !childrenCache[categoryId] && !loadingChildren[categoryId]) {
      await fetchChildrenCategories(categoryId);
    }
  };

  // Function to build menu data from categories
  const buildMenuData = () => {
    const menuData = [];

    // Add dynamic categories from API
    categories.forEach(category => {
      // Only show ACTIVE categories
      if (category.status === 'ACTIVE') {
        const menuItem = {
          id: category.id,
          label: category.name.toUpperCase(),
          action: () => handleCategoryNavigation(category),
          categoryId: category.id,
          type: category.type,
          childrenCount: category.childrenCount || 0,
          hasChildren: (category.childrenCount || 0) > 0
        };

        menuData.push(menuItem);
      }
    });

    // Always add BLOG menu at the end
    menuData.push({
      label: 'BLOG',
      action: () => navigate('/blog')
    });

    return menuData;
  };

  // Function to render dropdown children
  const renderDropdownChildren = (parentId, level = 1) => {
    const children = childrenCache[parentId] || [];
    const isLoading = loadingChildren[parentId];

    if (isLoading) {
      return (
        <li className="dropdown-item">
          <span className="dropdown-link loading">Đang tải...</span>
        </li>
      );
    }

    if (children.length === 0) {
      return null;
    }

    return children.map((child) => (
      <li 
        key={child.id} 
        className="dropdown-item"
        onMouseEnter={() => handleCategoryMouseEnter(child.id, child.childrenCount > 0)}
      >
        <button 
          onClick={() => handleCategoryNavigation(child)} 
          className="dropdown-link"
        >
          {child.name}
          {child.type === 'DROPDOWN' && child.childrenCount > 0 && <span className="arrow">›</span>}
        </button>
        
        {/* Level 2 Submenu for DROPDOWN type categories */}
        {child.type === 'DROPDOWN' && child.childrenCount > 0 && (
          <div className="submenu">
            <ul className="submenu-list">
              {renderDropdownChildren(child.id, level + 1)}
            </ul>
          </div>
        )}
      </li>
    ));
  };

  const menuData = buildMenuData();

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
          {menuLoading ? (
            <div className="menu-loading">Loading...</div>
          ) : (
            <ul className="nav-list">
              {menuData.map((item, index) => (
                <li 
                  key={index} 
                  className="nav-item"
                  onMouseEnter={() => item.hasChildren && handleCategoryMouseEnter(item.categoryId, item.hasChildren)}
                >
                  <button 
                    onClick={item.action} 
                    className="nav-link"
                  >
                    {item.label}
                  </button>
                  
                  {/* Dropdown for categories with children */}
                  {item.hasChildren && (
                    <div className="dropdown">
                      <ul className="dropdown-list">
                        {renderDropdownChildren(item.categoryId)}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
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