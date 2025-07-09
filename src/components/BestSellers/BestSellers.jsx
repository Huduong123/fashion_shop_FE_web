import React, { useState } from 'react';
import './BestSellers.css';
import product1 from '../../assets/images/product1.webp';
const BestSellers = () => {
  const [favoriteProducts, setFavoriteProducts] = useState(new Set());

  // Sample product data - thay thế bằng data thực từ API
  const products = [
    {
      id: 1,
      name: "Áo Khoác Nam Thời Trang JK25FH02P-CT",
      price: 1500000,
      originalPrice: null,
      discount: null,
      image:  product1,
      colors: ['#D4D4D4', '#8B4513'],
      isNewArrival: false,
      isBestSeller: true
    },
    {
      id: 2,
      name: "Áo Khoác Nam Thời Trang JK25SS01T-PA",
      price: 1200000,
      originalPrice: null,
      discount: null,
      image: product1,
      colors: ['#E6E6FA', '#D3D3D3'],
      isNewArrival: false,
      isBestSeller: true
    },
    {
      id: 3,
      name: "Áo Polo Form Vừa Tay Ngắn KS25ES28T",
      price: 700000,
      originalPrice: null,
      discount: null,
      image: product1,
      colors: ['#87CEEB', '#FFB6C1'],
      isNewArrival: true,
      isBestSeller: false
    },
    {
      id: 4,
      name: "Áo Polo Form Vừa Tay Ngắn KS25SS27T",
      price: 550000,
      originalPrice: null,
      discount: null,
      image: product1,
      colors: ['#8B4513', '#D2B48C'],
      isNewArrival: false,
      isBestSeller: false
    },
    {
      id: 5,
      name: "Áo Khoác Nữ UV Pro Windbreaker WOK 2058",
      price: 679000,
      originalPrice: 729000,
      discount: 7,
      image: product1,
      colors: ['#FFB6C1', '#4169E1', '#D3D3D3', '#000000'],
      isNewArrival: true,
      isBestSeller: true
    },
    {
      id: 6,
      name: "Áo Khoác Nam UV Pro Windbreaker MOK 1058",
      price: 699000,
      originalPrice: 749000,
      discount: 7,
      image: product1,
      colors: ['#4169E1', '#D3D3D3'],
      isNewArrival: true,
      isBestSeller: true
    },
    {
      id: 7,
      name: "Áo Khoác Nữ Airlayer By Color WOK 2067",
      price: 729000,
      originalPrice: null,
      discount: null,
      image: product1,
      colors: ['#8B4513', '#D3D3D3'],
      isNewArrival: true,
      isBestSeller: true
    },
    {
      id: 8,
      name: "Áo Khoác Nam Airlayer By Color MOK 1067",
      price: 749000,
      originalPrice: null,
      discount: null,
      image: product1,
      colors: ['#808080', '#FFB6C1'],
      isNewArrival: true,
      isBestSeller: true
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

  return (
    <section className="best-sellers">
      <div className="best-sellers-container">
        {/* Header */}
        <div className="section-header">
          <h2 className="section-title">BÁN CHẠY NHẤT</h2>
          <button className="view-all-btn">
            XEM TẤT CẢ 
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Products Grid */}
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              {/* Product Image */}
              <div className="product-image-container">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="product-image"
                />
                
                                 {/* Badges */}
                <div className="product-badges">
                  {product.isBestSeller && (
                    <span className="badge best-seller">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
                      </svg>
                      BEST SELLER
                    </span>
                  )}
                </div>

                                 {/* Discount Badge */}
                {product.discount && (
                  <span className="discount-badge">-{product.discount}%</span>
                )}
              </div>

              {/* Product Info */}
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>

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
                     <button className="action-btn cart-btn">
                       🛒
                     </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestSellers; 