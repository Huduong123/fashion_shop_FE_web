import React from 'react';
import './RainySeason.css';
// Import ảnh từ assets
import ranny1 from '../../assets/images/ranny1.png';
import ranny2 from '../../assets/images/ranny2.png';
import ranny3 from '../../assets/images/ranny3.png';

const RainySeason = () => {
  return (
    <section className="rainy-season">
      <div className="rainy-season-container">
        {/* Image 1 */}
        <div className="rainy-banner">
          <img 
            src={ranny1} 
            alt="Rainy Season Collection 1" 
            className="rainy-image"
          />
        </div>

        {/* Image 2 */}
        <div className="rainy-banner">
          <img 
            src={ranny2} 
            alt="Rainy Season Collection 2" 
            className="rainy-image"
          />
        </div>

        {/* Image 3 */}
        <div className="rainy-banner">
          <img 
            src={ranny3} 
            alt="Rainy Season Collection 3" 
            className="rainy-image"
          />
        </div>
      </div>
    </section>
  );
};

export default RainySeason; 