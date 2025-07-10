import React, { useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import './ProductDetail.css';
import product1 from '../assets/images/product1.webp';
import FeaturesSection from '../components/FeaturesSection/FeaturesSection';

const ProductDetail = () => {
  const { productId } = useParams();
  const [searchParams] = useSearchParams();
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('#8B4513'); // Brown
  const [selectedSize, setSelectedSize] = useState('XL');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [favoriteProducts, setFavoriteProducts] = useState(new Set());

  // Sample product data
  const product = {
    id: 1,
    name: "Áo Polo KS25SS38C-SCHE",
    sku: "KS25SS38C-SCHE",
    price: 980000,
    originalPrice: null,
    brand: "JOHN HENRY",
    images: [product1, product1, product1, product1, product1],
    colors: [
      { name: 'BROWN', value: '#8B4513' },
      { name: 'BLUE', value: '#87CEEB' }
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    description: "Chất liệu 100% polyester với độ bền cao và có khả năng cản gió - lý tưởng cho thời tiết se lạnh hoặc những ngày di chuyển nhiều. Thiết kế tối giản với có dung hiện đại, form áo thoải mái cùng khoá kéo tiện lợi - dễ dàng kết hợp với sơ mi, áo thun hay áo polo. Gam màu trung tính để phối cùng quần tây hoặc jeans - hoàn hảo cho phong cách công sở lịch sự mà vẫn thoải mái.",
    category: "ao-polo"
  };

  // Related products
  const relatedProducts = [
    {
      id: 2,
      name: "Áo Khoác Nam Thời Trang JK25SS01T-PA",
      price: 1200000,
      image: product1
    },
    {
      id: 3,
      name: "Áo Khoác Nam Thời Trang JK25FH02P-CT",
      price: 1500000,
      image: product1
    },
    {
      id: 4,
      name: "Áo Khoác Phao Nam Tính JK24FH08P-PA",
      price: 1800000,
      image: product1
    },
    {
      id: 5,
      name: "Áo Khoác Nam Phong Cách JK24FH07P-CT",
      price: 1600000,
      image: product1
    }
  ];

  const toggleFavorite = (productId) => {
    const newFavorites = new Set(favoriteProducts);
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId);
    } else {
      newFavorites.add(productId);
    }
    setFavoriteProducts(newFavorites);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const getCategoryTitle = () => {
    const categoryMap = {
      'ao-polo': 'Áo Polo',
      'ao-so-mi': 'Áo Sơ Mi',
      'ao-thun': 'Áo Thun',
      'ao-len': 'Áo Len',
      'ao-khoac': 'Áo Khoác'
    };
    return categoryMap[product.category] || 'Sản phẩm';
  };

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        {/* Breadcrumb */}
        <nav className="detail-breadcrumb">
          <Link to="/" className="detail-breadcrumb-link">Trang chủ</Link>
          <span className="detail-breadcrumb-separator">/</span>
          <Link to={`/products?category=${product.category}`} className="detail-breadcrumb-link">
            {getCategoryTitle()}
          </Link>
          <span className="detail-breadcrumb-separator">/</span>
          <span className="detail-breadcrumb-current">{product.name}</span>
        </nav>

        {/* Product Detail Section */}
        <div className="product-detail-layout">
          {/* Product Gallery */}
          <div className="product-gallery">
            {/* Thumbnail Images */}
            <div className="gallery-thumbnails">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  className={`thumbnail-btn ${selectedImage === index ? 'active' : ''}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={image} alt={`${product.name} ${index + 1}`} />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div className="gallery-main">
              <img 
                src={product.images[selectedImage]} 
                alt={product.name}
                className="main-product-image"
              />
              <button className="gallery-prev">‹</button>
              <button className="gallery-next">›</button>
            </div>
          </div>

          {/* Product Info */}
          <div className="product-detail-info">
            {/* Product Name */}
            <h1 className="product-detail-name">{product.name}</h1>
            <p className="product-sku">SKU: {product.sku}</p>

            {/* Price */}
            <div className="product-detail-price">
              <span className="detail-current-price">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="detail-original-price">{formatPrice(product.originalPrice)}</span>
              )}
            </div>

            {/* Color Selection */}
            <div className="product-options">
              <div className="option-group">
                <label className="option-label">Color: <strong>{selectedColor === '#8B4513' ? 'BROWN' : 'BLUE'}</strong></label>
                <div className="color-options">
                  {product.colors.map((color) => (
                    <button
                      key={color.value}
                      className={`color-option ${selectedColor === color.value ? 'active' : ''}`}
                      style={{ backgroundColor: color.value }}
                      onClick={() => setSelectedColor(color.value)}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div className="option-group">
                <label className="option-label">Kích thước:</label>
                <div className="size-options">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      className={`size-option ${selectedSize === size ? 'active' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <button className="size-guide-btn">📏 Hướng dẫn tính size</button>
              </div>

              {/* Quantity */}
              <div className="option-group">
                <label className="option-label">Số lượng:</label>
                <div className="quantity-selector">
                  <button 
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(-1)}
                  >
                    -
                  </button>
                  <span className="quantity-value">{quantity}</span>
                  <button 
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(1)}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="product-actions-detail">
              <button className="btn-buy-now">MUA NGAY</button>
              <button className="btn-add-cart">THÊM VÀO GIỎ</button>
            </div>

            <button className="btn-share">
              <span className="share-icon">↗</span>
              CHIA SẺ
            </button>
          </div>
        </div>

        {/* Features Section */}
        <FeaturesSection />

        {/* Product Tabs */}
        <div className="product-tabs">
          <div className="tab-buttons">
            <button 
              className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
              onClick={() => setActiveTab('description')}
            >
              MÔ TẢ SẢN PHẨM
            </button>
            <button 
              className={`tab-btn ${activeTab === 'policy' ? 'active' : ''}`}
              onClick={() => setActiveTab('policy')}
            >
              CHÍNH SÁCH ĐỔI HÀNG
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'description' && (
              <div className="tab-panel">
                <p>{product.description}</p>
              </div>
            )}
            {activeTab === 'policy' && (
              <div className="tab-panel">
                <p>Thông tin về chính sách đổi hàng sẽ được cập nhật tại đây.</p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div className="related-products-section">
          <h2 className="related-title">SẢN PHẨM LIÊN QUAN</h2>
          <div className="related-products-grid">
            {relatedProducts.map((relatedProduct) => (
              <Link 
                key={relatedProduct.id} 
                to={`/product/${relatedProduct.id}`}
                className="related-product-card"
              >
                <div className="related-image-container">
                  <img 
                    src={relatedProduct.image} 
                    alt={relatedProduct.name}
                    className="related-product-image"
                  />
                </div>
                <div className="related-product-info">
                  <h3 className="related-product-name">{relatedProduct.name}</h3>
                  <div className="related-price-actions">
                    <span className="related-price">{formatPrice(relatedProduct.price)}</span>
                    <div className="related-actions">
                      <button 
                        className={`related-action-btn favorite ${favoriteProducts.has(relatedProduct.id) ? 'active' : ''}`}
                        onClick={(e) => {
                          e.preventDefault();
                          toggleFavorite(relatedProduct.id);
                        }}
                      >
                        {favoriteProducts.has(relatedProduct.id) ? '♥' : '♡'}
                      </button>
                      <button 
                        className="related-action-btn cart"
                        onClick={(e) => e.preventDefault()}
                      >
                        🛒
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Contact Icons */}
        <div className="detail-contact-icons">
          <a href="tel:+84906954368" className="detail-contact-icon phone">📞</a>
          <a href="#" className="detail-contact-icon messenger">💬</a>
          <a href="#" className="detail-contact-icon zalo">💬</a>
          <button className="detail-contact-icon back-top" onClick={() => window.scrollTo(0, 0)}>↑</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 