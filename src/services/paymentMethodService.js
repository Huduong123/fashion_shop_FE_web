// src/services/paymentMethodService.js

import api from './api'; // Giả sử bạn có file api.js để cấu hình axios

const paymentMethodService = {
  /**
   * Lấy danh sách tất cả các phương thức thanh toán đang hoạt động
   * @returns {Promise<Array>} - Mảng các đối tượng payment method
   */
  getPaymentMethods: async () => {
    try {
      // Endpoint này là công khai, không cần xác thực
      // Giả sử API của bạn có endpoint là /api/payment-methods
      const response = await api.get('/users/payment-methods'); 
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách phương thức thanh toán:', error.response || error);
      throw error;
    }
  },
};

export default paymentMethodService;