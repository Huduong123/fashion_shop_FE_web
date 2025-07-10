import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    gender: 'female', // default to female as shown in image
    birthDate: '',
    phone: '',
    email: '',
    password: '',
    agreeToTerms: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle registration logic here
    console.log('Registration form submitted:', formData);
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-content">
          <h1 className="register-title">TẠO TÀI KHOẢN</h1>
          <p className="register-subtitle">Quý khách vui lòng nhập thông tin để đăng ký</p>
          
          <form onSubmit={handleSubmit} className="register-form">
            {/* Full Name */}
            <div className="form-group">
              <input
                type="text"
                name="fullName"
                placeholder="Họ và tên"
                value={formData.fullName}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>

            {/* Username */}
            <div className="form-group">
              <input
                type="text"
                name="username"
                placeholder="Tên đăng nhập"
                value={formData.username}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>

            {/* Password */}
            <div className="form-group">
              <input
                type="password"
                name="password"
                placeholder="Mật khẩu"
                value={formData.password}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>

            {/* Email */}
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>

            {/* Phone */}
            <div className="form-group">
              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>

            {/* Gender Selection */}
            <div className="form-group">
              <div className="gender-selection">
                <label className="gender-option">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === 'female'}
                    onChange={handleInputChange}
                  />
                  <span className="gender-label">Nữ</span>
                </label>
                <label className="gender-option">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === 'male'}
                    onChange={handleInputChange}
                  />
                  <span className="gender-label">Nam</span>
                </label>
              </div>
            </div>

            {/* Birth Date */}
            <div className="form-group">
              <input
                type="date"
                name="birthDate"
                placeholder="dd/mm/yyyy"
                value={formData.birthDate}
                onChange={handleInputChange}
                className="form-input date-input"
                required
              />
            </div>

            {/* Terms Agreement */}
            <div className="form-group">
              <div className="terms-agreement">
                <label className="terms-label">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    className="terms-checkbox"
                    required
                  />
                  <span className="terms-text">
                    Nhấn vào "Đăng ký" quý khách chấp nhận{' '}
                    <a href="#" className="terms-link">điều khoản dịch vụ</a> và chúng tôi
                  </span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" className="register-button">
              ĐĂNG KÝ
            </button>
          </form>

          {/* Footer with login link */}
          <div className="register-footer">
            <div className="footer-links">
              <span>Đã có tài khoản?</span>
              <Link to="/login" className="login-link">
                Đăng nhập
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register; 