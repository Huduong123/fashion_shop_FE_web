import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import './Product.css';
import ProductModal from '../components/ProductModal';
import productService from '../services/productService';
import categoryService from '../services/categoryService';

const Product = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') || 'all';
  const subcategory = searchParams.get('subcategory') || '';
  
  // State for products and UI
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  // State for dynamic categories
  const [availableCategories, setAvailableCategories] = useState([]);
  const [categoryDisplayName, setCategoryDisplayName] = useState('Tất cả sản phẩm');
  const [flattenedCategories, setFlattenedCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  
  // Filter and UI states
  const [favoriteProducts, setFavoriteProducts] = useState(new Set());
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 3000000 });
  const [sortBy, setSortBy] = useState('default');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Available colors and sizes - these will be populated from backend data
  const [availableColors, setAvailableColors] = useState([
    { name: 'Trắng', value: '#FFFFFF' },
    { name: 'Black', value: '#000000' },
    { name: 'Navy', value: '#000080' },
    { name: 'Xanh dương', value: '#87CEEB' },
    { name: 'Xanh lá', value: '#90EE90' },
    { name: 'Be', value: '#F5F5DC' },
    { name: 'Đỏ', value: '#FF0000' }
  ]);

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  // Fetch categories when component mounts
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch products when component mounts or filters change
  useEffect(() => {
    fetchProducts();
    updateCategoryDisplayName();
  }, [category, subcategory, currentPage, sortBy]);

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get category ID from URL category slug
      const categoryId = await categoryService.getCategoryIdBySlug(category);
      
      // Prepare filters
      const filters = {
        page: currentPage,
        size: 12, // Products per page
        sort: getSortParameters(),
        categoryId: categoryId
      };

      // Add price filters if they're not default
      if (priceRange.min > 0) {
        filters.minPrice = priceRange.min;
      }
      if (priceRange.max < 3000000) {
        filters.maxPrice = priceRange.max;
      }

      // Fetch products
      let result;
      if (categoryId) {
        result = await productService.getVisibleProductsByCategory(categoryId, filters);
      } else {
        result = await productService.getAllVisibleProducts(filters);
      }

      if (result.success) {
        // Transform backend data to frontend format
        const transformedProducts = result.data.content.map(product => 
          productService.transformProductData(product)
        );
        
        setProducts(transformedProducts);
        setTotalProducts(result.data.totalElements);
        setTotalPages(result.data.totalPages);
        setCurrentPage(result.data.number);
      } else {
        setError(result.message || 'Failed to fetch products');
        setProducts([]);
        setTotalProducts(0);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('An error occurred while fetching products');
      setProducts([]);
      setTotalProducts(0);
    } finally {
      setLoading(false);
    }
  };

  // Fetch available categories for dropdown
  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const rootCategories = await categoryService.getCategoryHierarchy();
      setAvailableCategories(rootCategories);
      
      // Fetch children for categories that have children
      const categoriesWithChildren = await fetchCategoriesWithChildren(rootCategories);
      
      // Flatten categories for the dropdown (including children)
      const flattened = flattenCategories(categoriesWithChildren);
      setFlattenedCategories(flattened);
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Use fallback categories if API fails
      setAvailableCategories([]);
      setFlattenedCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  };

  // Fetch children for categories that have childrenCount > 0
  const fetchCategoriesWithChildren = async (categories) => {
    const categoriesWithChildren = [];
    
    for (const category of categories) {
      const categoryWithChildren = { ...category };
      
      // Fetch children if category has children count > 0
      if (category.childrenCount > 0) {
        try {
          const children = await categoryService.getChildrenByParentId(category.id);
          categoryWithChildren.children = children;
        } catch (error) {
          console.error(`Error fetching children for category ${category.id}:`, error);
          categoryWithChildren.children = [];
        }
      } else {
        categoryWithChildren.children = [];
      }
      
      categoriesWithChildren.push(categoryWithChildren);
    }
    
    return categoriesWithChildren;
  };

  // Helper function to flatten category hierarchy
  const flattenCategories = (categories, prefix = '') => {
    let result = [];
    
    categories.forEach(category => {
      // Add current category
      result.push({
        ...category,
        displayName: prefix + category.name,
        indent: prefix.length > 0
      });
      
      // Add children if they exist (for DROPDOWN type categories)
      if (category.children && category.children.length > 0) {
        const childPrefix = prefix + '  '; // Indent with spaces
        result = result.concat(flattenCategories(category.children, childPrefix));
      }
    });
    
    return result;
  };

  // Update category display name
  const updateCategoryDisplayName = async () => {
    try {
      if (!category || category === 'all') {
        setCategoryDisplayName('Tất cả sản phẩm');
      } else {
        const displayName = await categoryService.getCategoryDisplayName(category);
        setCategoryDisplayName(displayName);
      }
    } catch (error) {
      console.error('Error updating category display name:', error);
      setCategoryDisplayName('Sản phẩm');
    }
  };

  // Convert frontend sort option to backend sort parameters
  const getSortParameters = () => {
    switch (sortBy) {
      case 'price-asc':
        return ['productVariants.minPrice,asc'];
      case 'price-desc':
        return ['productVariants.maxPrice,desc'];
      case 'name-asc':
        return ['name,asc'];
      case 'name-desc':
        return ['name,desc'];
      default:
        return ['createdAt,desc'];
    }
  };

  // Filter products based on client-side filters (colors, sizes)
  const getFilteredProducts = () => {
    return products.filter(product => {
      // Color filter
      if (selectedColors.length > 0) {
        const hasMatchingColor = product.colors?.some(color => 
          selectedColors.includes(color.value)
        );
        if (!hasMatchingColor) return false;
      }

      // Size filter
      if (selectedSizes.length > 0) {
        const hasMatchingSize = product.sizes?.some(size => 
          selectedSizes.includes(size)
        );
        if (!hasMatchingSize) return false;
      }

      return true;
    });
  };

  const filteredProducts = getFilteredProducts();

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Handle sort change
  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    setCurrentPage(0); // Reset to first page when sorting changes
  };

  // Handle price range change (trigger new API call)
  const handlePriceRangeChange = (newRange) => {
    setPriceRange(newRange);
    setCurrentPage(0);
    // Debounce the API call
    clearTimeout(handlePriceRangeChange.timeoutId);
    handlePriceRangeChange.timeoutId = setTimeout(() => {
      fetchProducts();
    }, 500);
  };

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
    return categoryDisplayName;
  };

  // Render pagination
  const renderPagination = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="pagination">
        <button 
          className="page-btn" 
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0}
        >
          ‹
        </button>
        
        {pageNumbers.map(pageNum => (
          <button
            key={pageNum}
            className={`page-btn ${currentPage === pageNum ? 'active' : ''}`}
            onClick={() => handlePageChange(pageNum)}
          >
            {pageNum + 1}
          </button>
        ))}
        
        <button 
          className="page-btn"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
        >
          ›
        </button>
      </div>
    );
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
                <select 
                  className="category-select" 
                  value={category}
                  onChange={(e) => {
                    const newCategory = e.target.value;
                    setSearchParams({ category: newCategory });
                  }}
                  disabled={categoriesLoading}
                >
                  <option value="all">Tất cả</option>
                  {categoriesLoading ? (
                    <option disabled>Đang tải danh mục...</option>
                  ) : (
                    flattenedCategories.map((cat) => (
                      <option key={cat.id} value={cat.slug || cat.id}>
                        {cat.displayName}
                      </option>
                    ))
                  )}
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
                    onChange={(e) => handlePriceRangeChange({...priceRange, max: parseInt(e.target.value)})}
                    className="price-slider"
                  />
                </div>
                <div className="price-inputs">
                  <div className="price-input-group">
                    <label>Minimum</label>
                    <input
                      type="number"
                      value={priceRange.min}
                      onChange={(e) => handlePriceRangeChange({...priceRange, min: parseInt(e.target.value) || 0})}
                      className="price-input"
                    />
                    <span className="currency">đ</span>
                  </div>
                  <div className="price-input-group">
                    <label>Maximum</label>
                    <input
                      type="number"
                      value={priceRange.max}
                      onChange={(e) => handlePriceRangeChange({...priceRange, max: parseInt(e.target.value) || 3000000})}
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
              <h2 className="product-count">
                {loading ? 'Đang tải...' : `Có ${filteredProducts.length} sản phẩm`}
              </h2>
              <select 
                className="sort-select" 
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                disabled={loading}
              >
                <option value="default">Sắp xếp theo</option>
                <option value="price-asc">Giá: Thấp → Cao</option>
                <option value="price-desc">Giá: Cao → Thấp</option>
                <option value="name-asc">Tên: A → Z</option>
                <option value="name-desc">Tên: Z → A</option>
              </select>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="loading-state">
                <p>Đang tải sản phẩm...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="error-state">
                <p>Lỗi: {error}</p>
                <button onClick={fetchProducts}>Thử lại</button>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && filteredProducts.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">📦</div>
                <h3>Hiện tại chưa có sản phẩm nào</h3>
                <p>Không tìm thấy sản phẩm phù hợp với danh mục hoặc bộ lọc đã chọn.</p>
                <div className="empty-actions">
                  <Link to="/products?category=all" className="browse-all-btn">
                    Xem tất cả sản phẩm
                  </Link>
                  <button onClick={() => {
                    setSelectedColors([]);
                    setSelectedSizes([]);
                    setPriceRange({ min: 0, max: 3000000 });
                    setSortBy('default');
                  }} className="clear-filters-btn">
                    Xóa bộ lọc
                  </button>
                </div>
              </div>
            )}

            {/* Products Grid */}
            {!loading && !error && filteredProducts.length > 0 && (
              <div className="products-grid">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="product-card">
                    {/* Product Image - Clickable */}
                    <Link to={`/product/${product.id}`} className="product-image-container">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="product-image"
                        onError={(e) => {
                          e.target.src = '/images/product-placeholder.jpg';
                        }}
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
            )}

            {/* Pagination */}
            {!loading && !error && totalPages > 1 && renderPagination()}
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