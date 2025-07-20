// File: src/components/common/QuantitySelector/QuantitySelector.jsx

import React from 'react';
import { useCart } from '../../../contexts/CartContext'; // Đường dẫn import thay đổi
import './QuantitySelector.css'; // Đảm bảo bạn đã tạo file CSS này
// Component này chỉ chịu trách nhiệm cho việc hiển thị và xử lý tăng/giảm số lượng
const QuantitySelector = ({ item, isLoading }) => {
  // Lấy hàm updateQuantity từ context
  const { updateQuantity } = useCart();

  // --- LOGIC ĐƯỢC TẬP TRUNG TẠI ĐÂY ---
  const purchaseLimit = 10;
  // Giới hạn mua thực tế là số nhỏ hơn giữa tồn kho và giới hạn chung
  const maxPurchaseQuantity = Math.min(item.stock, purchaseLimit);

  // Điều kiện để vô hiệu hóa các nút
  const isIncreaseDisabled = item.quantity >= maxPurchaseQuantity || isLoading;
  const isDecreaseDisabled = item.quantity <= 1 || isLoading;

  // Hàm xử lý khi nhấn nút
  const handleUpdate = (change) => {
    updateQuantity(item.id, change);
  };

  return (
    <div className="quantity-selector">
      <button 
        className="quantity-btn" 
        onClick={() => handleUpdate(-1)} 
        disabled={isDecreaseDisabled}
      >
        -
      </button>
      <span className="quantity-value">{item.quantity}</span>
      <button 
        className="quantity-btn" 
        onClick={() => handleUpdate(1)} 
        disabled={isIncreaseDisabled}
      >
        +
      </button>
    </div>
  );
};

export default QuantitySelector;