import React, { useState } from 'react';
import BannerSection from '../components/Banner/BannerSection';
import CategorySection from '../components/CategorySection/CategorySection';
import RainySeason from '../components/RainySeason/RainySeason';
import BestSellersSection from '../components/BestSellers/BestSellersSection';
import BlogSection from '../components/Blog/BlogSection';
import ProductModal from '../components/ProductModal';

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="home-page">
      <BannerSection />
      <CategorySection />
      <RainySeason />
      <BestSellersSection onOpenModal={handleOpenModal} />
      <BlogSection />
      
      {/* Product Modal */}
      <ProductModal 
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Home; 