import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// ĐÃ THÊM: Import icon mắt từ thư viện react-icons
import { FiEye, FiEyeOff } from 'react-icons/fi'; 
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/authService';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // ĐÃ THÊM: State để quản lý việc hiển thị/ẩn mật khẩu
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Xử lý khi người dùng nhập liệu
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name] || errors.general) {
      setErrors(prev => ({ ...prev, [name]: null, general: null }));
    }
  };

  // ĐÃ THÊM: Hàm để bật/tắt hiển thị mật khẩu
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(prev => !prev);
  };

  // Kiểm tra các trường có bị bỏ trống hay không
  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = 'Tên đăng nhập không được để trống.';
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Mật khẩu không được để trống.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Xử lý khi gửi form đăng nhập
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const userData = await authService.login({
        username: formData.username,
        password: formData.password
      });
      
      login(userData);
      
      console.log('Login successful:', userData);
      alert('Đăng nhập thành công!');
      
      navigate('/');

    } catch (error) {
      console.error('Login failed:', error);
      const errorMessage = error.response?.data?.message || 'Tài khoản hoặc mật khẩu không chính xác.';
      setErrors({ general: errorMessage });
      
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <h1 className="login-title">Đăng nhập</h1>
          
          <form onSubmit={handleSubmit} className="login-form" noValidate>

            {errors.general && <span className="error-message general-error">{errors.general}</span>}

            {/* Trường Tên đăng nhập */}
            <div className="form-group">
              <input
                type="text"
                name="username"
                placeholder="Tên đăng nhập"
                value={formData.username}
                onChange={handleInputChange}
                className={`form-input ${errors.username ? 'error' : ''}`}
                required
              />
              {errors.username && <span className="error-message">{errors.username}</span>}
            </div>

            {/* ĐÃ THAY ĐỔI: Cập nhật trường Mật khẩu */}
            <div className="form-group">
              <input
                // Thay đổi type dựa vào state isPasswordVisible
                type={isPasswordVisible ? 'text' : 'password'}
                name="password"
                placeholder="Mật khẩu"
                value={formData.password}
                onChange={handleInputChange}
                className={`form-input ${errors.password ? 'error' : ''}`}
                required
              />
              {/* Thêm icon vào đây */}
              <span className="password-toggle-icon" onClick={togglePasswordVisibility}>
                {isPasswordVisible ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </span>

              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <div className="recaptcha-notice">
              <p>
                This site is protected by reCAPTCHA and the Google{' '}
                <a href="#" className="policy-link">Privacy Policy</a> and{' '}
                <a href="#" className="policy-link">Terms of Service</a> apply.
              </p>
            </div>

            <button 
              type="submit" 
              className={`login-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'ĐANG ĐĂNG NHẬP...' : 'ĐĂNG NHẬP'}
            </button>
          </form>

          <div className="login-footer">
            <div className="footer-links">
              <Link to="/forgot-password" className="forgot-password-link">
                Quên mật khẩu?
              </Link>
              <span className="separator">hoặc</span>
              <Link to="/register" className="register-link">
                Đăng ký
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;