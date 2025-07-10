import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BlogSection.css';

const BlogSection = () => {
  const navigate = useNavigate();

  const handleViewAllBlogs = () => {
    navigate('/blog');
  };

  const blogPosts = [
    {
      id: 1,
      date: "07/07/2025",
      title: "THE PERFECT EVERYDAY WALLET",
      excerpt: "Chiếc ví không chỉ là phụ kiện lưu giữ tiền bạc, giấy tờ mà còn là dấu ấn phong cách và đẳng cấp ...",
      image: "/api/placeholder/400/250",
      type: "accessories"
    },
    {
      id: 2,
      date: "07/07/2025", 
      title: "🌧️ RAINY SEASON GIFTS - MÙA MƯA ĐẾN, QUÀ FREELANCER CŨNG TỚI!",
      excerpt: "Thời tiết đầu có mưa dài cùng không thể ngăn bạn diện đồ đẹp - và Freelancer cảng ...",
      image: "/api/placeholder/400/250",
      type: "promotion"
    },
    {
      id: 3,
      date: "07/07/2025",
      title: "RAINY SEASON GIFTS | MUA TO, CÓ JOHN HENRY LO!",
      excerpt: "Mùa mưa năm này, JOHN HENRY sẽ đồng hành cùng bạn trên mọi nẻo đường với chương trình quà tặng si...",
      image: "/api/placeholder/400/250", 
      type: "promotion"
    }
  ];

  return (
    <section className="blog-section">
      <div className="blog-container">
        {/* Section Title */}
        <div className="blog-header">
          <h2 className="blog-title">BLOG</h2>
        </div>

        {/* Blog Grid */}
        <div className="blog-grid">
          {blogPosts.map((post) => (
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
                <h3 className="blog-post-title">{post.title}</h3>
                <p className="blog-excerpt">{post.excerpt}</p>
              </div>
            </article>
          ))}
        </div>

        {/* View All Button */}
        <div className="blog-footer">
          <button className="view-all-blog-btn" onClick={handleViewAllBlogs}>
            XEM TẤT CẢ
          </button>
        </div>
      </div>
    </section>
  );
};

export default BlogSection; 