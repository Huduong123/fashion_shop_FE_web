import api from './api';

const userService = {
  /**
   * Lấy thông tin profile của user hiện tại
   * @returns {Promise<object>} - Thông tin profile của user
   */
  getUserProfile: async () => {
    try {
      const response = await api.get('/users/profile');
      const userData = response.data;
      
      // Convert date format from backend (dd/MM/yyyy) to frontend (YYYY-MM-DD)
      if (userData.birthday && typeof userData.birthday === 'string') {
        // If it's in dd/MM/yyyy format
        if (userData.birthday.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
          const [day, month, year] = userData.birthday.split('/');
          userData.birthday = `${year}-${month}-${day}`;
        }
      }
      
      return userData;
    } catch (error) {
      console.error('Error fetching user profile:', error.response || error);
      throw error;
    }
  },

  /**
   * Cập nhật thông tin profile của user
   * @param {object} userData - Thông tin cần cập nhật
   * @returns {Promise<object>} - Thông tin profile đã cập nhật
   */
  updateUserProfile: async (userData) => {
    try {
      // Create a new object for the API call
      const requestData = { ...userData };
      
      // Format birthday to match backend expectation (dd/MM/yyyy)
      if (requestData.birthday) {
        // If it's already in ISO format (YYYY-MM-DD), convert it
        if (typeof requestData.birthday === 'string' && requestData.birthday.match(/^\d{4}-\d{2}-\d{2}$/)) {
          const [year, month, day] = requestData.birthday.split('-');
          requestData.birthday = `${day}/${month}/${year}`;
        }
      }
      
      // Handle the backend's @JsonProperty("birth_day") annotation
      // We need to send as birth_day but use birthday in our frontend
      requestData.birth_day = requestData.birthday;
      delete requestData.birthday;
      
      const response = await api.put('/users/profile', requestData);
      return response.data;
    } catch (error) {
      console.error('Error updating user profile:', error.response || error);
      throw error;
    }
  },

  /**
   * Đổi mật khẩu của user
   * @param {object} passwordData - Chứa mật khẩu cũ và mới
   * @returns {Promise<object>} - Thông báo kết quả
   */
  changePassword: async (passwordData) => {
    try {
      const response = await api.put('/users/profile/change-password', passwordData);
      return response.data;
    } catch (error) {
      console.error('Error changing password:', error.response || error);
      throw error;
    }
  }
};

export default userService;
