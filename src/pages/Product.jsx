import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import './Product.css';
import product1 from '../assets/images/product1.webp';
import ProductModal from '../components/ProductModal';

const Product = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category') || 'all';
  const subcategory = searchParams.get('subcategory') || '';
  
  const [favoriteProducts, setFavoriteProducts] = useState(new Set());
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 3000000 });
  const [sortBy, setSortBy] = useState('default');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Sample product data
  const products = [
    {
      id: 1,
      name: "Áo Polo KS25SS38C-SCHE",
      price: 980000,
      originalPrice: null,
      discount: null,
      image: product1,
      category: "ao-polo",
      colors: ['#FFFFFF', '#87CEEB'],
      sizes: ['S', 'M', 'L', 'XL']
    },
    {
      id: 2,
      name: "Áo Polo Nam Tay Ngắn Form Vừa KS25SS37C",
      price: 700000,
      originalPrice: null,
      discount: null,
      image: product1,
      category: "ao-polo",
      colors: ['#90EE90', '#FFFFFF'],
      sizes: ['S', 'M', 'L', 'XL']
    },
    {
      id: 3,
      name: "Áo Polo Nam Tay Ngắn Form Vừa KS25SS36C",
      price: 980000,
      originalPrice: null,
      discount: null,
      image: product1,
      category: "ao-polo",
      colors: ['#FFFFFF', '#87CEEB'],
      sizes: ['S', 'M', 'L', 'XL']
    },
    {
      id: 4,
      name: "Áo Polo Nam Tay Ngắn Form Vừa KS25SS35C",
      price: 700000,
      originalPrice: null,
      discount: null,
      image: product1,
      category: "ao-polo",
      colors: ['#F5F5DC', '#FFFFFF'],
      sizes: ['S', 'M', 'L', 'XL']
    },
    {
      id: 5,
      name: "Áo Polo Nam Tay Ngắn Form Vừa KS25SS34C",
      price: 700000,
      originalPrice: null,
      discount: null,
      image: product1,
      category: "ao-polo",
      colors: ['#000080', '#FFFFFF'],
      sizes: ['S', 'M', 'L', 'XL']
    },
    {
      id: 6,
      name: "Áo Polo Tay Ngắn Form Vừa KS25SS33C",
      price: 800000,
      originalPrice: null,
      discount: null,
      image: product1,
      category: "ao-polo",
      colors: ['#87CEEB', '#FFFFFF'],
      sizes: ['S', 'M', 'L', 'XL']
    },
    {
      id: 7,
      name: "Áo Polo Tay Ngắn Form Vừa KS25SS32C",
      price: 500000,
      originalPrice: null,
      discount: null,
      image: product1,
      category: "ao-polo",
      colors: ['#000080', '#FFFFFF'],
      sizes: ['S', 'M', 'L', 'XL']
    },
    {
      id: 8,
      name: "Áo Polo Tay Ngắn Form Vừa KS25SS31C",
      price: 800000,
      originalPrice: null,
      discount: null,
      image: product1,
      category: "ao-polo",
      colors: ['#FFFFFF', '#87CEEB'],
      sizes: ['S', 'M', 'L', 'XL']
    },
    {
      id: 9,
      name: "Áo Polo Nam Form Vừa Tay Ngắn KS25SS30C",
      price: 550000,
      originalPrice: null,
      discount: null,
      image: product1,
      category: "ao-polo",
      colors: ['#F5F5DC', '#FFFFFF'],
      sizes: ['S', 'M', 'L', 'XL']
    },
    {
      id: 10,
      name: "Áo Polo Nam Form Vừa Tay Ngắn KS25SS29C",
      price: 980000,
      originalPrice: null,
      discount: null,
      image: product1,
      category: "ao-polo",
      colors: ['#FFFFFF', '#87CEEB'],
      sizes: ['S', 'M', 'L', 'XL']
    },
    {
      id: 11,
      name: "Áo Polo Nam Form Vừa Tay Ngắn KS25SS28C",
      price: 550000,
      originalPrice: null,
      discount: null,
      image: product1,
      category: "ao-polo",
      colors: ['#FFFFFF', '#87CEEB'],
      sizes: ['S', 'M', 'L', 'XL']
    },
    {
      id: 12,
      name: "Áo Polo Nam Form Vừa Tay Ngắn KS25SS27C",
      price: 550000,
      originalPrice: null,
      discount: null,
      image: product1,
      category: "ao-polo",
      colors: ['#FFFFFF', '#87CEEB'],
      sizes: ['S', 'M', 'L', 'XL']
    }
  ];

  // Available colors and sizes
  const availableColors = [
    { name: 'Trắng', value: '#FFFFFF' },
    { name: 'Black', value: '#000000' },
    { name: 'Navy', value: '#000080' },
    { name: 'Xanh dương', value: '#87CEEB' },
    { name: 'Xanh lá', value: '#90EE90' },
    { name: 'Be', value: '#F5F5DC' },
    { name: 'Đỏ', value: '#FF0000' }
  ];

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  // Filter products based on category and filters
  const filteredProducts = products.filter(product => {
    if (category !== 'all' && product.category !== category) return false;
    if (selectedColors.length > 0 && !product.colors.some(color => selectedColors.includes(color))) return false;
    if (selectedSizes.length > 0 && !product.sizes.some(size => selectedSizes.includes(size))) return false;
    if (product.price < priceRange.min || product.price > priceRange.max) return false;
    return true;
  });

  const toggleFavorite = (productId) => {
    const newFavorites = new Set(favoriteProducts);
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId);
    } else {
      newFavorites.add(productId);
    }
    setFavoriteProducts(newFavorites);
  };

  const toggleColor = (color) => {
    setSelectedColors(prev => 
      prev.includes(color) 
        ? prev.filter(c => c !== color)
        : [...prev, color]
    );
  };

  const toggleSize = (size) => {
    setSelectedSizes(prev => 
      prev.includes(size) 
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const getCategoryTitle = () => {
    const categoryMap = {
      'ao-polo': 'Áo Polo',
      'ao-so-mi': 'Áo Sơ Mi',
      'ao-thun': 'Áo Thun',
      'ao-len': 'Áo Len',
      'ao-khoac': 'Áo Khoác',
      'ao-vest-blazer': 'Áo Vest - Blazer',
      'all': 'Tất cả sản phẩm'
    };
    return categoryMap[category] || 'Sản phẩm';
  };

  return (
    <div className="product-page">
      <div className="product-container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/" className="breadcrumb-link">Trang chủ</Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-text">Danh mục</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{getCategoryTitle()}</span>
        </nav>

        <div className="product-layout">
          {/* Sidebar Filter */}
          <aside className="product-sidebar">
            {/* Category Filter */}
            <div className="filter-group">
              <h3 className="filter-title">Danh mục</h3>
              <div className="filter-dropdown">
                <select className="category-select" value={category}>
                  <option value="all">Tất cả</option>
                  <option value="ao-polo">Áo Polo</option>
                  <option value="ao-so-mi">Áo Sơ Mi</option>
                  <option value="ao-thun">Áo Thun</option>
                  <option value="ao-len">Áo Len</option>
                  <option value="ao-khoac">Áo Khoác</option>
                </select>
              </div>
            </div>

            {/* Color Filter */}
            <div className="filter-group">
              <h3 className="filter-title">Màu sắc</h3>
              <div className="color-filters">
                {availableColors.map((color) => (
                  <label key={color.value} className="color-filter-item">
                    <input
                      type="checkbox"
                      checked={selectedColors.includes(color.value)}
                      onChange={() => toggleColor(color.value)}
                      className="color-checkbox"
                    />
                    <span className="color-label">
                      <span 
                        className="color-swatch"
                        style={{ backgroundColor: color.value }}
                      />
                      {color.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="filter-group">
              <h3 className="filter-title">Giá</h3>
              <div className="price-filter">
                <div className="price-range">
                  <input
                    type="range"
                    min="0"
                    max="3000000"
                    step="50000"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({...priceRange, max: parseInt(e.target.value)})}
                    className="price-slider"
                  />
                </div>
                <div className="price-inputs">
                  <div className="price-input-group">
                    <label>Minimum</label>
                    <input
                      type="number"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({...priceRange, min: parseInt(e.target.value) || 0})}
                      className="price-input"
                    />
                    <span className="currency">đ</span>
                  </div>
                  <div className="price-input-group">
                    <label>Maximum</label>
                    <input
                      type="number"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({...priceRange, max: parseInt(e.target.value) || 3000000})}
                      className="price-input"
                    />
                    <span className="currency">đ</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Size Filter */}
            <div className="filter-group">
              <h3 className="filter-title">Size</h3>
              <div className="size-filters">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    className={`size-btn ${selectedSizes.includes(size) ? 'active' : ''}`}
                    onClick={() => toggleSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="product-main">
            {/* Header with count and sort */}
            <div className="product-header">
              <h2 className="product-count">Có {filteredProducts.length} sản phẩm</h2>
              <select 
                className="sort-select" 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="default">Sắp xếp theo</option>
                <option value="price-asc">Giá: Thấp → Cao</option>
                <option value="price-desc">Giá: Cao → Thấp</option>
                <option value="name-asc">Tên: A → Z</option>
                <option value="name-desc">Tên: Z → A</option>
              </select>
            </div>

            {/* Products Grid */}
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <div key={product.id} className="product-card">
                  {/* Product Image - Clickable */}
                  <Link to={`/product/${product.id}`} className="product-image-container">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="product-image"
                    />
                    {product.discount && (
                      <span className="discount-badge">-{product.discount}%</span>
                    )}
                  </Link>

                  {/* Product Info */}
                  <div className="product-info">
                    <Link to={`/product/${product.id}`} className="product-name-link">
                      <h3 className="product-name">{product.name}</h3>
                    </Link>

                    {/* Price and Actions */}
                    <div className="price-actions-container">
                      <div className="product-price">
                        <span className="current-price">{formatPrice(product.price)}</span>
                        {product.originalPrice && (
                          <span className="original-price">{formatPrice(product.originalPrice)}</span>
                        )}
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="product-actions">
                        <button 
                          className={`action-btn favorite-btn ${favoriteProducts.has(product.id) ? 'active' : ''}`}
                          onClick={() => toggleFavorite(product.id)}
                        >
                          {favoriteProducts.has(product.id) ? '♥' : '♡'}
                        </button>
                        <button 
                          className="action-btn cart-btn"
                          onClick={() => handleOpenModal(product)}
                        >
                          🛒
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="pagination">
              <button className="page-btn">‹</button>
              <button className="page-btn active">1</button>
              <button className="page-btn">2</button>
              <button className="page-btn">3</button>
              <button className="page-btn">4</button>
              <button className="page-btn">›</button>
            </div>
          </main>
        </div>

        {/* Contact Icons */}
        <div className="contact-icons">
          <a href="tel:+84123456789" className="contact-icon phone-icon">
            📞
          </a>
          <a href="#" className="contact-icon messenger-icon">
            💬
          </a>
          <a href="#" className="contact-icon zalo-icon">
            💬
          </a>
          <button className="contact-icon back-to-top" onClick={() => window.scrollTo(0, 0)}>
            ↑
          </button>
        </div>

        {/* Product Modal */}
        <ProductModal 
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </div>
  );
};

export default Product; 