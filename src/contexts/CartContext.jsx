import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import cartService from '../services/cartService';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

const CART_STORAGE_KEY = 'anonymous_cart';

// Helper để đọc giỏ hàng của khách từ localStorage
const getGuestCartState = () => {
  try {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    return storedCart ? JSON.parse(storedCart) : [];
  } catch (error) {
    console.error("Lỗi khi đọc giỏ hàng của khách từ localStorage:", error);
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth(); // Lấy trạng thái đăng nhập

  // Hàm chuyển đổi dữ liệu từ API sang cấu trúc của frontend
  const mapApiItemToFrontend = (apiItem) => ({
    id: apiItem.id,
    productId: apiItem.productId,
    product_variant_id: apiItem.productVariantId,
    name: apiItem.productName,
    color: apiItem.colorName,
    size_id: apiItem.sizeId,
    size: apiItem.sizeName,
    quantity: apiItem.quantity,
    price: apiItem.price,
    image: apiItem.imageUrl,
    stock: apiItem.stock,
  });

  // --- HÀM ĐỒNG BỘ GIỎ HÀNG ĐÃ ĐƯỢC VIẾT LẠI ---
  // Hàm này giờ đây xử lý cả việc hợp nhất giỏ hàng của khách khi đăng nhập
  const syncCart = useCallback(async () => {
    setIsLoading(true);
    try {
      if (isAuthenticated) {
        // BƯỚC 1: KIỂM TRA GIỎ HÀNG CỦA KHÁCH TRONG LOCALSTORAGE
        const guestCart = getGuestCartState();

        if (guestCart.length > 0) {
          console.log("Phát hiện giỏ hàng của khách, bắt đầu đồng bộ...");
          // BƯỚC 2: GỬI GIỎ HÀNG CỦA KHÁCH LÊN SERVER ĐỂ HỢP NHẤT
          await cartService.syncLocalCart(guestCart);
          // BƯỚC 3: XÓA GIỎ HÀNG CỦA KHÁCH SAU KHI ĐỒNG BỘ THÀNH CÔNG
          localStorage.removeItem(CART_STORAGE_KEY);
          console.log("Đồng bộ thành công, đã xóa giỏ hàng local.");
        }

        // BƯỚC 4: TẢI GIỎ HÀNG CUỐI CÙNG (ĐÃ ĐƯỢC HỢP NHẤT) TỪ SERVER
        const apiCartItems = await cartService.getCartItems();
        setCartItems(apiCartItems.map(mapApiItemToFrontend));

      } else {
        // Nếu không đăng nhập, chỉ cần tải từ localStorage
        setCartItems(getGuestCartState());
      }
    } catch (error) {
      console.error("Lỗi nghiêm trọng trong quá trình đồng bộ giỏ hàng:", error);
      // Có thể thêm logic để xử lý lỗi, ví dụ: hiển thị thông báo cho người dùng
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]); // Phụ thuộc vào trạng thái đăng nhập

  // Effect này sẽ tự động chạy khi `isAuthenticated` thay đổi (khi người dùng đăng nhập hoặc đăng xuất)
  useEffect(() => {
    syncCart();
  }, [syncCart]);

  // Effect này chỉ lưu giỏ hàng vào localStorage KHI NGƯỜI DÙNG LÀ KHÁCH
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    }
  }, [cartItems, isAuthenticated]);

  // --- CÁC HÀM XỬ LÝ GIỎ HÀNG (GIỮ NGUYÊN) ---

  const addToCart = async (newItem) => {
    setIsLoading(true);
    if (isAuthenticated) {
      try {
        await cartService.addToCart(newItem);
        await syncCart(); // Tải lại toàn bộ giỏ hàng để đảm bảo nhất quán
      } catch (error) {
        // Hiển thị thông báo lỗi từ backend nếu có
        const errorMessage = error.response?.data?.message || "Lỗi khi thêm sản phẩm vào giỏ hàng. Vui lòng thử lại.";
        alert(errorMessage);
        throw error; // Ném lại lỗi để component có thể xử lý
      }
    } else {
      // Logic cho khách (localStorage)
      setCartItems(prevItems => {
        const existingItem = prevItems.find(item => 
          item.product_variant_id === newItem.product_variant_id && 
          item.size_id === newItem.size_id
        );
        if (existingItem) {
          return prevItems.map(item =>
            (item.product_variant_id === newItem.product_variant_id && item.size_id === newItem.size_id)
              ? { ...item, quantity: item.quantity + newItem.quantity }
              : item
          );
        }
        // Tạo ID tạm thời cho khách nếu chưa có
        const itemWithId = { ...newItem, id: newItem.id || `${newItem.product_variant_id}-${newItem.size_id}` };
        return [...prevItems, itemWithId];
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
      // Logic cho khách
      setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    }
    setIsLoading(false);
  };
  
  const updateQuantity = async (itemId, change) => {
    setIsLoading(true);
    const itemToUpdate = cartItems.find(item => item.id === itemId);
    if (!itemToUpdate) {
        setIsLoading(false);
        return;
    }
    
    const newQuantity = itemToUpdate.quantity + change;

    if (isAuthenticated) {
      // Logic cho người dùng đã đăng nhập
      try {
        if (change > 0) {
          await cartService.increaseQuantity(itemId);
        } else {
          await cartService.decreaseQuantity(itemId);
        }
        await syncCart(); // Đồng bộ lại để lấy trạng thái chính xác nhất từ server
      } catch (error) {
        alert("Lỗi khi cập nhật số lượng.");
        // Không cần revert vì syncCart() sẽ tự lấy lại trạng thái đúng
      }
    } else {
      // Logic cho khách (localStorage)
      if (newQuantity <= 0) {
        setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
      } else {
        setCartItems(prevItems => prevItems.map(item =>
            item.id === itemId ? { ...item, quantity: newQuantity } : item
        ));
      }
    }
    setIsLoading(false);
  };

  // --- CÁC GIÁ TRỊ TÍNH TOÁN ---
  const totalAmount = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  // --- GIÁ TRỊ CUNG CẤP BỞI CONTEXT ---
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