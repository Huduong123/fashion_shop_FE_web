// File: src/hooks/useProductSelector.js

import { useState, useEffect, useCallback } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

export const useProductSelector = (product) => {
  // Lấy các hàm cần thiết từ Context
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  // --- TOÀN BỘ STATE LIÊN QUAN ĐẾN LỰA CHỌN SẢN PHẨM ---
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedSizeInfo, setSelectedSizeInfo] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Effect để tự động reset và chọn giá trị mặc định khi sản phẩm thay đổi
  useEffect(() => {
    if (product && product.productVariants && product.productVariants.length > 0) {
      const firstVariant = product.productVariants[0];
      setSelectedVariant(firstVariant);

      if (firstVariant.sizes && firstVariant.sizes.length > 0) {
        const firstAvailableSize = firstVariant.sizes.find(s => s.available) || firstVariant.sizes[0];
        setSelectedSizeInfo(firstAvailableSize);
      } else {
        setSelectedSizeInfo(null);
      }
      setQuantity(1); // Reset số lượng về 1
    } else {
      // Reset state nếu không có sản phẩm
      setSelectedVariant(null);
      setSelectedSizeInfo(null);
      setQuantity(1);
    }
  }, [product]); // Chạy lại mỗi khi đối tượng `product` thay đổi

  // --- TOÀN BỘ CÁC HÀM XỬ LÝ LOGIC ---

  const handleColorSelect = useCallback((variant) => {
    setSelectedVariant(variant);
    if (variant.sizes?.length > 0) {
      const firstAvailableSize = variant.sizes.find(s => s.available) || variant.sizes[0];
      setSelectedSizeInfo(firstAvailableSize);
    } else {
      setSelectedSizeInfo(null);
    }
    setQuantity(1);
  }, []);

  const handleSizeSelect = useCallback((size) => {
    setSelectedSizeInfo(size);
    setQuantity(1);
  }, []);

  const handleQuantityChange = useCallback((change) => {
    const stockQuantity = selectedSizeInfo?.quantity || 0;
    const purchaseLimit = 10;
    const maxQuantity = Math.min(stockQuantity, purchaseLimit);

    setQuantity(prevQuantity => {
      const newQuantity = prevQuantity + change;
      return Math.max(1, Math.min(newQuantity, maxQuantity));
    });
  }, [selectedSizeInfo]);

  const handleAddToCart = useCallback(() => {
    if (!product || !selectedVariant || !selectedSizeInfo || !selectedSizeInfo.available) {
      alert("Vui lòng chọn đầy đủ màu sắc, kích thước và đảm bảo sản phẩm còn hàng.");
      return false; // Trả về false nếu thất bại
    }

    const itemToAdd = {
      id: isAuthenticated ? null : `${selectedVariant.id}-${selectedSizeInfo.id}`,
      productId: product.id,
      name: product.name,
      product_variant_id: selectedVariant.id,
      size_id: selectedSizeInfo.id,
      quantity: quantity,
      color: selectedVariant.colorName,
      size: selectedSizeInfo.sizeName,
      price: selectedSizeInfo.price,
      image: selectedVariant.images?.[0]?.imageUrl || '/images/product-placeholder.jpg',
      stock: selectedSizeInfo.quantity,
    };
    
    addToCart(itemToAdd);
    alert('Đã thêm sản phẩm vào giỏ hàng!');
    return true; // Trả về true nếu thành công
  }, [product, selectedVariant, selectedSizeInfo, quantity, isAuthenticated, addToCart]);

  // --- CÁC GIÁ TRỊ TÍNH TOÁN ĐỂ SỬ DỤNG TRONG UI ---
  const stockQuantity = selectedSizeInfo?.quantity || 0;
  const maxAllowedQuantity = Math.min(stockQuantity, 10);
  const isAddToCartDisabled = !selectedSizeInfo?.available || stockQuantity === 0;

  // Trả về tất cả state, hàm, và giá trị cần thiết cho component
  return {
    selectedVariant,
    selectedSizeInfo,
    quantity,
    handleColorSelect,
    handleSizeSelect,
    handleQuantityChange,
    handleAddToCart,
    maxAllowedQuantity,
    isAddToCartDisabled,
    stockQuantity,
  };
};