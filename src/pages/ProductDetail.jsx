import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './ProductDetail.css';

// Services & Components
import productService from '../services/productService';
import colorService from '../services/colorService';
import FeaturesSection from '../components/FeaturesSection/FeaturesSection';
import { useCart } from '../contexts/CartContext'; 
import { useAuth } from '../contexts/AuthContext'; // ĐÃ THÊM: Import hook useAuth

const ProductDetail = () => {
  // --- STATE MANAGEMENT ---
  const { productId } = useParams();
  const { addToCart } = useCart(); 
  const { isAuthenticated } = useAuth(); // ĐÃ THÊM: Lấy trạng thái đăng nhập

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedSizeInfo, setSelectedSizeInfo] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [favoriteProducts, setFavoriteProducts] = useState(new Set());

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
          const productData = result.data;
          setProduct(productData);

          if (productData.productVariants && productData.productVariants.length > 0) {
            const firstVariant = productData.productVariants[0];
            setSelectedVariant(firstVariant);

            if (firstVariant.sizes && firstVariant.sizes.length > 0) {
              const firstAvailableSize = firstVariant.sizes.find(s => s.available) || firstVariant.sizes[0];
              setSelectedSizeInfo(firstAvailableSize);
            }
          }
          setQuantity(1); // Reset số lượng về 1 khi load sản phẩm mới
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

  // --- EVENT HANDLERS ---

  const handleColorSelect = (variant) => {
    setSelectedVariant(variant);
    if (variant.sizes?.length > 0) {
      const firstAvailableSize = variant.sizes.find(s => s.available) || variant.sizes[0];
      setSelectedSizeInfo(firstAvailableSize);
    }
    setQuantity(1);
    setSelectedImage(0);
  };

  const handleSizeSelect = (size) => {
    setSelectedSizeInfo(size);
    setQuantity(1);
  };

  const handleQuantityChange = (change) => {
    const stockQuantity = selectedSizeInfo?.quantity || 0;
    const purchaseLimit = 10;
    const maxQuantity = Math.min(stockQuantity, purchaseLimit);

    setQuantity(prevQuantity => {
      const newQuantity = prevQuantity + change;
      return Math.max(1, Math.min(newQuantity, maxQuantity));
    });
  };

  const toggleFavorite = (id) => {
    setFavoriteProducts(prev => {
      const newFavorites = new Set(prev);
      newFavorites.has(id) ? newFavorites.delete(id) : newFavorites.add(id);
      return newFavorites;
    });
  };

  // --- ĐÃ SỬA: Cập nhật hàm xử lý thêm sản phẩm vào giỏ hàng ---
  const handleAddToCart = () => {
      if (!selectedVariant || !selectedSizeInfo || !selectedSizeInfo.available) {
          alert("Vui lòng chọn đầy đủ màu sắc, kích thước và đảm bảo sản phẩm còn hàng.");
          return;
      }

      const itemToAdd = {
          // Nếu đã đăng nhập, ID sẽ là null để backend tự tạo.
          // Nếu là khách, tạo ID tạm thời ở client.
          id: isAuthenticated ? null : `${selectedVariant.id}-${selectedSizeInfo.id}`,
          
          product_id: product.id,
          name: product.name,
          
          // Các trường này bắt buộc phải có cho backend API
          product_variant_id: selectedVariant.id,
          size_id: selectedSizeInfo.id,
          quantity: quantity,

          // Các thuộc tính khác để hiển thị
          color: selectedVariant.colorName,
          size: selectedSizeInfo.sizeName,
          price: selectedSizeInfo.price,
          image: selectedVariant.images?.[0]?.imageUrl || '/images/product-placeholder.jpg',
          stock: selectedSizeInfo.quantity 
      };
      
      // Hàm addToCart từ context sẽ xử lý phần còn lại
      addToCart(itemToAdd);
      alert('Đã thêm sản phẩm vào giỏ hàng!');
  };


  // --- HELPERS ---
  const formatPrice = (price) => {
    if (price === null || price === undefined) return 'Liên hệ';
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };
  const currentImages = selectedVariant?.images?.sort((a, b) => a.displayOrder - b.displayOrder).map(img => img.imageUrl) ?? [];

  // --- RENDER LOGIC ---
  if (loading) return <div className="loading-state-fullpage">Đang tải sản phẩm...</div>;
  if (error) return <div className="error-state-fullpage">Lỗi: {error}</div>;
  if (!product) return <div className="empty-state-fullpage">Không tìm thấy sản phẩm.</div>;

  const stockQuantity = selectedSizeInfo?.quantity || 0;
  const maxAllowedQuantity = Math.min(stockQuantity, 10);

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
              <button className="btn-buy-now" disabled={!selectedSizeInfo?.available}>MUA NGAY</button>
              <button 
                className="btn-add-cart" 
                disabled={!selectedSizeInfo?.available}
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