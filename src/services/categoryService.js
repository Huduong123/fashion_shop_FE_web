import api from './api';

const categoryService = {
  // Lấy danh sách categories phân cấp (root categories với children count)
  getCategoryHierarchy: async () => {
    try {
      const response = await api.get('/users/categories/hierarchy');
      return response.data;
    } catch (error) {
      console.error('Error fetching category hierarchy:', error);
      throw error;
    }
  },

  // Lấy tất cả root categories
  getRootCategories: async () => {
    try {
      const response = await api.get('/users/categories/root');
      return response.data;
    } catch (error) {
      console.error('Error fetching root categories:', error);
      throw error;
    }
  },

  // Lấy children categories theo parent ID
  getChildrenByParentId: async (parentId) => {
    try {
      const response = await api.get(`/users/categories/${parentId}/children`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching children for parent ${parentId}:`, error);
      throw error;
    }
  },

  // Lấy category theo ID
  getCategoryById: async (categoryId) => {
    try {
      const response = await api.get(`/users/categories/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching category ${categoryId}:`, error);
      throw error;
    }
  },

  // Lấy tất cả categories với filter
  getAllCategories: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.name) params.append('name', filters.name);
      if (filters.parentId) params.append('parentId', filters.parentId);
      if (filters.isRoot !== undefined) params.append('isRoot', filters.isRoot);
      
      const response = await api.get(`/users/categories?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }
};

export default categoryService; 