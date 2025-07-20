import api from './api';

const cartService = {
  /**
   * API 1: Get all items in the user's cart from the backend.
   */
  getCartItems: async () => {
    try {
      const response = await api.get('/users/cart');
      return response.data;
    } catch (error) {
      console.error('Error fetching cart items:', error.response || error);
      throw error;
    }
  },

  /**
   * API 2: Add a product to the cart.
   * @param {object} productData - Contains product_variant_id, size_id, quantity.
   */
  addToCart: async (productData) => {
    // Backend expects { productVariantId, sizeId, quantity }
    const payload = {
      productVariantId: productData.product_variant_id,
      sizeId: productData.size_id,
      quantity: productData.quantity,
    };
    try {
      const response = await api.post('/users/cart', payload);
      return response.data;
    } catch (error) {
      console.error('Error adding to cart:', error.response || error);
      throw error;
    }
  },

  /**
   * API 3: Increase item quantity by 1.
   * @param {number} cartItemId - The ID of the cart_item in the database.
   */
  increaseQuantity: async (cartItemId) => {
    try {
      const response = await api.put(`/users/cart/${cartItemId}/increase`);
      return response.data;
    } catch (error) {
      console.error('Error increasing quantity:', error.response || error);
      throw error;
    }
  },

  /**
   * API 4: Decrease item quantity by 1.
   * @param {number} cartItemId - The ID of the cart_item in the database.
   */
  decreaseQuantity: async (cartItemId) => {
    try {
      const response = await api.put(`/users/cart/${cartItemId}/decrease`);
      return response.data;
    } catch (error) {
      console.error('Error decreasing quantity:', error.response || error);
      throw error;
    }
  },

  /**
   * API 5: Remove an item completely from the cart.
   * @param {number} cartItemId - The ID of the cart_item in the database.
   */
  removeFromCart: async (cartItemId) => {
    try {
      const response = await api.delete(`/users/cart/${cartItemId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing from cart:', error.response || error);
      throw error;
    }
  },

  /**
   * API 6: Clear the entire cart for the logged-in user.
   */
  clearCart: async () => {
    try {
      const response = await api.delete('/users/cart');
      return response.data;
    } catch (error) {
      console.error('Error clearing cart:', error.response || error);
      throw error;
    }
  },
};

export default cartService;