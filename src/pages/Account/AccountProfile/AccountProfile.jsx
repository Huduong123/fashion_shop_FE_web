import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import './AccountProfile.css';

const AccountProfile = () => {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    fullName: user?.name || 'Nguyễn Tư',
    gender: 'male',
    email: user?.email || 'nguyentuanh09788@gmail.com',
    phone: '',
    birthDate: '2003-12-29'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Profile updated:', formData);
    alert('Cập nhật thông tin thành công!');
  };

  return (
    // Bọc toàn bộ nội dung trong container này
    <div className="account-profile-container"> 
      <div className="account-profile">
        {/* Breadcrumb - Xóa span separator */}
        <div className="breadcrumb">
          <a href="/" className="breadcrumb-link">Trang chủ</a>
          <span className="breadcrumb-current">Thông tin tài khoản</span>
        </div>

        {/* Page Title */}
        <h1 className="page-title">Thông tin tài khoản</h1>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-content">
            {/* Full Name */}
            <div className="form-group">
              <label className="form-label">Họ và tên</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>

            {/* Gender */}
            <div className="form-group">
              <label className="form-label">Giới tính</label>
              <div className="gender-options">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === 'male'}
                    onChange={handleInputChange}
                  />
                  <span className="radio-custom"></span>
                  <span className="radio-label">Nam</span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === 'female'}
                    onChange={handleInputChange}
                  />
                  <span className="radio-custom"></span>
                  <span className="radio-label">Nữ</span>
                </label>
              </div>
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>

            {/* Phone */}
            <div className="form-group">
              <label className="form-label">Số điện thoại</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Nhập số điện thoại"
                className="form-input"
              />
            </div>

            {/* Birth Date */}
            <div className="form-group">
              <label className="form-label">Ngày sinh</label>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleInputChange}
                className="form-input date-input"
              />
            </div>

            {/* Submit Button */}
            <div className="form-actions">
              <button type="submit" className="update-btn">
                Cập nhật
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountProfile;