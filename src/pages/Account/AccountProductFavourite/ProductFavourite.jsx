import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import './ProductFavourite.css';

const ProductFavourite = () => {
  const { user } = useAuth();
  
  // Mock data cho sản phẩm yêu thích
  const [favoriteProducts, setFavoriteProducts] = useState([
    {
      id: 1,
      name: 'Áo Thun Nam Basic Premium',
      image: '/uploads/product1.webp',
      price: 299000,
      originalPrice: 399000,
      discount: 25,
      rating: 4.5,
      reviews: 128,
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Trắng', 'Đen', 'Xám'],
      isInStock: true,
      category: 'Áo thun'
    },
    {
      id: 2,
      name: 'Quần Jeans Slim Fit Cao Cấp',
      image: '/uploads/product2.webp',
      price: 599000,
      originalPrice: 799000,
      discount: 25,
      rating: 4.7,
      reviews: 89,
      sizes: ['28', '29', '30', '31', '32'],
      colors: ['Xanh đậm', 'Xanh nhạt', 'Đen'],
      isInStock: true,
      category: 'Quần jeans'
    },
    {
      id: 3,
      name: 'Áo Hoodie Unisex Streetwear',
      image: '/uploads/product3.webp',
      price: 599000,
      originalPrice: null,
      discount: 0,
      rating: 4.3,
      reviews: 156,
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Đen', 'Trắng', 'Xám', 'Navy'],
      isInStock: true,
      category: 'Áo hoodie'
    },
    {
      id: 4,
      name: 'Giày Sneaker Nam Thể Thao',
      image: '/uploads/product4.webp',
      price: 899000,
      originalPrice: 1199000,
      discount: 25,
      rating: 4.6,
      reviews: 203,
      sizes: ['39', '40', '41', '42', '43'],
      colors: ['Trắng', 'Đen', 'Xanh'],
      isInStock: false,
      category: 'Giày sneaker'
    },
    {
      id: 5,
      name: 'Áo Khoác Bomber Vintage',
      image: '/uploads/product5.webp',
      price: 899000,
      originalPrice: null,
      discount: 0,
      rating: 4.4,
      reviews: 67,
      sizes: ['M', 'L', 'XL'],
      colors: ['Xanh navy', 'Đen', 'Olive'],
      isInStock: true,
      category: 'Áo khoác'
    },
    {
      id: 6,
      name: 'Áo Polo Nam Classic',
      image: '/uploads/product6.webp',
      price: 349000,
      originalPrice: 449000,
      discount: 22,
      rating: 4.2,
      reviews: 94,
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Xanh dương', 'Trắng', 'Đen', 'Đỏ'],
      isInStock: true,
      category: 'Áo polo'
    }
  ]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const handleRemoveFromFavorites = (productId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi danh sách yêu thích?')) {
      setFavoriteProducts(prev => prev.filter(product => product.id !== productId));
    }
  };

  const handleAddToCart = (product) => {
    // Logic thêm vào giỏ hàng
    alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
  };

  const handleViewProduct = (productId) => {
    // Chuyển đến trang chi tiết sản phẩm
    window.location.href = `/product/${productId}`;
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star filled">★</span>);
    }

    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">★</span>);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">★</span>);
    }

    return stars;
  };

  return (
    <div className="favorite-products-container">
      <div className="page-header">
        <h1 className="page-title">Sản phẩm yêu thích</h1>
        <div className="products-count">
          {favoriteProducts.length > 0 && (
            <span className="count-badge">
              {favoriteProducts.length} sản phẩm
            </span>
          )}
        </div>
      </div>

      {favoriteProducts.length === 0 ? (
        <div className="empty-favorites">
          <div className="empty-icon">💝</div>
          <h3>Chưa có sản phẩm yêu thích</h3>
          <p>Hãy thêm những sản phẩm bạn quan tâm vào danh sách yêu thích để không bỏ lỡ.</p>
          <button className="shop-now-btn" onClick={() => window.location.href = '/products'}>
            Khám phá sản phẩm
          </button>
        </div>
      ) : (
        <div className="favorites-grid">
          {favoriteProducts.map(product => (
            <div key={product.id} className={`product-card ${!product.isInStock ? 'out-of-stock' : ''}`}>
              {/* Product Image */}
              <div className="product-image-container">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="product-image"
                  onClick={() => handleViewProduct(product.id)}
                />
                {product.discount > 0 && (
                  <div className="discount-badge">
                    -{product.discount}%
                  </div>
                )}
                {!product.isInStock && (
                  <div className="stock-overlay">
                    <span>Hết hàng</span>
                  </div>
                )}
                <button 
                  className="remove-favorite-btn"
                  onClick={() => handleRemoveFromFavorites(product.id)}
                  title="Xóa khỏi yêu thích"
                >
                  ❤️
                </button>
              </div>

              {/* Product Info */}
              <div className="product-info">
                <div className="product-category">
                  {product.category}
                </div>
                
                <h3 
                  className="product-name"
                  onClick={() => handleViewProduct(product.id)}
                >
                  {product.name}
                </h3>

                <div className="product-rating">
                  <div className="stars">
                    {renderStars(product.rating)}
                  </div>
                  <span className="rating-text">
                    {product.rating} ({product.reviews} đánh giá)
                  </span>
                </div>

                <div className="product-variants">
                  <div className="sizes">
                    <span className="variant-label">Size:</span>
                    <div className="variant-options">
                      {product.sizes.slice(0, 3).map(size => (
                        <span key={size} className="variant-item">{size}</span>
                      ))}
                      {product.sizes.length > 3 && (
                        <span className="variant-more">+{product.sizes.length - 3}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="colors">
                    <span className="variant-label">Màu:</span>
                    <div className="variant-options">
                      {product.colors.slice(0, 2).map(color => (
                        <span key={color} className="variant-item">{color}</span>
                      ))}
                      {product.colors.length > 2 && (
                        <span className="variant-more">+{product.colors.length - 2}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="product-price">
                  <span className="current-price">
                    {formatCurrency(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="original-price">
                      {formatCurrency(product.originalPrice)}
                    </span>
                  )}
                </div>

                <div className="product-actions">
                  <button 
                    className="btn-add-cart"
                    onClick={() => handleAddToCart(product)}
                    disabled={!product.isInStock}
                  >
                    {product.isInStock ? 'Thêm vào giỏ' : 'Hết hàng'}
                  </button>
                  <button 
                    className="btn-view-detail"
                    onClick={() => handleViewProduct(product.id)}
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductFavourite;
