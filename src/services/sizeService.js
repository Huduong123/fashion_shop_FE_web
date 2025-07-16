import api from './api';

const sizeService = {
  /**
   * Lấy tất cả các size từ API.
   * Dựa trên endpoint được định nghĩa trong UserSizeController.java
   */
  getAllSizes: async () => {
    try {
      // Gọi đến endpoint GET /api/users/sizes
      const response = await api.get('/users/sizes');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Lỗi khi lấy danh sách size:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể lấy danh sách size'
      };
    }
  },
};

export default sizeService;