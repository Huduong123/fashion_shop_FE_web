import React from 'react';
import './CategorySection.css';

const CategorySection = () => {
  const categories = [
    {
      id: 1,
      name: 'NEW ARRIVAL',
      label: 'NEW ARRIVAL',
      icon: (
        <div className="category-icon new-arrival">
          <div className="new-badge">NEW</div>
        </div>
      )
    },
    {
      id: 2,
      name: 'ÁO',
      label: 'ÁO',
      icon: (
        <svg className="category-svg" viewBox="0 0 64 64" fill="none">
          <path d="M16 20L16 52C16 54.2091 17.7909 56 20 56L44 56C46.2091 56 48 54.2091 48 52L48 20M16 20L20 12C20 9.79086 21.7909 8 24 8L40 8C42.2091 8 44 9.79086 44 12L48 20M16 20L48 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M24 20V28" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M40 20V28" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    },
    {
      id: 3,
      name: 'QUẦN',
      label: 'QUẦN',
      icon: (
        <svg className="category-svg" viewBox="0 0 64 64" fill="none">
          <path d="M20 8H44V24L40 56H32L28 32L24 56H16L20 24V8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M20 8V4C20 2.89543 20.8954 2 22 2H42C43.1046 2 44 2.89543 44 4V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      id: 4,
      name: 'ÁO THUN',
      label: 'ÁO THUN',
      icon: (
        <svg className="category-svg" viewBox="0 0 64 64" fill="none">
          <path d="M16 20V56C16 58.2091 17.7909 60 20 60H44C46.2091 60 48 58.2091 48 56V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 20L20 12C20 9.79086 21.7909 8 24 8H40C42.2091 8 44 9.79086 44 12L48 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 20H48" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M26 4V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M38 4V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    },
    {
      id: 5,
      name: 'ÁO KHOÁC',
      label: 'ÁO KHOÁC',
      icon: (
        <svg className="category-svg" viewBox="0 0 64 64" fill="none">
          <path d="M12 22V58C12 60.2091 13.7909 62 16 62H48C50.2091 62 52 60.2091 52 58V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 22L18 14C18 11.7909 19.7909 10 22 10H42C44.2091 10 46 11.7909 46 14L52 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M20 4V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M44 4V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M32 22V40" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="24" cy="32" r="2" fill="currentColor"/>
          <circle cx="24" cy="40" r="2" fill="currentColor"/>
        </svg>
      )
    },
    {
      id: 6,
      name: 'PHỤ KIỆN',
      label: 'PHỤ KIỆN',
      icon: (
        <svg className="category-svg" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="20" r="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M20 36C20 36 20 44 32 44C44 44 44 36 44 36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M32 4V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M48 20H56" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M8 20H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    },
    {
      id: 7,
      name: 'ÁO POLO',
      label: 'ÁO POLO',
      icon: (
        <svg className="category-svg" viewBox="0 0 64 64" fill="none">
          <path d="M16 20V56C16 58.2091 17.7909 60 20 60H44C46.2091 60 48 58.2091 48 56V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 20L20 12C20 9.79086 21.7909 8 24 8H40C42.2091 8 44 9.79086 44 12L48 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M28 8V16L32 20L36 16V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="26" cy="28" r="1.5" fill="currentColor"/>
          <circle cx="26" cy="34" r="1.5" fill="currentColor"/>
        </svg>
      )
    },
    {
      id: 8,
      name: 'ÁO SƠ MI',
      label: 'ÁO SƠ MI',
      icon: (
        <svg className="category-svg" viewBox="0 0 64 64" fill="none">
          <path d="M16 20V58C16 60.2091 17.7909 62 20 62H44C46.2091 62 48 60.2091 48 58V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 20L20 12C20 9.79086 21.7909 8 24 8H40C42.2091 8 44 9.79086 44 12L48 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M24 8V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M40 8V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M32 20V38" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="28" cy="26" r="1.5" fill="currentColor"/>
          <circle cx="28" cy="32" r="1.5" fill="currentColor"/>
          <circle cx="28" cy="38" r="1.5" fill="currentColor"/>
        </svg>
      )
    }
  ];

  return (
    <section className="category-section">
      <div className="category-container">
        {categories.map((category) => (
          <div key={category.id} className="category-item">
            <div className="category-icon-wrapper">
              {category.icon}
            </div>
            <span className="category-label">{category.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategorySection; 