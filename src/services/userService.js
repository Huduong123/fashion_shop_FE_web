import api from './api';

const userService = {
  /**
   * Lấy thông tin profile của user hiện tại
   * @returns {Promise<object>} - Thông tin profile của user
   */
  getUserProfile: async () => {
    try {
      const response = await api.get('/users/profile');
      return response.data;
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
      const response = await api.put('/users/profile', userData);
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
