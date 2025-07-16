import { useState, useEffect } from 'react';

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Cập nhật giá trị debounced sau một khoảng thời gian delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Hủy bỏ timeout nếu value thay đổi (tránh cập nhật giá trị cũ)
    // hoặc nếu component unmount
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Chỉ chạy lại effect nếu value hoặc delay thay đổi

  return debouncedValue;
}

export default useDebounce;