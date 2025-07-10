import React from 'react';
import Header from '../components/Header';
import BannerSection from '../components/Banner';
import CategorySection from '../components/CategorySection';
import RainySeason from '../components/RainySeason';
import BestSellersSection from '../components/BestSellers';
import BlogSection from '../components/Blog';
import Footer from '../components/Footer';
import './layout.css';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Header />

      <main className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
