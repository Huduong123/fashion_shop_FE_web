import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import userService from '../../../services/userService';
import './AccountProfile.css';

const AccountProfile = () => {
  const { user, login } = useAuth();
  
  const [formData, setFormData] = useState({
    fullname: '',
    gender: '',
    email: '',
    phone: '',
    birthday: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const profileData = await userService.getUserProfile();
        
        // Map the backend data to our form fields
        setFormData({
          fullname: profileData.fullname || '',
          gender: profileData.gender || 'male',
          email: profileData.email || '',
          phone: profileData.phone || '',
          birthday: profileData.birthday || ''
        });
        
        setError(null);
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
        setError('Không thể tải thông tin người dùng. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Client-side validation
      if (!formData.email) {
        setError('Email không được để trống');
        return;
      }
      if (!formData.email.match(/^[\w.+\-]+@gmail\.com$/)) {
        setError('Email phải đúng định dạng @gmail.com');
        return;
      }
      if (!formData.fullname || formData.fullname.length < 6) {
        setError('Họ và tên phải trên 5 ký tự');
        return;
      }
      if (!formData.phone || !formData.phone.match(/^0\d{9}$/)) {
        setError('Số điện thoại phải đúng định dạng 0xxxxxxxxx');
        return;
      }
      if (!formData.gender) {
        setError('Vui lòng chọn giới tính');
        return;
      }
      if (!formData.birthday) {
        setError('Vui lòng chọn ngày sinh');
        return;
      }

      setLoading(true);
      setError(null);
      setSuccessMessage('');
      
      // Map form data to match backend DTO format
      const updateData = {
        email: formData.email,
        fullname: formData.fullname,
        phone: formData.phone,
        gender: formData.gender || 'male', // Default to male if empty
        birthday: formData.birthday
      };
      
      const updatedProfile = await userService.updateUserProfile(updateData);
      // Update the user data in Auth context
      login(updatedProfile);
      setSuccessMessage('Cập nhật thông tin thành công!');
    } catch (err) {
      console.error('Failed to update profile:', err);
      
      // Handle detailed validation errors from backend
      if (err.response?.data?.messages && Array.isArray(err.response.data.messages)) {
        const errorMessages = err.response.data.messages.join(', ');
        setError(errorMessages);
      } else {
        setError(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thông tin.');
      }
    } finally {
      setLoading(false);
    }
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

        {/* Loading indicator */}
        {loading && (
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        )}
        
        {/* Profile Form */}
        {!loading && (
          <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-content">
            {/* Full Name */}
            <div className="form-group">
              <label className="form-label">Họ và tên</label>
              <input
                type="text"
                name="fullname"
                value={formData.fullname}
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
                name="birthday"
                value={formData.birthday || ''}
                onChange={handleInputChange}
                className="form-input date-input"
              />
            </div>

            {/* Error and success messages */}
            {error && <div className="error-message">{error}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}
            
            {/* Submit Button */}
            <div className="form-actions">
              <button type="submit" className="update-btn" disabled={loading}>
                {loading ? 'Đang xử lý...' : 'Cập nhật'}
              </button>
            </div>
          </div>
        </form>
        )}
      </div>
    </div>
  );
};

export default AccountProfile;