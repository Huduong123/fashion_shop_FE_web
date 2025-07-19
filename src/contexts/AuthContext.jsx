import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Check if user is logged in when app starts
  useEffect(() => {
    const savedUserJSON = localStorage.getItem('user');
    const savedAuth = localStorage.getItem('isAuthenticated');
    
    // ĐÃ THAY ĐỔI: Thêm điều kiện kiểm tra chặt chẽ hơn
    if (savedUserJSON && savedUserJSON !== 'undefined' && savedAuth === 'true') {
      try {
        const savedUser = JSON.parse(savedUserJSON);
        setUser(savedUser);
        setIsAuthenticated(true);
      } catch (error) {
        // Nếu parse lỗi (dữ liệu hỏng), hãy dọn dẹp localStorage
        console.error("Failed to parse user from localStorage:", error);
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
      }
    }
  }, []);

  const login = (userData) => {
    // ĐÃ THAY ĐỔI: Thêm kiểm tra để không bao giờ lưu 'undefined'
    if (userData) {
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('isAuthenticated', 'true');
    } else {
      console.error("AuthContext: login function called with invalid data.");
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('accessToken'); // Thêm dòng này để chắc chắn xóa cả token
  };

  const value = {
    isAuthenticated,
    user,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};