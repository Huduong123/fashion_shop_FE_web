import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import './Product.css';

// Components & Services
import ProductModal from '../components/ProductModal';
import CategoryFilter from '../components/CategoryFilter/CategoryFilter';
import productService from '../services/productService';
import categoryService from '../services/categoryService';
import colorService from '../services/colorService';
import sizeService from '../services/sizeService';
import useDebounce from '../hooks/useDebounce';

const Product = () => {
  const [searchParams] = useSearchParams();
  const categorySlug = searchParams.get('category') || 'all';

  // State cho sản phẩm và UI
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State cho phân trang
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // State cho Breadcrumb
  const [breadcrumbTitle, setBreadcrumbTitle] = useState('Tất cả sản phẩm');

  // State cho bộ lọc
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000000 });
  const [sortBy, setSortBy] = useState('default');

  // State cho dữ liệu của bộ lọc (lấy từ API)
  const [availableColors, setAvailableColors] = useState([]);
  const [availableSizes, setAvailableSizes] = useState([]);

  // State cho modal và sản phẩm yêu thích
  const [favoriteProducts, setFavoriteProducts] = useState(new Set());
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

  // Tạo giá trị đã được "debounce" cho khoảng giá với độ trễ 500ms
  const debouncedPriceRange = useDebounce(priceRange, 500);

  // Effect để lấy dữ liệu cho các bộ lọc (màu sắc, size) khi component được mount
  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const [colorResult, sizeResult] = await Promise.all([
          colorService.getAllColors(),
          sizeService.getAllSizes()
        ]);

        if (colorResult.success && colorResult.data) {
          const formattedColors = colorResult.data.map(color => ({
            name: color.name,
            value: colorService.getColorHexCode(color.name)
          }));
          setAvailableColors(formattedColors);
        } else {
          console.error("Lỗi khi lấy danh sách màu sắc:", colorResult.message);
        }

        if (sizeResult.success && sizeResult.data) {
          setAvailableSizes(sizeResult.data);
        } else {
          console.error("Lỗi khi lấy danh sách size:", sizeResult.message);
        }
      } catch (err) {
        console.error("Lỗi khi gọi API lấy dữ liệu bộ lọc:", err);
      }
    };

    fetchFilterData();
  }, []); // Mảng dependency rỗng đảm bảo chỉ chạy 1 lần

  // Effect để cập nhật tiêu đề Breadcrumb khi category thay đổi
  useEffect(() => {
    const updateTitle = async () => {
      if (categorySlug === 'all') {
        setBreadcrumbTitle('Tất cả sản phẩm');
      } else {
        const cat = await categoryService.getCategoryBySlug(categorySlug);
        setBreadcrumbTitle(cat ? cat.name : 'Không tìm thấy');
      }
    };
    updateTitle();
  }, [categorySlug]);

  // Effect chính để gọi API khi các bộ lọc (category, sort, price) thay đổi
  useEffect(() => {
    setCurrentPage(0); // Quay về trang đầu tiên mỗi khi bộ lọc thay đổi
    fetchProducts(true);
  }, [categorySlug, sortBy, debouncedPriceRange]);

  // Effect riêng chỉ để xử lý khi phân trang (currentPage) thay đổi
  useEffect(() => {
    fetchProducts(false);
  }, [currentPage]);

  // Hàm chính để lấy danh sách sản phẩm từ backend
  const fetchProducts = async (shouldResetPage) => {
    try {
      setLoading(true);
      setError(null);

      const pageToFetch = shouldResetPage ? 0 : currentPage;
      const categoryId = await categoryService.getCategoryIdBySlug(categorySlug);

      const filters = {
        page: pageToFetch,
        size: 12,
        sort: getSortParameters(),
        categoryId: categoryId,
        minPrice: debouncedPriceRange.min > 0 ? debouncedPriceRange.min : null,
        maxPrice: debouncedPriceRange.max < 3000000 ? debouncedPriceRange.max : null
      };

      const result = await productService.getAllVisibleProducts(filters);

      if (result.success) {
        const transformedProducts = result.data.content.map(productService.transformProductData);
        setProducts(transformedProducts);
        setTotalProducts(result.data.totalElements);
        setTotalPages(result.data.totalPages);
        setCurrentPage(result.data.number);
      } else {
        setError(result.message || 'Không thể lấy sản phẩm');
        setProducts([]);
      }
    } catch (err) {
      setError('Đã xảy ra lỗi khi kết nối đến máy chủ.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Chuyển đổi tùy chọn sắp xếp sang tham số của API
    const getSortParameters = () => {
        switch (sortBy) {
            // Thay đổi đường dẫn để trỏ đến trường price trong ProductVariantSize
            case 'price-asc': return ['productVariants.productVariantSizes.price,asc'];
            case 'price-desc': return ['productVariants.productVariantSizes.price,desc'];
            case 'name-asc': return ['name,asc'];
            case 'name-desc': return ['name,desc'];
            default: return ['createdAt,desc'];
        }
    };

  // Lọc sản phẩm ở phía client (áp dụng cho màu và size đã chọn)
  const getFilteredProducts = () => {
    return products.filter(product => {
      const colorMatch = selectedColors.length === 0 || product.colors?.some(color => selectedColors.includes(color.value));
      const sizeMatch = selectedSizes.length === 0 || product.sizes?.some(size => selectedSizes.includes(size));
      return colorMatch && sizeMatch;
    });
  };

  const filteredProducts = getFilteredProducts();

  // --- Các hàm tiện ích và xử lý sự kiện ---

  const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  const formatNumberForDisplay = (num) => new Intl.NumberFormat('vi-VN').format(num);
  const parseNumberFromInput = (value) => parseInt(value.replace(/\D/g, ''), 10) || 0;

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) setCurrentPage(newPage);
  };

  const handleSortChange = (e) => setSortBy(e.target.value);

  const handlePriceInputChange = (field, value) => {
    const numericValue = parseNumberFromInput(value);
    setPriceRange(prev => ({ ...prev, [field]: numericValue }));
  };
  
  const handlePriceSliderChange = (e) => {
    setPriceRange(prev => ({...prev, max: parseInt(e.target.value)}));
  };

  const toggleColor = (color) => setSelectedColors(prev => prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]);
  const toggleSize = (size) => setSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]);

  const toggleFavorite = (productId) => {
    setFavoriteProducts(prev => {
      const newFavorites = new Set(prev);
      newFavorites.has(productId) ? newFavorites.delete(productId) : newFavorites.add(productId);
      return newFavorites;
    });
  };

    const handleOpenModal = (productId) => {
        setSelectedProductId(productId);
        setIsModalOpen(true);
    };
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedProductId(null); // Reset ID khi đóng
    };

  // --- Render Functions ---

  const renderPagination = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);

    return (
      <div className="pagination">
        <button className="page-btn" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0}>‹</button>
        {pageNumbers.map(pageNum => (
          <button key={pageNum} className={`page-btn ${currentPage === pageNum ? 'active' : ''}`} onClick={() => handlePageChange(pageNum)}>{pageNum + 1}</button>
        ))}
        <button className="page-btn" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= totalPages - 1}>›</button>
      </div>
    );
  };

  return (
    <div className="product-page">
      <div className="product-container">
        <nav className="breadcrumb">
          <Link to="/" className="breadcrumb-link">Trang chủ</Link>
          <span className="breadcrumb-separator">/</span>
          <Link to="/products?category=all" className="breadcrumb-text">Danh mục</Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{breadcrumbTitle}</span>
        </nav>

        <div className="product-layout">
          <aside className="product-sidebar">
            <CategoryFilter />

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

            <div className="filter-group">
              <h3 className="filter-title">Giá</h3>
              <div className="price-filter">
                <div className="price-range">
                  <input type="range" min="0" max="3000000" step="50000" value={priceRange.max} onChange={handlePriceSliderChange} className="price-slider"/>
                </div>
                <div className="price-inputs">
                  <div className="price-input-group">
                    <label>Từ</label>
                    <input type="text" value={formatNumberForDisplay(priceRange.min)} onChange={(e) => handlePriceInputChange('min', e.target.value)} className="price-input" />
                    <span className="currency">đ</span>
                  </div>
                  <div className="price-input-group">
                    <label>Đến</label>
                    <input type="text" value={formatNumberForDisplay(priceRange.max)} onChange={(e) => handlePriceInputChange('max', e.target.value)} className="price-input" />
                    <span className="currency">đ</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="filter-group">
              <h3 className="filter-title">Size</h3>
              <div className="size-filters">
                {availableSizes.map((size) => (
                  <button key={size.id} className={`size-btn ${selectedSizes.includes(size.name) ? 'active' : ''}`} onClick={() => toggleSize(size.name)}>{size.name}</button>
                ))}
              </div>
            </div>
          </aside>

          <main className="product-main">
            <div className="product-header">
              <h2 className="product-count">{loading ? 'Đang tải...' : `Có ${totalProducts} sản phẩm`}</h2>
              <select className="sort-select" value={sortBy} onChange={handleSortChange} disabled={loading}>
                <option value="default">Sắp xếp mặc định</option>
                <option value="price-asc">Giá: Thấp → Cao</option>
                <option value="price-desc">Giá: Cao → Thấp</option>
                <option value="name-asc">Tên: A → Z</option>
                <option value="name-desc">Tên: Z → A</option>
              </select>
            </div>

            {loading && <div className="loading-state"><p>Đang tải sản phẩm...</p></div>}
            {error && <div className="error-state"><p>Lỗi: {error}</p><button onClick={() => fetchProducts(true)}>Thử lại</button></div>}
            {!loading && !error && filteredProducts.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">📦</div>
                <h3>Không tìm thấy sản phẩm</h3>
                <p>Vui lòng thử thay đổi bộ lọc hoặc quay lại sau.</p>
              </div>
            )}

            {!loading && !error && filteredProducts.length > 0 && (
              <>
                <div className="products-grid">
                  {filteredProducts.map((product) => (
                    <div key={product.id} className="product-card">
                      <Link to={`/product/${product.id}`} className="product-image-container">
                        <img src={product.image} alt={product.name} className="product-image" onError={(e) => { e.target.src = '/images/product-placeholder.jpg'; }}/>
                        {product.discount && <span className="discount-badge">-{product.discount}%</span>}
                      </Link>
                      <div className="product-info">
                        <Link to={`/product/${product.id}`} className="product-name-link"><h3 className="product-name">{product.name}</h3></Link>
                        <div className="price-actions-container">
                          <div className="product-price">
                            <span className="current-price">{formatPrice(product.price)}</span>
                            {product.originalPrice && <span className="original-price">{formatPrice(product.originalPrice)}</span>}
                          </div>
                          <div className="product-actions">
                            <button className={`action-btn favorite-btn ${favoriteProducts.has(product.id) ? 'active' : ''}`} onClick={() => toggleFavorite(product.id)}>{favoriteProducts.has(product.id) ? '♥' : '♡'}</button>
                            <button className="action-btn cart-btn" onClick={() => handleOpenModal(product.id)}>🛒</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {totalPages > 1 && renderPagination()}
              </>
            )}
          </main>
        </div>
            <ProductModal 
              productId={selectedProductId} 
              isOpen={isModalOpen} 
              onClose={handleCloseModal}
            />
      </div>
    </div>
  );
};

export default Product;