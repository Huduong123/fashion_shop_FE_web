import React, { useState, useEffect } from 'react';
import './BannerSection.css';

const BannerSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Banner data - in real app, these would be actual image URLs
  const bannerData = [
    {
      id: 1,
      title: "TẶNG NGAY VOUCHER",
      discount: "100K",
      subtitle: "KHI TẢI APP COUPLE TX",
      code: "APPT10",
      codeNote: "(Áp dụng cho đơn từ 200K)",
      rightText: "NEW ARRIVAL",
      rightSubtext: "ÁO KHOÁC",
      rightSubtext2: "CHỐNG NẮNG",
      background: "linear-gradient(135deg, #f5f5f5 0%, #e8f4f8 100%)",
      bgImage: "/api/placeholder/1200/400"
    },
    {
      id: 2,
      title: "SALE CUỐI TUẦN",
      discount: "50%",
      subtitle: "CHO TẤT CẢ SẢN PHẨM",
      code: "WEEKEND50",
      codeNote: "(Áp dụng từ thứ 6 - chủ nhật)",
      rightText: "HOT TREND",
      rightSubtext: "THỜI TRANG",
      rightSubtext2: "ĐÔI",
      background: "linear-gradient(135deg, #fff5f5 0%, #f8e8e8 100%)",
      bgImage: "/api/placeholder/1200/400"
    },
    {
      id: 3,
      title: "FREESHIP TOÀN QUỐC",
      discount: "0Đ",
      subtitle: "CHO Đơn HÀNG TỪ 299K",
      code: "FREESHIP299",
      codeNote: "(Không giới hạn khoảng cách)",
      rightText: "COLLECTION",
      rightSubtext: "MÙA HÈ",
      rightSubtext2: "2024",
      background: "linear-gradient(135deg, #f0f8f0 0%, #e8f5e8 100%)",
      bgImage: "/api/placeholder/1200/400"
    }
  ];

  // Auto slide effect
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerData.length);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(slideInterval);
  }, [bannerData.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerData.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerData.length) % bannerData.length);
  };

  return (
    <section className="banner">
      <div className="banner-container">
        <div className="banner-slider">
          {bannerData.map((banner, index) => (
            <div
              key={banner.id}
              className={`banner-slide ${index === currentSlide ? 'active' : ''}`}
              style={{ background: banner.background }}
            >
              <div className="banner-content">
                {/* Left Content */}
                <div className="banner-left">
                  <div className="banner-text">
                    <h2 className="banner-title">{banner.title}</h2>
                    <div className="banner-discount">{banner.discount}</div>
                    <p className="banner-subtitle">{banner.subtitle}</p>
                    
                    <div className="banner-code">
                      <span className="code-label">NHẬP MÃ: </span>
                      <span className="code-value">{banner.code}</span>
                    </div>
                    <p className="banner-note">{banner.codeNote}</p>
                    
                    <button className="banner-btn">
                      MUA NGAY
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 18l6-6-6-6"/>
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Center - Phone mockup */}
                <div className="banner-center">
                  <div className="phone-mockup">
                    <div className="phone-screen">
                      <div className="qr-placeholder">
                        <div className="qr-code">
                          <div className="qr-pattern"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Content */}
                <div className="banner-right">
                  <div className="banner-right-text">
                    <div className="right-main">{banner.rightText}</div>
                    <div className="right-sub">{banner.rightSubtext}</div>
                    <div className="right-sub2">{banner.rightSubtext2}</div>
                  </div>
                  <div className="banner-feature">
                    <div className="feature-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2L2 7v10c0 5.55 3.84 10 9 11 5.16-1 9-5.45 9-11V7l-10-5z"/>
                        <path d="M9 12l2 2 4-4"/>
                      </svg>
                    </div>
                    <span>CHỐNG TĨNH ĐIỆN</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button className="banner-nav banner-prev" onClick={prevSlide}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        <button className="banner-nav banner-next" onClick={nextSlide}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>

        {/* Indicators */}
        <div className="banner-indicators">
          {bannerData.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BannerSection; 