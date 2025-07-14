import api from './api';

const categoryService = {
  // Cache for categories to avoid repeated API calls
  _categoriesCache: null,
  _slugToIdCache: null,
  _idToSlugCache: null,
  _cacheTimestamp: null,
  _cacheExpiryTime: 5 * 60 * 1000, // 5 minutes

  // Check if cache is valid
  _isCacheValid() {
    return this._categoriesCache && 
           this._cacheTimestamp && 
           (Date.now() - this._cacheTimestamp < this._cacheExpiryTime);
  },

  // Get all categories and cache them
  async _getCachedCategories() {
    if (this._isCacheValid()) {
      return this._categoriesCache;
    }

    try {
      const response = await api.get('/users/categories');
      this._categoriesCache = response.data;
      this._cacheTimestamp = Date.now();
      // Build slug cache when categories are fetched
      this._buildSlugCache(this._categoriesCache);
      return this._categoriesCache;
    } catch (error) {
      console.error('Error caching categories:', error);
      throw error;
    }
  },

  // Build slug to ID and ID to slug mapping caches
  _buildSlugCache(categories) {
    this._slugToIdCache = new Map();
    this._idToSlugCache = new Map();
    
    const processCategory = (category) => {
      if (category.slug) {
        this._slugToIdCache.set(category.slug, category.id);
        this._idToSlugCache.set(category.id, category.slug);
      }
      
      // Process children if they exist
      if (category.children && category.children.length > 0) {
        category.children.forEach(processCategory);
      }
    };
    
    categories.forEach(processCategory);
  },

  // Get category ID by slug
  async getCategoryIdBySlug(slug) {
    try {
      if (!slug || slug === 'all') {
        return null;
      }

      // Ensure cache is built
      await this._getCachedCategories();
      
      return this._slugToIdCache?.get(slug) || null;
    } catch (error) {
      console.error('Error getting category ID by slug:', error);
      return null;
    }
  },

  // Get slug by category ID
  async getSlugByCategoryId(categoryId) {
    try {
      if (!categoryId) {
        return 'all';
      }

      // Ensure cache is built
      await this._getCachedCategories();
      
      return this._idToSlugCache?.get(categoryId) || 'all';
    } catch (error) {
      console.error('Error getting slug by category ID:', error);
      return 'all';
    }
  },

  // Get category by slug (using new API endpoint)
  async getCategoryBySlug(slug) {
    try {
      if (!slug || slug === 'all') {
        return null;
      }

      const response = await api.get(`/users/categories/slug/${slug}`);
      return response.data;
    } catch (error) {
      console.error('Error getting category by slug:', error);
      return null;
    }
  },

  // Convert category name to URL-friendly format (deprecated - use slug instead)
  categoryNameToUrl: (categoryName) => {
    if (!categoryName) return 'all';
    
    // Fallback: convert to URL-friendly format
    return categoryName
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[áàãạăâ]/g, 'a')
      .replace(/[éèẽẹê]/g, 'e')
      .replace(/[íìĩị]/g, 'i')
      .replace(/[óòõọôơ]/g, 'o')
      .replace(/[úùũụưu]/g, 'u')
      .replace(/[ýỳỹỵy]/g, 'y')
      .replace(/đ/g, 'd');
  },

  // Get category ID by URL-friendly name (now using slug)
  getCategoryIdByUrlName: async (urlName) => {
    // Delegate to the new slug-based method
    return await categoryService.getCategoryIdBySlug(urlName);
  },

  // Get URL-friendly name by category ID (now using slug)
  getUrlNameByCategoryId: async (categoryId) => {
    // Delegate to the new slug-based method
    return await categoryService.getSlugByCategoryId(categoryId);
  },

  // Get category display name by slug
  getCategoryDisplayName: async (slug) => {
    try {
      if (!slug || slug === 'all') {
        return 'Tất cả sản phẩm';
      }
      
      const category = await categoryService.getCategoryBySlug(slug);
      return category?.name || 'Sản phẩm';
    } catch (error) {
      console.error('Error getting category display name:', error);
      return 'Sản phẩm';
    }
  },

  // Generate URL for category navigation
  generateCategoryUrl: async (category) => {
    try {
      const slug = category.slug || await categoryService.getSlugByCategoryId(category.id);
      return `/products?category=${slug}`;
    } catch (error) {
      console.error('Error generating category URL:', error);
      return '/products';
    }
  },

  // Clear categories cache (useful for testing or when categories change)
  clearCache: () => {
    categoryService._categoriesCache = null;
    categoryService._cacheTimestamp = null;
    categoryService._slugToIdCache = null;
    categoryService._idToSlugCache = null;
  },

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