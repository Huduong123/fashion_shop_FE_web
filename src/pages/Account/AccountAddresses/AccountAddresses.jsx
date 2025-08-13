import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
// Import các icon cần thiết từ thư viện react-icons
import { 
  FaMapMarkerAlt, 
  FaPhone, 
  FaPlus, 
  FaCheck,
  FaSpinner
} from 'react-icons/fa';
// Import icon PNG files
import EditIcon from '../../../assets/images/icons/edit.png';
import DeleteIcon from '../../../assets/images/icons/delete.png';
import './AccountAddresses.css';
import userService from '../../../services/userService';

const AccountAddresses = () => {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [editingAddressId, setEditingAddressId] = useState(null);
  
  // Fetch addresses from the backend
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setIsLoading(true);
        const addressesData = await userService.getUserAddresses();
        setAddresses(addressesData.map(address => ({
          id: address.id,
          name: address.recipientName,
          address: address.addressDetail,
          phone: address.phoneNumber,
          isDefault: address.isDefault
        })));
        setError(null);
      } catch (error) {
        console.error('Failed to fetch addresses:', error);
        setError('Không thể lấy danh sách địa chỉ. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchAddresses();
    }
  }, [user]);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    province: '',
    phone: '',
    isDefault: false
  });
  
  // Function to parse an address into first and last name, street address, and province
  const parseAddress = (fullName, addressDetail) => {
    // Parse full name into first and last name
    const nameParts = fullName.split(' ');
    let firstName = '';
    let lastName = '';
    
    if (nameParts.length === 1) {
      lastName = nameParts[0];
    } else if (nameParts.length > 1) {
      lastName = nameParts.pop();
      firstName = nameParts.join(' ');
    }
    
    // Parse address detail into street address and province
    const addressParts = addressDetail.split(', ');
    let province = '';
    let streetAddress = '';
    
    if (addressParts.length > 1) {
      province = addressParts.pop();
      streetAddress = addressParts.join(', ');
    } else {
      streetAddress = addressDetail;
    }
    
    return { firstName, lastName, streetAddress, province };
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle form submission for both adding and editing addresses
  const handleSubmitAddress = async (e) => {
    e.preventDefault();
    
    try {
      // Common data preparation for both adding and updating
      const addressData = {
        recipientName: `${formData.firstName} ${formData.lastName}`.trim(),
        addressDetail: `${formData.address}, ${formData.province}`,
        phoneNumber: formData.phone,
        isDefault: formData.isDefault
      };

      let response;
      
      if (editingAddressId) {
        // UPDATING EXISTING ADDRESS
        response = await userService.updateUserAddress(editingAddressId, addressData);
        
        // Update the addresses list with the edited address
        setAddresses(prev => prev.map(addr => 
          addr.id === editingAddressId ? {
            id: response.id,
            name: response.recipientName,
            address: response.addressDetail,
            phone: response.phoneNumber,
            isDefault: response.isDefault
          } : (response.isDefault ? { ...addr, isDefault: false } : addr)
        ));
        
        alert('Cập nhật địa chỉ thành công!');
      } else {
        // ADDING NEW ADDRESS
        // Check if this is the user's first address
        const isFirstAddress = addresses.length === 0;
        
        // Automatically set as default if it's the first address
        if (isFirstAddress) {
          addressData.isDefault = true;
        }
        
        // Call API to create address
        response = await userService.createUserAddress(addressData);
        
        // Create the new address object
        const newAddress = {
          id: response.id,
          name: response.recipientName,
          address: response.addressDetail,
          phone: response.phoneNumber,
          isDefault: response.isDefault
        };

        // If new address is default, update all other addresses locally
        if (response.isDefault) {
          setAddresses(prev => prev.map(addr => ({ ...addr, isDefault: false })));
        }

        // Add the new address to the list
        setAddresses(prev => [...prev, newAddress]);
        
        alert('Thêm địa chỉ thành công!');
      }
      
      // Reset form and close
      setFormData({
        firstName: '',
        lastName: '',
        address: '',
        province: '',
        phone: '',
        isDefault: false
      });
      setShowForm(false);
      setEditingAddressId(null);
      
    } catch (error) {
      console.error('Failed to save address:', error);
      alert(`Không thể ${editingAddressId ? 'cập nhật' : 'thêm'} địa chỉ. Vui lòng thử lại sau.`);
    }
  };
  
  const handleDeleteAddress = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) {
      try {
        // Call API to delete address
        await userService.deleteUserAddress(id);
        
        // Update local state after successful deletion
        setAddresses(prev => prev.filter(addr => addr.id !== id));
        alert('Xóa địa chỉ thành công!');
      } catch (error) {
        console.error('Failed to delete address:', error);
        alert('Không thể xóa địa chỉ. Vui lòng thử lại sau.');
      }
    }
  };

  // Function to handle edit button click
  const handleEditClick = (address) => {
    // Parse the address details
    const { firstName, lastName, streetAddress, province } = parseAddress(address.name, address.address);
    
    // Set form data with current address values
    setFormData({
      firstName,
      lastName,
      address: streetAddress,
      province,
      phone: address.phone,
      isDefault: address.isDefault
    });
    
    // Set editing state
    setEditingAddressId(address.id);
    setShowForm(true);
  };
  
  // Reset form and exit edit/add mode
  const handleCancelForm = () => {
    // Reset form fields
    setFormData({
      firstName: '',
      lastName: '',
      address: '',
      province: '',
      phone: '',
      isDefault: false
    });
    setShowForm(false);
    setEditingAddressId(null);
  };

  return (
    <div className="account-address-container">
      {!showForm ? (
        // Address List View
        <div className="addresses-list-view">
          <h1 className="page-title">Địa chỉ của tôi</h1>
          
          {isLoading ? (
            <div className="loading-container">
              <FaSpinner className="loading-spinner" />
              <p>Đang tải danh sách địa chỉ...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <p className="error-message">{error}</p>
              <button 
                className="retry-btn" 
                onClick={() => {
                  setError(null);
                  setIsLoading(true);
                  userService.getUserAddresses()
                    .then(addressesData => {
                      setAddresses(addressesData.map(address => ({
                        id: address.id,
                        name: address.recipientName,
                        address: address.addressDetail,
                        phone: address.phoneNumber,
                        isDefault: address.isDefault
                      })));
                      setIsLoading(false);
                    })
                    .catch(err => {
                      console.error('Failed to fetch addresses:', err);
                      setError('Không thể lấy danh sách địa chỉ. Vui lòng thử lại sau.');
                      setIsLoading(false);
                    });
                }}
              >
                Thử lại
              </button>
            </div>
          ) : addresses.length === 0 ? (
            <div className="no-addresses">
              <p>Bạn chưa có địa chỉ nào.</p>
              <button className="add-address-btn" onClick={() => setShowForm(true)}>
                <FaPlus /> Thêm địa chỉ mới
              </button>
            </div>
          ) : (
            <>
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
                      <button 
                        className="action-btn edit-btn" 
                        title="Chỉnh sửa"
                        onClick={() => handleEditClick(address)}
                      >
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

              <button className="add-address-btn" onClick={() => setShowForm(true)}>
                <FaPlus /> Thêm địa chỉ mới
              </button>
            </>
          )}
        </div>
      ) : (
        // Address Form View (Add or Edit)
        <div className="add-address-view">
          <h1 className="page-title">
            {editingAddressId ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
          </h1>

          <form onSubmit={handleSubmitAddress} className="add-address-form">
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
                {addresses.length === 0 && !editingAddressId ? (
                  <div className="info-message">
                    <span>Đây là địa chỉ đầu tiên của bạn và sẽ tự động được đặt làm địa chỉ mặc định</span>
                  </div>
                ) : (
                  <label className="checkbox-label">
                    <input
                      type="checkbox" name="isDefault" checked={formData.isDefault}
                      onChange={handleInputChange} className="checkbox-input"
                      disabled={editingAddressId && addresses.find(a => a.id === editingAddressId)?.isDefault}
                    />
                    <span className="checkbox-custom"></span>
                    <span className="checkbox-text">
                      Đặt làm địa chỉ mặc định
                      {editingAddressId && addresses.find(a => a.id === editingAddressId)?.isDefault && 
                        " (Không thể bỏ chọn địa chỉ mặc định)"}
                    </span>
                  </label>
                )}
              </div>
              <div className="form-actions">
                <button type="button" onClick={handleCancelForm} className="form-btn cancel-btn">
                  Hủy
                </button>
                <button type="submit" className="form-btn submit-btn">
                  {editingAddressId ? 'Cập nhật' : 'Thêm mới'}
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