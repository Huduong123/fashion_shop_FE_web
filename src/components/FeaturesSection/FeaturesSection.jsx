import React from 'react';
import './FeaturesSection.css';
// Import các icon cần thiết từ thư viện react-icons
import { FaShippingFast, FaAward, FaShieldAlt, FaCcVisa, FaHeadset, FaTags } from 'react-icons/fa';

const FeaturesSection = () => {
  const features = [
    {
      id: 1,
      // Sử dụng component icon thay cho emoji
      icon: <FaShippingFast />,
      title: "Giao hàng nhanh",
      description: "Chỉ từ 2 - 5 ngày"
    },
    {
      id: 2,
      icon: <FaTags />,
      title: "Miễn phí vận chuyển",
      description: "Cho đơn hàng từ 299K"
    },
    {
      id: 3,
      icon: <FaAward />,
      title: "Cam kết chất lượng",
      description: "Sản phẩm chính hãng, độ bền cao"
    },
    {
      id: 4,
      icon: <FaShieldAlt />,
      title: "Bảo hành chính hãng",
      description: "An tâm sử dụng với chính sách bảo hành uy tín"
    },
    {
      id: 5,
      icon: <FaCcVisa />,
      title: "Thanh toán dễ dàng",
      description: "Hỗ trợ COD, thẻ & chuyển khoản"
    },
    {
      id: 6,
      icon: <FaHeadset />,
      title: "Hotline hỗ trợ",
      description: "0906.954.368 (8h-21h)"
    }
  ];

  return (
    <section className="features-section">
      <div className="features-container">
        <div className="features-grid">
          {features.map((feature) => (
            <div key={feature.id} className="feature-item-card">
              {/* Icon được render trực tiếp */}
              <div className="feature-item-icon">{feature.icon}</div>
              <div className="feature-item-content">
                <h4 className="feature-item-title">{feature.title}</h4>
                <p className="feature-item-description">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;