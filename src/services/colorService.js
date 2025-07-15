import api from './api';

// Ánh xạ tên màu sang mã hex, giữ ở đây vì nó là logic của màu sắc
const COLOR_NAME_MAPPING = {
  'Đen': '#000000',
  'Trắng': '#FFFFFF',
  'Xanh Navy': '#000080',
  'Xanh': '#0000FF',
  'Xanh dương': '#87CEEB',
  'Xanh lá': '#90EE90',
  'Đỏ': '#FF0000',
  'Vàng': '#FFFF00',
  'Hồng': '#FFC0CB',
  'Tím': '#800080',
  'Cam': '#FFA500',
  'Nâu': '#A52A2A',
  'Xám': '#808080',
  'Be': '#F5F5DC',
  'Kem': '#FFFDD0',
  'Black': '#000000',
  'White': '#FFFFFF',
  'Red': '#FF0000',
  'Blue': '#0000FF',
  'Green': '#008000',
  'Yellow': '#FFFF00',
  'Purple': '#800080',
  'Orange': '#FFA500',
  'Pink': '#FFC0CB',
  'Brown': '#A52A2A',
  'Gray': '#808080',
  'Grey': '#808080',
  'Navy': '#000080',
  'Beige': '#F5F5DC'
};

const colorService = {
  /**
   * Lấy tất cả màu sắc từ API.
   */
  getAllColors: async () => {
    try {
      const response = await api.get('/users/colors');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Lỗi khi lấy danh sách màu sắc:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể lấy danh sách màu sắc'
      };
    }
  },

  /**
   * Chuyển đổi tên màu sang mã hex.
   * @param {string} colorName Tên của màu.
   * @returns {string} Mã hex của màu.
   */
  getColorHexCode: (colorName) => {
    if (!colorName) return '#CCCCCC'; // Màu xám mặc định

    // Tìm kiếm chính xác
    const exactMatch = COLOR_NAME_MAPPING[colorName];
    if (exactMatch) return exactMatch;

    // Tìm kiếm không phân biệt hoa thường
    const normalizedColorName = colorName.toLowerCase();
    for (const [name, hex] of Object.entries(COLOR_NAME_MAPPING)) {
      if (name.toLowerCase() === normalizedColorName) {
        return hex;
      }
    }

    // Tìm kiếm tương đối
    for (const [name, hex] of Object.entries(COLOR_NAME_MAPPING)) {
      if (normalizedColorName.includes(name.toLowerCase()) || name.toLowerCase().includes(normalizedColorName)) {
        return hex;
      }
    }

    return '#CCCCCC'; // Trả về mặc định nếu không tìm thấy
  },
};

export default colorService;