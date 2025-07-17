import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CartModal from '../components/CartModal'; // BƯỚC 2: IMPORT CART MODAL
import { useCart } from '../contexts/CartContext'; // BƯỚC 2: IMPORT useCart
import './layout.css';

const Layout = ({ children }) => {
  // BƯỚC 2: Lấy trạng thái và hàm điều khiển modal từ context
  const { isCartOpen, setIsCartOpen } = useCart();

  return (
    <div className="layout">
      <Header />

      <main className="main-content">
        {children}
      </main>
      
      <Footer />

      {/* BƯỚC 2: Render CartModal ở đây, điều khiển bởi context */}
      <CartModal 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </div>
  );
};

export default Layout;