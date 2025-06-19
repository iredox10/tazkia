
import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import { User } from 'lucide-react';

const Header = () => {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const getGreeting = () => {
      const currentHour = new Date().getHours();
      if (currentHour < 12) {
        return 'Good Morning';
      } else if (currentHour < 18) {
        return 'Good Afternoon';
      } else {
        return 'Good Evening';
      }
    };
    setGreeting(getGreeting());
  }, []);

  return (
    <header className="p-4 sm:p-6 flex justify-between items-center shrink-0">
      <Logo />
      <div className="flex items-center space-x-3">
        <div className="text-right">
          <p className="text-sm font-medium text-gray-300">{greeting}</p>
          <p className="text-xs text-gray-500">Peace for your soul</p>
        </div>
        <div className="p-2.5 bg-[#1E1E1E] rounded-full border border-gray-700">
          <User className="w-5 h-5 text-gray-400" />
        </div>
      </div>
    </header>
  );
};

export default Header;
