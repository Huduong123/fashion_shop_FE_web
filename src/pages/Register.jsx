// Register.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    gender: 'female',
    birthDate: '',
    phone: '',
    email: '',
    password: '',
    agreeToTerms: false
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prevErrors => ({ ...prevErrors, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Kiểm tra từng trường bắt buộc
    if (!formData.fullName.trim()) newErrors.fullName = "Họ và tên không được để trống";
    if (!formData.username.trim()) newErrors.username = "Tên đăng nhập không được để trống";
    if (!formData.password) newErrors.password = "Mật khẩu không được để trống";
    if (!formData.email.trim()) newErrors.email = "Email không được để trống";
    if (!formData.phone.trim()) newErrors.phone = "Số điện thoại không được để trống";
    if (!formData.birthDate) newErrors.birthDate = "Ngày sinh không được để trống";
    
    // BƯỚC 1: XÓA BỎ HOÀN TOÀN KHỐI LỆNH IF DƯỚI ĐÂY
    /* 
    if (!formData.agreeToTerms) {
        newErrors.general = "Bạn phải đồng ý với điều khoản dịch vụ của chúng tôi.";
    }
    */

    return newErrors;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    // BƯỚC 2: KIỂM TRA LẠI LỖI VALIDATION (KHÔNG CÒN LỖI GENERAL TỪ CHECKBOX)
    // Nếu có lỗi ở các trường input, thì dừng lại
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; 
    }

    // Nếu không có lỗi, tiếp tục
    setIsLoading(true);
    setErrors({});
    setSuccessMessage('');

    const payload = {
      username: formData.username,
      password: formData.password,
      email: formData.email,
      fullname: formData.fullName,
      phone: formData.phone
    };

    try {
      const API_URL = 'http://localhost:8080/api/users/register';
      const response = await axios.post(API_URL, payload);

      if (response.status === 200) {
        setSuccessMessage('Đăng ký thành công! Bạn sẽ được chuyển đến trang đăng nhập trong giây lát...');
        setTimeout(() => navigate('/login'), 3000);
      }
    } catch (err) {
      if (err.response?.data?.messages) {
        const backendErrors = {};
        err.response.data.messages.forEach(msg => {
          const lowerCaseMsg = msg.toLowerCase();
          if (lowerCaseMsg.includes('password')) backendErrors.password = msg;
          else if (lowerCaseMsg.includes('username')) backendErrors.username = msg;
          else if (lowerCaseMsg.includes('email')) backendErrors.email = msg;
          else if (lowerCaseMsg.includes('họ và tên')) backendErrors.fullName = msg;
          else if (lowerCaseMsg.includes('phone') || lowerCaseMsg.includes('số điện thoại')) backendErrors.phone = msg;
          else backendErrors.general = msg;
        });
        setErrors(backendErrors);
      } else {
        setErrors({ general: "Đã có lỗi không xác định xảy ra. Vui lòng thử lại." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        {/* ... (Các phần JSX khác không thay đổi) ... */}
        <div className="register-content">
          <h1 className="register-title">TẠO TÀI KHOẢN</h1>
          <p className="register-subtitle">Quý khách vui lòng nhập thông tin để đăng ký</p>
          
          <form onSubmit={handleSubmit} className="register-form" noValidate>
            
            <div className="form-row">
              <div className="form-group">
                <input type="text" name="fullName" placeholder="Họ và tên" value={formData.fullName} onChange={handleInputChange} className="form-input" />
                {errors.fullName && <span className="error-text">{errors.fullName}</span>}
              </div>
              <div className="form-group">
                <input type="text" name="username" placeholder="Tên đăng nhập" value={formData.username} onChange={handleInputChange} className="form-input" />
                {errors.username && <span className="error-text">{errors.username}</span>}
              </div>
            </div>

            <div className="form-group">
              <input type="password" name="password" placeholder="Mật khẩu" value={formData.password} onChange={handleInputChange} className="form-input" />
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} className="form-input" />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>
              <div className="form-group">
                <input type="tel" name="phone" placeholder="Phone" value={formData.phone} onChange={handleInputChange} className="form-input"  />
                {errors.phone && <span className="error-text">{errors.phone}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <div className="gender-selection">
                  <label className="gender-option">
                    <input type="radio" name="gender" value="female" checked={formData.gender === 'female'} onChange={handleInputChange} />
                    <span className="gender-label">Nữ</span>
                  </label>
                  <label className="gender-option">
                    <input type="radio" name="gender" value="male" checked={formData.gender === 'male'} onChange={handleInputChange} />
                    <span className="gender-label">Nam</span>
                  </label>
                </div>
              </div>
              <div className="form-group">
                <input type="text" onFocus={(e) => (e.target.type = 'date')} onBlur={(e) => (e.target.type = 'text')} name="birthDate" placeholder="Ngày sinh (dd/mm/yyyy)" value={formData.birthDate} onChange={handleInputChange} className="form-input date-input" />
                {errors.birthDate && <span className="error-text">{errors.birthDate}</span>}
              </div>
            </div>

            <div className="form-group">
              <div className="terms-agreement">
                <label className="terms-label">
                  <input type="checkbox" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleInputChange} className="terms-checkbox" required/>
                  <span className="terms-text">
                    Nhấn vào "Đăng ký" quý khách chấp nhận{' '}
                    <a href="#" className="terms-link">điều khoản dịch vụ</a> của chúng tôi
                  </span>
                </label>
              </div>
            </div>

            {/* BƯỚC 3: DÒNG NÀY SẼ KHÔNG BAO GIỜ HIỂN THỊ LỖI CỦA CHECKBOX NỮA */}
            {errors.general && <p className="error-message">{errors.general}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}

            <button type="submit" className="register-button" disabled={isLoading}>
              {isLoading ? 'ĐANG XỬ LÝ...' : 'ĐĂNG KÝ'}
            </button>
          </form>

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