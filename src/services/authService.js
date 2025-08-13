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

  /**
   * Gọi API để đăng ký user mới.
   * @param {object} userData - Dữ liệu đăng ký của user bao gồm username, password, email, fullname, phone, gender và birthDate.
   * @returns {Promise<object>} - Dữ liệu user đã đăng ký thành công.
   */
  register: async (userData) => {
    try {
      // Log the data being sent for debugging
      console.log('Sending registration data:', JSON.stringify(userData));
      
      const response = await api.post('/users/register', userData);
      return response.data;
    } catch (error) {
      console.error('Register service error:', error.response || error);
      
      // Format error message for better user experience
      if (error.response?.data?.messages) {
        // Handle validation errors
        const errorMessages = error.response.data.messages;
        const formattedError = new Error(errorMessages.join(', '));
        formattedError.fieldErrors = {};
        
        // Map error messages to specific fields
        errorMessages.forEach(msg => {
          if (msg.includes('gender')) formattedError.fieldErrors.gender = msg;
          else if (msg.includes('birthDate')) formattedError.fieldErrors.birthDate = msg;
        });
        
        throw formattedError;
      }
      
      throw error;
    }
  }
};

export default authService;