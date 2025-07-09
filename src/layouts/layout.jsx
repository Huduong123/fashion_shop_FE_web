import React from 'react';
import Header from '../components/Header';
import Banner from '../components/Banner';
import CategorySection from '../components/CategorySection';
import RainySeason from '../components/RainySeason';
import BestSellers from '../components/BestSellers';
import Blog from '../components/Blog';
import Footer from '../components/Footer';
import './layout.css';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Header />
      <Banner />
      <CategorySection />
      <RainySeason />
      <BestSellers />
      <Blog />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
