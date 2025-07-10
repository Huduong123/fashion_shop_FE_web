import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
// Import các icon cần thiết từ thư viện react-icons
import { 
  FaMapMarkerAlt, 
  FaPhone, 
  FaPlus, 
  FaCheck 
} from 'react-icons/fa';
// Import icon PNG files
import EditIcon from '../../../assets/images/icons/edit.png';
import DeleteIcon from '../../../assets/images/icons/delete.png';
import './AccountAddresses.css';

const AccountAddresses = () => {
  const { user } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: 'Nguyễn Tư',
      address: '123 Đường ABC, Phường 1, Quận 1, TP. Hồ Chí Minh',
      phone: '0763554774',
      isDefault: true
    },
    {
      id: 2,
      name: 'Ba TE',
      address: '456 Bùi Quang Là, Phường 12, Quận Gò Vấp, TP. Hồ Chí Minh',
      phone: '025874147',
      isDefault: false
    }
  ]);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    province: '',
    phone: '',
    isDefault: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    
    const newAddress = {
      id: addresses.length + 1,
      name: `${formData.firstName} ${formData.lastName}`,
      address: `${formData.address}, ${formData.province}`,
      phone: formData.phone,
      isDefault: formData.isDefault
    };

    if (formData.isDefault) {
      // Set all other addresses to not default
      setAddresses(prev => prev.map(addr => ({ ...addr, isDefault: false })));
    }

    setAddresses(prev => [...prev, newAddress]);
    
    // Reset form and close
    setFormData({
      firstName: '',
      lastName: '',
      address: '',
      province: '',
      phone: '',
      isDefault: false
    });
    setShowAddForm(false);
    
    alert('Thêm địa chỉ thành công!');
  };
  
  const handleDeleteAddress = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) {
      setAddresses(prev => prev.filter(addr => addr.id !== id));
    }
  };

  const handleCancelAdd = () => {
    // Reset form fields
    setFormData({
      firstName: '',
      lastName: '',
      address: '',
      province: '',
      phone: '',
      isDefault: false
    });
    setShowAddForm(false);
  };

  return (
    <div className="account-address-container">
      {!showAddForm ? (
        // Address List View
        <div className="addresses-list-view">
          <h1 className="page-title">Địa chỉ của tôi</h1>
          
          <div className="addresses-grid">
            {addresses.map((address) => (
              <div 
                key={address.id} 
                className={`address-card ${address.isDefault ? 'default' : ''}`}
              >
                <div className="address-main">
                  <div className="address-name">
                    {address.name}
                    {address.isDefault && (
                      <span className="default-badge">
                        <FaCheck /> Mặc định
                      </span>
                    )}
                  </div>
                  <div className="address-details">
                    <div className="address-text">
                      <span className="address-icon"><FaMapMarkerAlt /></span>
                      {address.address}
                    </div>
                    <div className="address-phone">
                      <span className="address-icon"><FaPhone /></span>
                      {address.phone}
                    </div>
                  </div>
                </div>
                <div className="address-actions">
                  <button className="action-btn edit-btn" title="Chỉnh sửa">
                    <img src={EditIcon} alt="Edit" />
                  </button>
                  {!address.isDefault && (
                    <button 
                      className="action-btn delete-btn" 
                      title="Xóa"
                      onClick={() => handleDeleteAddress(address.id)}
                    >
                      <img src={DeleteIcon} alt="Delete" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button className="add-address-btn" onClick={() => setShowAddForm(true)}>
            <FaPlus /> Thêm địa chỉ mới
          </button>
        </div>
      ) : (
        // Add Address Form View
        <div className="add-address-view">
          <h1 className="page-title">Thêm địa chỉ mới</h1>

          <form onSubmit={handleAddAddress} className="add-address-form">
            <div className="form-content">
              <div className="form-row">
                <div className="form-group half">
                  <label className="form-label">Họ</label>
                  <input
                    type="text" name="firstName" value={formData.firstName}
                    onChange={handleInputChange} placeholder="Họ"
                    className="form-input" required
                  />
                </div>
                <div className="form-group half">
                  <label className="form-label">Tên</label>
                  <input
                    type="text" name="lastName" value={formData.lastName}
                    onChange={handleInputChange} placeholder="Tên"
                    className="form-input" required
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Địa chỉ</label>
                <input
                  type="text" name="address" value={formData.address}
                  onChange={handleInputChange} placeholder="Địa chỉ"
                  className="form-input" required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Tỉnh thành</label>
                <select
                  name="province" value={formData.province}
                  onChange={handleInputChange} className="form-select" required
                >
                  <option value="">Chọn Tỉnh/Thành phố</option>
                  <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                  <option value="Hà Nội">Hà Nội</option>
                  <option value="Đà Nẵng">Đà Nẵng</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Số điện thoại</label>
                <input
                  type="tel" name="phone" value={formData.phone}
                  onChange={handleInputChange} placeholder="Số điện thoại"
                  className="form-input" required
                />
              </div>
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox" name="isDefault" checked={formData.isDefault}
                    onChange={handleInputChange} className="checkbox-input"
                  />
                  <span className="checkbox-custom"></span>
                  <span className="checkbox-text">Đặt làm địa chỉ mặc định</span>
                </label>
              </div>
              <div className="form-actions">
                <button type="button" onClick={handleCancelAdd} className="form-btn cancel-btn">
                  Hủy
                </button>
                <button type="submit" className="form-btn submit-btn">
                  Thêm mới
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AccountAddresses;