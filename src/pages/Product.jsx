import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import './Product.css';
import ProductModal from '../components/ProductModal';
import productService from '../services/productService';
import categoryService from '../services/categoryService';
import colorService from '../services/colorService';
import CategoryFilter from '../components/CategoryFilter/CategoryFilter';

const Product = () => {
  const [searchParams] = useSearchParams();
  const categorySlug = searchParams.get('category') || 'all';

  // State for products and UI
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  // State chỉ dành cho Breadcrumb
  const [breadcrumbTitle, setBreadcrumbTitle] = useState('Tất cả sản phẩm');
  
  // Filter and UI states
  const [favoriteProducts, setFavoriteProducts] = useState(new Set());
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 3000000 });
  const [sortBy, setSortBy] = useState('default');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

const [availableColors, setAvailableColors] = useState([]);

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  // Effect để cập nhật tiêu đề Breadcrumb
  useEffect(() => {
    const updateTitle = async () => {
      if (categorySlug === 'all') {
        setBreadcrumbTitle('Tất cả sản phẩm');
      } else {
        try {
          const cat = await categoryService.getCategoryBySlug(categorySlug);
          setBreadcrumbTitle(cat ? cat.name : 'Không tìm thấy');
        } catch (error) {
          console.error("Lỗi khi lấy tên danh mục:", error);
          setBreadcrumbTitle('Sản phẩm');
        }
      }
    };
    updateTitle();
  }, [categorySlug]);


  // Effect để lấy sản phẩm khi bộ lọc hoặc trang thay đổi
  useEffect(() => {
    fetchProducts();
  }, [categorySlug, currentPage, sortBy, priceRange]);

  useEffect(() => {
    const fetchColors = async () => {
      try {
        const result = await colorService.getAllColors();
        if (result.success && result.data) {
          // Chuyển đổi dữ liệu từ API để phù hợp với component
          // Sử dụng hàm getColorHexCode có sẵn trong productService
          const formattedColors = result.data.map(color => ({
            name: color.name,
            value: colorService.getColorHexCode(color.name) 
          }));
          setAvailableColors(formattedColors);
        } else {
          console.error("Lỗi khi lấy danh sách màu sắc:", result.message);
          // Có thể set một giá trị mặc định nếu cần
          setAvailableColors([]); 
        }
      } catch (error) {
        console.error("Lỗi khi gọi API lấy màu sắc:", error);
      }
    };

    fetchColors();
  }, []); // Mảng dependency rỗng đảm bảo hàm chỉ chạy 1 lần khi component được mount
  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const categoryId = await categoryService.getCategoryIdBySlug(categorySlug);
      
      const filters = {
        page: currentPage,
        size: 12, // Products per page
        sort: getSortParameters(),
        categoryId: categoryId,
        minPrice: priceRange.min > 0 ? priceRange.min : null,
        maxPrice: priceRange.max < 3000000 ? priceRange.max : null
      };

      // Debounce price filter fetch is implicitly handled by useEffect's dependency array
      const result = await productService.getAllVisibleProducts(filters);

      if (result.success) {
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

  // Convert frontend sort option to backend sort parameters
  const getSortParameters = () => {
    switch (sortBy) {
      case 'price-asc': return ['productVariants.minPrice,asc'];
      case 'price-desc': return ['productVariants.maxPrice,desc'];
      case 'name-asc': return ['name,asc'];
      case 'name-desc': return ['name,desc'];
      default: return ['createdAt,desc'];
    }
  };

  // Filter products based on client-side filters
  const getFilteredProducts = () => {
    return products.filter(product => {
      if (selectedColors.length > 0 && !product.colors?.some(color => selectedColors.includes(color.value))) return false;
      if (selectedSizes.length > 0 && !product.sizes?.some(size => selectedSizes.includes(size))) return false;
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
    setCurrentPage(0);
  };

  // Handle price range change
  const handlePriceRangeChange = (newRange) => {
    setPriceRange(newRange);
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

  const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price) + 'đ';

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // Render pagination
  const renderPagination = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="pagination">
        <button className="page-btn" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0}>‹</button>
        {pageNumbers.map(pageNum => (
          <button
            key={pageNum}
            className={`page-btn ${currentPage === pageNum ? 'active' : ''}`}
            onClick={() => handlePageChange(pageNum)}
          >{pageNum + 1}</button>
        ))}
        <button className="page-btn" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= totalPages - 1}>›</button>
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
          <Link to="/products?category=all" className="breadcrumb-text">Danh mục</Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{breadcrumbTitle}</span>
        </nav>

        <div className="product-layout">
          {/* Sidebar Filter */}
          <aside className="product-sidebar">
            
            {/* SỬ DỤNG COMPONENT CATEGORYFILTER */}
            <CategoryFilter />

            {/* Color Filter */}
            <div className="filter-group">
              <h3 className="filter-title">Màu sắc</h3>
              <div className="color-filters">
                {availableColors.map((color) => (
                  <label key={color.value} className="color-filter-item">
                    <input type="checkbox" checked={selectedColors.includes(color.value)} onChange={() => toggleColor(color.value)} className="color-checkbox" />
                    <span className="color-label"><span className="color-swatch" style={{ backgroundColor: color.value }}/>{color.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="filter-group">
              <h3 className="filter-title">Giá</h3>
              <div className="price-filter">
                <div className="price-range">
                  <input type="range" min="0" max="3000000" step="50000" value={priceRange.max} onChange={(e) => handlePriceRangeChange({...priceRange, max: parseInt(e.target.value)})} className="price-slider"/>
                </div>
                <div className="price-inputs">
                  <div className="price-input-group"><label>Minimum</label><input type="number" value={priceRange.min} onChange={(e) => handlePriceRangeChange({...priceRange, min: parseInt(e.target.value) || 0})} className="price-input"/><span className="currency">đ</span></div>
                  <div className="price-input-group"><label>Maximum</label><input type="number" value={priceRange.max} onChange={(e) => handlePriceRangeChange({...priceRange, max: parseInt(e.target.value) || 3000000})} className="price-input"/><span className="currency">đ</span></div>
                </div>
              </div>
            </div>

            {/* Size Filter */}
            <div className="filter-group">
              <h3 className="filter-title">Size</h3>
              <div className="size-filters">
                {availableSizes.map((size) => (
                  <button key={size} className={`size-btn ${selectedSizes.includes(size) ? 'active' : ''}`} onClick={() => toggleSize(size)}>{size}</button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="product-main">
            {/* Header with count and sort */}
            <div className="product-header">
              <h2 className="product-count">{loading ? 'Đang tải...' : `Có ${totalProducts} sản phẩm`}</h2>
              <select className="sort-select" value={sortBy} onChange={(e) => handleSortChange(e.target.value)} disabled={loading}>
                <option value="default">Sắp xếp theo</option>
                <option value="price-asc">Giá: Thấp → Cao</option>
                <option value="price-desc">Giá: Cao → Thấp</option>
                <option value="name-asc">Tên: A → Z</option>
                <option value="name-desc">Tên: Z → A</option>
              </select>
            </div>

            {/* Loading State */}
            {loading && (<div className="loading-state"><p>Đang tải sản phẩm...</p></div>)}

            {/* Error State */}
            {error && (<div className="error-state"><p>Lỗi: {error}</p><button onClick={fetchProducts}>Thử lại</button></div>)}

            {/* Empty State */}
            {!loading && !error && filteredProducts.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">📦</div>
                <h3>Hiện tại chưa có sản phẩm nào</h3>
                <p>Không tìm thấy sản phẩm phù hợp với danh mục hoặc bộ lọc đã chọn.</p>
                <div className="empty-actions">
                  <Link to="/products?category=all" className="browse-all-btn">Xem tất cả sản phẩm</Link>
                  <button onClick={() => { setSelectedColors([]); setSelectedSizes([]); setPriceRange({ min: 0, max: 3000000 }); setSortBy('default'); }} className="clear-filters-btn">Xóa bộ lọc</button>
                </div>
              </div>
            )}

            {/* Products Grid */}
            {!loading && !error && filteredProducts.length > 0 && (
              <div className="products-grid">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="product-card">
                    <Link to={`/product/${product.id}`} className="product-image-container">
                      <img src={product.image} alt={product.name} className="product-image" onError={(e) => { e.target.src = '/images/product-placeholder.jpg'; }}/>
                      {product.discount && (<span className="discount-badge">-{product.discount}%</span>)}
                    </Link>
                    <div className="product-info">
                      <Link to={`/product/${product.id}`} className="product-name-link"><h3 className="product-name">{product.name}</h3></Link>
                      <div className="price-actions-container">
                        <div className="product-price">
                          <span className="current-price">{formatPrice(product.price)}</span>
                          {product.originalPrice && (<span className="original-price">{formatPrice(product.originalPrice)}</span>)}
                        </div>
                        <div className="product-actions">
                          <button className={`action-btn favorite-btn ${favoriteProducts.has(product.id) ? 'active' : ''}`} onClick={() => toggleFavorite(product.id)}>{favoriteProducts.has(product.id) ? '♥' : '♡'}</button>
                          <button className="action-btn cart-btn" onClick={() => handleOpenModal(product)}>🛒</button>
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


        {/* Product Modal */}
        <ProductModal product={selectedProduct} isOpen={isModalOpen} onClose={handleCloseModal}/>
      </div>
    </div>
  );
};

export default Product;