import React, { createContext, useContext, useState, useEffect } from 'react';

// Tạo Context Object
const CartContext = createContext();

// Tạo một custom hook để sử dụng CartContext dễ dàng hơn
export const useCart = () => {
  return useContext(CartContext);
};

// Key để lưu giỏ hàng trong localStorage
const CART_STORAGE_KEY = 'anonymous_cart';

// --- HÀM HỖ TRỢ ĐỂ LẤY GIỎ HÀNG TỪ LOCALSTORAGE ---
const getInitialCartState = () => {
  try {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    // Nếu có dữ liệu trong storage, parse nó. Nếu không, trả về mảng rỗng.
    return storedCart ? JSON.parse(storedCart) : [];
  } catch (error) {
    console.error("Lỗi khi đọc giỏ hàng từ localStorage:", error);
    // Nếu có lỗi (ví dụ: JSON không hợp lệ), trả về mảng rỗng để tránh crash app.
    return [];
  }
};


// Component Provider
export const CartProvider = ({ children }) => {
  // Khởi tạo state bằng cách gọi hàm getInitialCartState
  const [cartItems, setCartItems] = useState(getInitialCartState);
  
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Effect này sẽ chạy mỗi khi `cartItems` thay đổi để lưu vào localStorage
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (newItem) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === newItem.id);

      // Giới hạn mua hàng cho mỗi sản phẩm là 10
      const purchaseLimit = 10;

      if (existingItem) {
        // --- LOGIC KHI THÊM SẢN PHẨM ĐÃ CÓ TRONG GIỎ ---
        const maxAllowed = Math.min(existingItem.stock || purchaseLimit, purchaseLimit);
        
        if (existingItem.quantity >= maxAllowed) {
            alert("Sản phẩm trong giỏ đã đạt giới hạn mua.");
            return prevItems; // Không thay đổi gì nếu đã đạt giới hạn
        }

        const potentialQuantity = existingItem.quantity + newItem.quantity;
        const finalQuantity = Math.min(potentialQuantity, maxAllowed);

        return prevItems.map(item =>
          item.id === newItem.id
            ? { ...item, quantity: finalQuantity }
            : item
        );
      } else {
        // --- LOGIC KHI THÊM SẢN PHẨM MỚI ---
        const maxAllowed = Math.min(newItem.stock || purchaseLimit, purchaseLimit);
        const finalQuantity = Math.min(newItem.quantity, maxAllowed);
        return [...prevItems, {...newItem, quantity: finalQuantity}];
      }
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (itemIdToRemove) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemIdToRemove));
  };

  // --- LOGIC CẬP NHẬT SỐ LƯỢNG ĐÃ ĐƯỢC NÂNG CẤP ---
  const updateQuantity = (itemId, newQuantity) => {
    setCartItems(prevItems =>
      prevItems.map(item => {
        if (item.id === itemId) {
          // Xử lý việc xóa nếu số lượng <= 0
          if (newQuantity <= 0) {
            return null; // Sẽ được lọc ra ở bước tiếp theo
          }

          const purchaseLimit = 10;
          // Nếu item.stock không được cung cấp, mặc định giới hạn là 10
          const maxAllowed = Math.min(item.stock || purchaseLimit, purchaseLimit);

          if (newQuantity > maxAllowed) {
            alert(`Số lượng sản phẩm đã đạt giới hạn tối đa là ${maxAllowed}.`);
            // Giữ lại số lượng ở mức tối đa cho phép
            return { ...item, quantity: maxAllowed };
          }
          
          // Nếu hợp lệ, cập nhật số lượng mới
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(item => item !== null) // Lọc bỏ các item đã bị xóa (được set là null)
    );
  };
  
  // Tính toán tổng tiền và tổng số sản phẩm
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
    setIsCartOpen
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};