import api from './api';

// Color mapping for Vietnamese color names to hex codes
const COLOR_NAME_MAPPING = {
  // Vietnamese color names from backend
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
  
  // English color names (fallback)
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

const productService = {
  // Get all visible products with optional filters and pagination
  getAllVisibleProducts: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      // Add search parameters if they exist and are not empty
      if (filters.name && filters.name.trim()) {
        params.append('name', filters.name.trim());
      }
      if (filters.minPrice && filters.minPrice > 0) {
        params.append('minPrice', filters.minPrice);
      }
      if (filters.maxPrice && filters.maxPrice > 0) {
        params.append('maxPrice', filters.maxPrice);
      }
      if (filters.categoryId && filters.categoryId > 0) {
        params.append('categoryId', filters.categoryId);
      }
      
      // Pagination parameters
      if (filters.page !== undefined) {
        params.append('page', filters.page);
      }
      if (filters.size !== undefined) {
        params.append('size', filters.size);
      }
      
      // Sorting parameters
      if (filters.sort && Array.isArray(filters.sort)) {
        filters.sort.forEach(sortParam => {
          params.append('sort', sortParam);
        });
      }
      
      const response = await api.get(`/users/products?${params.toString()}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching visible products:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch products'
      };
    }
  },

  // Get visible products by category with pagination
  getVisibleProductsByCategory: async (categoryId, filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      // Pagination parameters
      if (filters.page !== undefined) {
        params.append('page', filters.page);
      }
      if (filters.size !== undefined) {
        params.append('size', filters.size);
      }
      
      // Sorting parameters
      if (filters.sort && Array.isArray(filters.sort)) {
        filters.sort.forEach(sortParam => {
          params.append('sort', sortParam);
        });
      }
      
      const response = await api.get(`/users/products/category/${categoryId}?${params.toString()}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error(`Error fetching products for category ${categoryId}:`, error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch products for category'
      };
    }
  },

  // Get single product by ID
  getProductById: async (productId) => {
    try {
      const response = await api.get(`/users/products/${productId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error(`Error fetching product ${productId}:`, error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch product'
      };
    }
  },

  // Map color name to hex value
  getColorHexCode: (colorName) => {
    if (!colorName) return '#CCCCCC'; // Default gray
    
    // Try exact match first
    const exactMatch = COLOR_NAME_MAPPING[colorName];
    if (exactMatch) return exactMatch;
    
    // Try case-insensitive match
    const normalizedColorName = colorName.toLowerCase();
    for (const [name, hex] of Object.entries(COLOR_NAME_MAPPING)) {
      if (name.toLowerCase() === normalizedColorName) {
        return hex;
      }
    }
    
    // Try partial match for compound color names
    for (const [name, hex] of Object.entries(COLOR_NAME_MAPPING)) {
      if (normalizedColorName.includes(name.toLowerCase()) || name.toLowerCase().includes(normalizedColorName)) {
        return hex;
      }
    }
    
    // Default fallback
    return '#CCCCCC';
  },

  // Transform backend product data to frontend format
  transformProductData: (backendProduct) => {
    if (!backendProduct) return null;

    // Find the primary image or first available image
    const getPrimaryImage = (variants) => {
      for (const variant of variants) {
        if (variant.images && variant.images.length > 0) {
          const primaryImage = variant.images.find(img => img.isPrimary);
          if (primaryImage) return primaryImage.imageUrl;
          return variant.images[0].imageUrl;
        }
        // Fallback to imageUrl field for backward compatibility
        if (variant.imageUrl) return variant.imageUrl;
      }
      return '/images/product-placeholder.jpg'; // Default placeholder
    };

    // Get available colors from variants
    const getAvailableColors = (variants) => {
      const colorMap = new Map();
      
      variants
        .filter(variant => variant.available && variant.colorName)
        .forEach(variant => {
          if (!colorMap.has(variant.colorId)) {
            colorMap.set(variant.colorId, {
              id: variant.colorId,
              name: variant.colorName,
              value: productService.getColorHexCode(variant.colorName)
            });
          }
        });
      
      return Array.from(colorMap.values());
    };

    // Get available sizes from all variants
    const getAvailableSizes = (variants) => {
      const sizes = new Set();
      variants.forEach(variant => {
        if (variant.sizes && variant.available) {
          variant.sizes
            .filter(size => size.available)
            .forEach(size => sizes.add(size.sizeName));
        }
      });
      return Array.from(sizes).sort(); // Sort sizes
    };

    // Get price range
    const getPriceRange = (variants) => {
      let minPrice = Infinity;
      let maxPrice = 0;
      
      variants
        .filter(variant => variant.available)
        .forEach(variant => {
          if (variant.minPrice !== null && variant.minPrice !== undefined) {
            if (variant.minPrice < minPrice) {
              minPrice = variant.minPrice;
            }
          }
          if (variant.maxPrice !== null && variant.maxPrice !== undefined) {
            if (variant.maxPrice > maxPrice) {
              maxPrice = variant.maxPrice;
            }
          }
        });
      
      // Fallback: if no min/max prices from variants, check individual size prices
      if (minPrice === Infinity) {
        variants.forEach(variant => {
          if (variant.sizes) {
            variant.sizes
              .filter(size => size.available && size.price)
              .forEach(size => {
                if (size.price < minPrice) minPrice = size.price;
                if (size.price > maxPrice) maxPrice = size.price;
              });
          }
        });
      }
      
      return {
        min: minPrice === Infinity ? 0 : minPrice,
        max: maxPrice || (minPrice === Infinity ? 0 : minPrice)
      };
    };

    const priceRange = getPriceRange(backendProduct.productVariants || []);
    
    return {
      id: backendProduct.id,
      name: backendProduct.name,
      description: backendProduct.description,
      price: priceRange.min,
      originalPrice: priceRange.max !== priceRange.min ? priceRange.max : null,
      discount: null, // Could be calculated if needed
      image: getPrimaryImage(backendProduct.productVariants || []),
      category: backendProduct.categoryName,
      categoryId: backendProduct.categoryId,
      colors: getAvailableColors(backendProduct.productVariants || []),
      sizes: getAvailableSizes(backendProduct.productVariants || []),
      enabled: backendProduct.enabled,
      createdAt: backendProduct.createdAt,
      updatedAt: backendProduct.updatedAt,
      // Keep original data for detailed view
      originalData: backendProduct
    };
  }
};

export default productService; 