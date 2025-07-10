import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Blog.css';

const Blog = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  // Sample blog data
  const blogPosts = [
    {
      id: 1,
      date: "07/07/2025",
      title: "THE PERFECT EVERYDAY WALLET",
      excerpt: "Chiếc ví không chỉ là phụ kiện lưu giữ tiền bạc, giấy tờ mà còn là dấu ấn phong cách...",
      image: "/api/placeholder/400/300",
      category: "accessories"
    },
    {
      id: 2,
      date: "07/07/2025",
      title: "🌧️ RAINY SEASON GIFTS - MÙA MƯA ĐẾN, QUÀ FREELANCER CŨNG TỚI!",
      excerpt: "Thời tiết đầu có mưa dài cùng không thể ngăn bạn diện đồ đẹp - và Freelancer cảng không đề nàng ra đường...",
      image: "/api/placeholder/400/300",
      category: "promotion"
    },
    {
      id: 3,
      date: "07/07/2025",
      title: "RAINY SEASON GIFTS | MUA TO, CÓ JOHN HENRY LO!",
      excerpt: "Mùa mưa năm này, JOHN HENRY sẽ đồng hành cùng bạn trên mọi nẻo đường với chương trình quà tặng...",
      image: "/api/placeholder/400/300",
      category: "promotion"
    },
    {
      id: 4,
      date: "25/06/2025",
      title: "CỬA HÀNG MỚI JOHN HENRY - KHÔNG GIAN MUA SẮM HIỆN ĐẠI VÀ TIỆN NGHI",
      excerpt: "Bạn đang tìm kiếm một nơi mua sắm thời trang nam với phong cách hiện đại, lịch lãm và dễ...",
      image: "/api/placeholder/400/300",
      category: "store"
    },
    {
      id: 5,
      date: "25/06/2025",
      title: "GRAND SALE CUỐI THÁNG 6 - JOHN HENRY BUNG NỔ ƯU ĐÃI KHỦNG LÊN ĐẾN 70%",
      excerpt: "Ưu đãi lớn nhất tháng 6 - Săn ngay loạt items yêu thích với mức giá siêu hấp dẫn:...",
      image: "/api/placeholder/400/300",
      category: "sale"
    },
    {
      id: 6,
      date: "25/06/2025",
      title: "🎉 GRAND SALE CUỐI THÁNG 6 - FREELANCER BUNG NỔ ƯU ĐÃI LỚN NHẤT THÁNG!",
      excerpt: "Freelancer chính thức khởi động chương trình Grand Sale cuối tháng 6 với ưu đãi hấp dẫn nhất trong tháng...",
      image: "/api/placeholder/400/300",
      category: "sale"
    },
    {
      id: 7,
      date: "20/06/2025",
      title: "PATTERN - SỰ GIAO HOÀ HOÀN HẢO GIỮA PHONG CÁCH VÀ CÁ TÍNH",
      excerpt: "Pattern không chỉ là họa tiết, đó là ngôn ngữ thời trang đặc biệt thể hiện cá tính và phong cách riêng...",
      image: "/api/placeholder/400/300",
      category: "fashion"
    },
    {
      id: 8,
      date: "15/06/2025",
      title: "GRAND OPENING - KHAI TRƯƠNG CỬA HÀNG JOHN HENRY",
      excerpt: "Với niềm vui và hân hoan, John Henry chính thức khai trương cửa hàng mới tại trung tâm thành phố...",
      image: "/api/placeholder/400/300",
      category: "store"
    },
    {
      id: 9,
      date: "10/06/2025",
      title: "WICKLING - BỘ SƯU TẬP MÙA HÈ 2025",
      excerpt: "Khám phá bộ sưu tập Wickling với những thiết kế năng động, trẻ trung phù hợp với mùa hè sôi động...",
      image: "/api/placeholder/400/300",
      category: "collection"
    }
  ];

  // Calculate pagination
  const totalPosts = blogPosts.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = blogPosts.slice(indexOfFirstPost, indexOfLastPost);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  const renderPagination = () => {
    const pages = [];
    
    // Previous button
    if (currentPage > 1) {
      pages.push(
        <button 
          key="prev"
          onClick={() => handlePageChange(currentPage - 1)}
          className="pagination-btn prev-btn"
        >
          ←
        </button>
      );
    }

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
        pages.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`pagination-btn ${currentPage === i ? 'active' : ''}`}
          >
            {i}
          </button>
        );
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        pages.push(
          <span key={`dots-${i}`} className="pagination-dots">...</span>
        );
      }
    }

    // Next button
    if (currentPage < totalPages) {
      pages.push(
        <button 
          key="next"
          onClick={() => handlePageChange(currentPage + 1)}
          className="pagination-btn next-btn"
        >
          →
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="blog-page">
        {/* Banner Section */}
        <section className="blog-banner">
          <div className="banner-background">
            <div className="banner-content">
              <div className="banner-text">
                <h1 className="banner-title">
                  DRESSED FOR SUCCESS.<br />
                  INSPIRED BY YOU.
                </h1>
                <div className="banner-subtitle">BLOG</div>
              </div>
              <div className="banner-images">
                <div className="banner-image left">
                  <img src="/api/placeholder/300/400" alt="Fashion Model 1" />
                </div>
                <div className="banner-image right">
                  <img src="/api/placeholder/300/400" alt="Fashion Model 2" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Breadcrumb */}
        <div className="breadcrumb-section">
          <div className="container">
            <nav className="breadcrumb">
              <Link to="/" className="breadcrumb-link">Trang chủ</Link>
              <span className="breadcrumb-separator">&gt;</span>
              <span className="breadcrumb-current">Xu Hướng</span>
            </nav>
          </div>
        </div>

        {/* Blog Grid Section */}
        <section className="blog-grid-section">
          <div className="container">
            <div className="blog-grid">
              {currentPosts.map((post) => (
                <article key={post.id} className="blog-card">
                  <div className="blog-image-container">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="blog-image"
                    />
                  </div>
                  
                  <div className="blog-content">
                    <time className="blog-date">{post.date}</time>
                    <h3 className="blog-title">{post.title}</h3>
                    <p className="blog-excerpt">{post.excerpt}</p>
                    <Link to={`/blog/${post.id}`} className="read-more-link">
                      Xem thêm »
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                {renderPagination()}
              </div>
            )}
          </div>
        </section>
      </div>
  );
};

export default Blog;
