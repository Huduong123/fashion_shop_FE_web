import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './ProductDetail.css';

// Services & Components
import productService from '../services/productService';
import colorService from '../services/colorService';
import FeaturesSection from '../components/FeaturesSection/FeaturesSection';
import { useProductSelector } from '../hooks/useProductSelector'; // Đã import hook

const ProductDetail = () => {
  const { productId } = useParams();

  // --- STATE DÀNH RIÊNG CHO COMPONENT NÀY ---
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [favoriteProducts, setFavoriteProducts] = useState(new Set());

  // --- GỌI CUSTOM HOOK ĐỂ LẤY LOGIC VÀ STATE CHUNG ---
  const {
    selectedVariant,
    selectedSizeInfo,
    quantity,
    handleColorSelect,
    handleSizeSelect,
    handleQuantityChange,
    handleAddToCart,
    maxAllowedQuantity,
    isAddToCartDisabled,
    stockQuantity,
  } = useProductSelector(product);

  // --- USE EFFECTS ---

  // Effect #1: Lấy dữ liệu sản phẩm chính khi ID thay đổi
  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await productService.getProductById(productId);

        if (result.success && result.data) {
          setProduct(result.data);
        } else {
          setError(result.message || 'Không tìm thấy sản phẩm.');
        }
      } catch (err) {
        setError('Đã xảy ra lỗi khi kết nối đến máy chủ.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  // Effect #2: Lấy sản phẩm liên quan sau khi đã có sản phẩm chính
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (product && product.categoryId) {
        try {
          const filters = { categoryId: product.categoryId, page: 0, size: 5 };
          const result = await productService.getAllVisibleProducts(filters);
          if (result.success && result.data.content) {
            const filteredRelated = result.data.content
              .map(p => productService.transformProductData(p))
              .filter(p => p.id !== product.id)
              .slice(0, 4);
            setRelatedProducts(filteredRelated);
          }
        } catch (err) {
          console.error("Lỗi khi tải sản phẩm liên quan:", err);
        }
      }
    };

    fetchRelatedProducts();
  }, [product]);

  // Effect #3: Cập nhật ảnh chính khi variant thay đổi
  useEffect(() => {
    setSelectedImage(0);
  }, [selectedVariant]);


  // --- CÁC HÀM VÀ BIẾN CÒN LẠI ---

  const toggleFavorite = (id) => {
    setFavoriteProducts(prev => {
      const newFavorites = new Set(prev);
      newFavorites.has(id) ? newFavorites.delete(id) : newFavorites.add(id);
      return newFavorites;
    });
  };

  const formatPrice = (price) => {
    if (price === null || price === undefined) return 'Liên hệ';
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };
  
  const currentImages = selectedVariant?.images?.sort((a, b) => a.displayOrder - b.displayOrder).map(img => img.imageUrl) ?? [];

  // --- RENDER LOGIC ---
  if (loading) return <div className="loading-state-fullpage">Đang tải sản phẩm...</div>;
  if (error) return <div className="error-state-fullpage">Lỗi: {error}</div>;
  if (!product) return <div className="empty-state-fullpage">Không tìm thấy sản phẩm.</div>;

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        <nav className="detail-breadcrumb">
          <Link to="/" className="detail-breadcrumb-link">Trang chủ</Link>
          <span className="detail-breadcrumb-separator">/</span>
          <Link to={`/products?category=${product.categoryName}`} className="detail-breadcrumb-link">{product.categoryName}</Link>
          <span className="detail-breadcrumb-separator">/</span>
          <span className="detail-breadcrumb-current">{product.name}</span>
        </nav>

        <div className="product-detail-layout">
          <div className="product-gallery">
            <div className="gallery-thumbnails">
              {currentImages.map((image, index) => (
                <button key={index} className={`thumbnail-btn ${selectedImage === index ? 'active' : ''}`} onClick={() => setSelectedImage(index)}>
                  <img src={image} alt={`${product.name} ${index + 1}`} onError={(e) => { e.target.src = '/images/product-placeholder.jpg'; }} />
                </button>
              ))}
            </div>
            <div className="gallery-main">
              <img src={currentImages[selectedImage] || '/images/product-placeholder.jpg'} alt={product.name} className="main-product-image" />
            </div>
          </div>
          <div className="product-detail-info">
            <h1 className="product-detail-name">{product.name}</h1>
            <p className="product-sku">Mã sản phẩm: {product.id}</p>
            <div className="product-detail-price">
              <span className="detail-current-price">{formatPrice(selectedSizeInfo?.price)}</span>
            </div>
            <div className="product-options">
              <div className="option-group">
                <label className="option-label">Màu sắc:</label>
                <div className="color-options">
                  {product.productVariants.map((variant) => (
                    <button
                      key={variant.id}
                      className={`color-swatch-btn ${selectedVariant?.id === variant.id ? 'active' : ''}`}
                      onClick={() => handleColorSelect(variant)}
                      title={variant.colorName}
                    >
                      <span className="color-swatch" style={{ backgroundColor: colorService.getColorHexCode(variant.colorName) }}></span>
                      <span className="color-name-text">{variant.colorName}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="option-group">
                <label className="option-label">Kích thước:</label>
                <div className="size-options">
                  {selectedVariant?.sizes.map((size) => (
                    <button key={size.id} className={`size-option ${selectedSizeInfo?.id === size.id ? 'active' : ''}`} onClick={() => handleSizeSelect(size)} disabled={!size.available}>
                      {size.sizeName}
                    </button>
                  ))}
                </div>
                <button className="size-guide-btn">📏 Hướng dẫn tính size</button>
              </div>
              <div className="option-group">
                <label className="option-label">Số lượng:</label>
                <div className="quantity-selector">
                  <button className="quantity-btn" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>-</button>
                  <span className="quantity-value">{quantity}</span>
                  <button className="quantity-btn" onClick={() => handleQuantityChange(1)} disabled={quantity >= maxAllowedQuantity}>+</button>
                </div>
                {stockQuantity > 0 && <span className="stock-info">{stockQuantity} sản phẩm có sẵn</span>}
              </div>
            </div>
            <div className="product-actions-detail">
              <button className="btn-buy-now" disabled={isAddToCartDisabled}>MUA NGAY</button>
              <button 
                className="btn-add-cart" 
                disabled={isAddToCartDisabled}
                onClick={handleAddToCart}
              >
                THÊM VÀO GIỎ
              </button>
            </div>
          </div>
        </div>

        <FeaturesSection />

        <div className="product-tabs">
          <div className="tab-buttons">
            <button className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`} onClick={() => setActiveTab('description')}>MÔ TẢ SẢN PHẨM</button>
            <button className={`tab-btn ${activeTab === 'policy' ? 'active' : ''}`} onClick={() => setActiveTab('policy')}>CHÍNH SÁCH ĐỔI HÀNG</button>
          </div>
          <div className="tab-content">
            {activeTab === 'description' && <div className="tab-panel"><p>{product.description || "Chưa có mô tả cho sản phẩm này."}</p></div>}
            {activeTab === 'policy' && <div className="tab-panel"><p>Thông tin về chính sách đổi hàng sẽ được cập nhật tại đây.</p></div>}
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="related-products-section">
            <h2 className="related-title">SẢN PHẨM LIÊN QUAN</h2>
            <div className="related-products-grid">
              {relatedProducts.map((relatedProd) => (
                <Link key={relatedProd.id} to={`/product/${relatedProd.id}`} className="related-product-card">
                  <div className="related-image-container">
                    <img src={relatedProd.image} alt={relatedProd.name} className="related-product-image" onError={(e) => { e.target.src = '/images/product-placeholder.jpg'; }} />
                  </div>
                  <div className="related-product-info">
                    <h3 className="related-product-name">{relatedProd.name}</h3>
                    <div className="related-price-actions">
                      <span className="related-price">{formatPrice(relatedProd.price)}</span>
                      <div className="related-actions">
                        <button className={`related-action-btn favorite ${favoriteProducts.has(relatedProd.id) ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); toggleFavorite(relatedProd.id); }}>
                          {favoriteProducts.has(relatedProd.id) ? '♥' : '♡'}
                        </button>
                        <button className="related-action-btn cart" onClick={(e) => e.preventDefault()}>🛒</button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;