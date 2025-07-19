import api from './api';

const authService = {
  /**
   * Gọi API để đăng nhập user.
   * @param {object} credentials - Chứa username và password. // ĐÃ THAY ĐỔI: Ghi chú lại là username
   * @returns {Promise<object>} - Dữ liệu user trả về từ server.
   */
  login: async (credentials) => {
    try {
      const response = await api.post('/users/login', credentials);
      
      const { token, user } = response.data;

      if (token) {
        localStorage.setItem('accessToken', token);
      }

      return user;

    } catch (error) {
      console.error('Login service error:', error.response || error);
      throw new Error(error.response?.data?.message || 'Tên đăng nhập hoặc mật khẩu không đúng.'); // Đổi thông báo lỗi mặc định
    }
  },

  register: async (userData) => {
    // ...
  }
};

export default authService;