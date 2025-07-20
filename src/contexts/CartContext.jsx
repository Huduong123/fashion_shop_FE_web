import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext'; // To check login status
import cartService from '../services/cartService'; // To make API calls

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

const CART_STORAGE_KEY = 'anonymous_cart';

// Helper to get initial state from localStorage for guests
const getGuestCartState = () => {
  try {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    return storedCart ? JSON.parse(storedCart) : [];
  } catch (error) {
    console.error("Error reading guest cart from localStorage:", error);
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth(); // Get user's login status

  // Mapper function to transform API data to the frontend's cart item structure
  const mapApiItemToFrontend = (apiItem) => ({
    id: apiItem.id, // This is the cart_item.id from the database
    product_variant_id: apiItem.productVariantId,
    name: apiItem.productName,
    color: apiItem.colorName,
    size_id: apiItem.sizeId,
    size: apiItem.sizeName,
    quantity: apiItem.quantity,
    price: apiItem.price,
    image: apiItem.imageUrl,
    stock: apiItem.stock, // Assuming the API might provide this in the future
  });

  // Function to sync the cart with the backend
  const syncCart = useCallback(async () => {
    if (isAuthenticated) {
      setIsLoading(true);
      try {
        const apiCartItems = await cartService.getCartItems();
        localStorage.removeItem(CART_STORAGE_KEY); // Clear guest cart upon login
        setCartItems(apiCartItems.map(mapApiItemToFrontend));
      } catch (error) {
        console.error("Failed to sync cart with the database:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      // If user logs out or is a guest, load from localStorage
      setCartItems(getGuestCartState());
    }
  }, [isAuthenticated]);

  // Effect to sync cart when authentication state changes (login/logout)
  useEffect(() => {
    syncCart();
  }, [syncCart]);

  // Effect to save to localStorage ONLY for guest users
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    }
  }, [cartItems, isAuthenticated]);

  // --- CART ACTIONS ---

  const addToCart = async (newItem) => {
    setIsLoading(true);
    if (isAuthenticated) {
      try {
        await cartService.addToCart(newItem);
        await syncCart(); // Re-fetch the entire cart to ensure consistency
      } catch (error) {
        alert("Lỗi khi thêm sản phẩm vào giỏ hàng. Vui lòng thử lại.");
      }
    } else {
      // Guest user logic (localStorage)
      setCartItems(prevItems => {
        const existingItem = prevItems.find(item => item.id === newItem.id);
        if (existingItem) {
          return prevItems.map(item =>
            item.id === newItem.id
              ? { ...item, quantity: item.quantity + newItem.quantity }
              : item
          );
        }
        return [...prevItems, newItem];
      });
    }
    setIsLoading(false);
    setIsCartOpen(true);
  };

  const removeFromCart = async (itemId) => {
    setIsLoading(true);
    if (isAuthenticated) {
      try {
        await cartService.removeFromCart(itemId);
        await syncCart();
      } catch (error) {
        alert("Lỗi khi xóa sản phẩm. Vui lòng thử lại.");
      }
    } else {
      // Guest user logic
      setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    }
    setIsLoading(false);
  };
  
  const updateQuantity = async (itemId, change) => {
    setIsLoading(true);
    const itemToUpdate = cartItems.find(item => item.id === itemId);
    if (!itemToUpdate) return;
    
    // Optimistic UI update for perceived speed
    const newQuantity = itemToUpdate.quantity + change;
    if (newQuantity <= 0 && !isAuthenticated) {
         setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    } else {
        setCartItems(prevItems => prevItems.map(item =>
            item.id === itemId ? { ...item, quantity: newQuantity } : item
        ));
    }

    if (isAuthenticated) {
      try {
        if (change > 0) {
          await cartService.increaseQuantity(itemId);
        } else {
          await cartService.decreaseQuantity(itemId);
        }
        await syncCart(); // Re-sync with the server for the correct state
      } catch (error) {
        alert("Lỗi khi cập nhật số lượng.");
        setCartItems(cartItems); // Revert optimistic update on error
      }
    }
    setIsLoading(false);
  };

  const totalAmount = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    totalAmount,
    totalItems,
    isCartOpen,
    setIsCartOpen,
    isLoading
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};