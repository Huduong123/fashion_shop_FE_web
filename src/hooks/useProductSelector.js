// File: src/hooks/useProductSelector.js

import { useState, useEffect, useCallback } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

export const useProductSelector = (product) => {
  // Lấy các hàm cần thiết từ Context
  const { addToCart, cartItems } = useCart();
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

  // --- HÀM TÍNH TOÁN SỐ LƯỢNG HIỆN TẠI TRONG GIỎ HÀNG ---
  const getCartQuantityForVariantSize = useCallback((variantId, sizeId) => {
    if (!cartItems || !variantId || !sizeId) return 0;
    
    const existingItem = cartItems.find(item => 
      item.product_variant_id === variantId && 
      item.size_id === sizeId
    );
    
    return existingItem ? existingItem.quantity : 0;
  }, [cartItems]);

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
    const currentCartQuantity = getCartQuantityForVariantSize(selectedVariant?.id, selectedSizeInfo?.id);
    
    // Tính toán số lượng tối đa có thể thêm
    const maxQuantityFromStock = stockQuantity;
    const maxQuantityFromLimit = purchaseLimit - currentCartQuantity;
    const maxQuantity = Math.min(maxQuantityFromStock, Math.max(1, maxQuantityFromLimit));

    setQuantity(prevQuantity => {
      const newQuantity = prevQuantity + change;
      return Math.max(1, Math.min(newQuantity, maxQuantity));
    });
  }, [selectedSizeInfo, selectedVariant, getCartQuantityForVariantSize]);

  const handleAddToCart = useCallback(async () => {
    if (!product || !selectedVariant || !selectedSizeInfo || !selectedSizeInfo.available) {
      alert("Vui lòng chọn đầy đủ màu sắc, kích thước và đảm bảo sản phẩm còn hàng.");
      return false; // Trả về false nếu thất bại
    }

    const currentCartQuantity = getCartQuantityForVariantSize(selectedVariant.id, selectedSizeInfo.id);
    const purchaseLimit = 10;
    
    // Kiểm tra xem việc thêm có vượt quá giới hạn không
    if (currentCartQuantity + quantity > purchaseLimit) {
      const remainingAllowed = purchaseLimit - currentCartQuantity;
      if (remainingAllowed <= 0) {
        alert(`Bạn đã có ${currentCartQuantity} sản phẩm này trong giỏ hàng. Giới hạn tối đa là ${purchaseLimit} sản phẩm.`);
      } else {
        alert(`Bạn chỉ có thể thêm tối đa ${remainingAllowed} sản phẩm nữa. Hiện tại trong giỏ hàng đã có ${currentCartQuantity} sản phẩm.`);
      }
      return false;
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
    
    try {
      await addToCart(itemToAdd);
      alert('Đã thêm sản phẩm vào giỏ hàng!');
      return true; // Trả về true nếu thành công
    } catch (error) {
      // Lỗi đã được xử lý trong CartContext, không cần alert thêm
      return false;
    }
  }, [product, selectedVariant, selectedSizeInfo, quantity, isAuthenticated, addToCart, getCartQuantityForVariantSize]);

  // --- CÁC GIÁ TRỊ TÍNH TOÁN ĐỂ SỬ DỤNG TRONG UI ---
  const stockQuantity = selectedSizeInfo?.quantity || 0;
  const currentCartQuantity = getCartQuantityForVariantSize(selectedVariant?.id, selectedSizeInfo?.id);
  const purchaseLimit = 10;
  const maxQuantityFromStock = stockQuantity;
  const maxQuantityFromLimit = purchaseLimit - currentCartQuantity;
  const maxAllowedQuantity = Math.min(maxQuantityFromStock, Math.max(1, maxQuantityFromLimit));
  const isAddToCartDisabled = !selectedSizeInfo?.available || stockQuantity === 0 || currentCartQuantity >= purchaseLimit;

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
    currentCartQuantity,
    purchaseLimit,
  };
};