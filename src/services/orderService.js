import api from './api';

const orderService = {
  /**
   * Tạo đơn hàng mới từ giỏ hàng
   * @returns {Promise<object>} - Thông tin đơn hàng đã tạo
   */
  createOrderFromCart: async () => {
    try {
      const response = await api.post('/users/orders');
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error.response || error);
      throw error;
    }
  },

  /**
   * Lấy danh sách đơn hàng của user (phân trang)
   * @param {number} page - Trang hiện tại (bắt đầu từ 0)
   * @param {number} size - Số lượng đơn hàng mỗi trang
   * @param {string} sort - Cách sắp xếp (vd: 'createdAt,desc')
   * @returns {Promise<object>} - Danh sách đơn hàng phân trang
   */
  getUserOrders: async (page = 0, size = 10, sort = 'createdAt,desc') => {
    try {
      const response = await api.get('/users/orders', {
        params: {
          page,
          size,
          sort: sort
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user orders:', error.response || error);
      throw error;
    }
  },

  /**
   * Lấy chi tiết một đơn hàng
   * @param {number} orderId - ID của đơn hàng
   * @returns {Promise<object>} - Chi tiết đơn hàng
   */
  getOrderDetails: async (orderId) => {
    try {
      const response = await api.get(`/users/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order details:', error.response || error);
      throw error;
    }
  },

  /**
   * Hủy đơn hàng
   * @param {number} orderId - ID của đơn hàng cần hủy
   * @returns {Promise<object>} - Thông báo kết quả
   */
  cancelOrder: async (orderId) => {
    try {
      const response = await api.post(`/users/orders/${orderId}/cancel`);
      return response.data;
    } catch (error) {
      console.error('Error cancelling order:', error.response || error);
      throw error;
    }
  }
};

export default orderService;
