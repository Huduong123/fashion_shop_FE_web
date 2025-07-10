import React from 'react';
import './Footer.css';
import Facebook from '../../assets/images/icons/facebook.png';
import Instagram from '../../assets/images/icons/instagram.png';
import Youtube from '../../assets/images/icons/youtube.png';
import Momo from '../../assets/images/icons/momo.png';
import Vnpay from '../../assets/images/icons/vnpay.png';
import Logo from '../../assets/images/logo/logo1.jpg';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Top Section */}
        <div className="footer-top">
          {/* Company Info */}
          <div className="footer-column company-info">
            <div className="logos">
              <img src={Logo} alt="Company Logo" className="company-logo" />
            </div>
            
            <div className="company-details">
              <div className="detail-item">
                <span className="icon">🏢</span>
                <span>Công ty TNHH NTA GROUP</span>
              </div>
              <div className="detail-item">
                <span className="icon">📍</span>
                <span>172 Nguyễn Trãi, P.Bến Thành, Q1, HCM</span>
              </div>
              <div className="detail-item">
                <span className="icon">📞</span>
                <span>0914 516 446 - 0906 954 368</span>
              </div>
              <div className="detail-item">
                <span className="icon">✉️</span>
                <span>cskh@ntagroup.com</span>
              </div>
            </div>

          </div>

          {/* Company Links */}
          <div className="footer-column">
            <h3 className="column-title">CÔNG TY</h3>
            <ul className="footer-links">
              <li><a href="#">Về chúng tôi</a></li>
              <li><a href="#">Xu hướng</a></li>
              <li><a href="#">Liên hệ</a></li>
              <li><a href="#">Tuyển dụng</a></li>
              <li><a href="#">Theo dõi đơn hàng</a></li>
              <li><a href="#">Nhượng quyền</a></li>
              <li><a href="#">Ưu đãi VIP member</a></li>
            </ul>
          </div>

          {/* Policy Links */}
          <div className="footer-column">
            <h3 className="column-title">CHÍNH SÁCH</h3>
            <ul className="footer-links">
              <li><a href="#">Đăng ký thành viên</a></li>
              <li><a href="#">Hướng dẫn thanh toán</a></li>
              <li><a href="#">Giao hàng và phí vận chuyển</a></li>
              <li><a href="#">Chính sách đổi trả</a></li>
              <li><a href="#">Chính sách bảo mật</a></li>
              <li><a href="#">Điều khoản và thanh toán</a></li>
            </ul>
          </div>

          {/* Connect Section */}
          <div className="footer-column connect-section">
            <h3 className="column-title">KẾT NỐI VỚI CHÚNG TÔI</h3>
            
            <div className="newsletter">
              <div className="email-input-container">
                <input 
                  type="email" 
                  placeholder="Email" 
                  className="email-input"
                />
                <button className="subscribe-btn">Gửi</button>
              </div>
            </div>

            <div className="social-media">
              <div className="social-row">
                <a href="#" className="social-link facebook">
                  <img src={Facebook} alt="Facebook" />
                </a>
                <a href="#" className="social-link instagram">
                  <img src={Instagram} alt="Instagram" />
                </a>
                <a href="#" className="social-link youtube">
                  <img src={Youtube} alt="Youtube" />
                </a>
              </div>
            </div>

            <div className="payment-methods">
              <h4>PHƯƠNG THỨC THANH TOÁN</h4>
              <div className="payment-icons">
                <div className="payment-icon momo">
                  <img src={Momo} alt="Momo" />
                </div>
                <div className="payment-icon vnpay">
                  <img src={Vnpay} alt="Vnpay" />
                </div>
              
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="footer-bottom">
          <p className="copyright">
            Copyright © 2025 NTA GROUP
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 