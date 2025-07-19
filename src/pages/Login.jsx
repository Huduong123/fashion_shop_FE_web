import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/authService';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  // ĐÃ THAY ĐỔI: Chuyển state từ 'email' sang 'username'
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handle input change (hàm này không cần đổi)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  // ĐÃ THAY ĐỔI: Cập nhật hàm validate cho username
  const validateForm = () => {
    if (!formData.username || !formData.password) {
      setError('Tên đăng nhập và mật khẩu không được để trống.');
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // ĐÃ THAY ĐỔI: authService.login giờ sẽ nhận { username, password }
      // DTO (Data Transfer Object) này phải khớp với những gì backend UserLoginDTO mong đợi
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
      setError(error.message || 'Tên đăng nhập hoặc mật khẩu không đúng. Vui lòng thử lại.');
      
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <h1 className="login-title">Đăng nhập</h1>
          
          <form onSubmit={handleSubmit} className="login-form">
            {error && <div className="error-message-general">{error}</div>}

            {/* ĐÃ THAY ĐỔI: Input cho username */}
            <div className="form-group">
              <input
                type="text" // Đổi từ "email" sang "text"
                name="username" // Đổi từ "email" sang "username"
                placeholder="Tên đăng nhập" // Đổi placeholder
                value={formData.username}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>

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