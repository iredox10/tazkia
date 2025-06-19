
import React from 'react';

const Logo = () => {
  return (
    <div className="flex items-center space-x-2.5">
      <svg width="28" height="28" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 0 10px rgba(52, 211, 153, 0.4))' }}>
        <path d="M50 5C25.1472 5 5 25.1472 5 50V95H95V50C95 25.1472 74.8528 5 50 5Z" stroke="#34D399" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M50 35C40 25 25 30 25 45C25 60 50 75 50 75C50 75 75 60 75 45C75 30 60 25 50 35Z" fill="#34D399" />
      </svg>
      <span className="text-2xl font-bold text-gray-200">Tazkia</span>
    </div>
  );
};

export default Logo;
