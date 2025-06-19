
import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import { User, Download } from 'lucide-react';

const Header = () => {
  const [greeting, setGreeting] = useState('');
  const [installPrompt, setInstallPrompt] = useState(null);

  useEffect(() => {
    const getGreeting = () => {
      const currentHour = new Date().getHours();
      if (currentHour < 12) return 'Good Morning';
      if (currentHour < 18) return 'Good Afternoon';
      return 'Good Evening';
    };
    setGreeting(getGreeting());

    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    installPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      setInstallPrompt(null);
    });
  };

  return (
    <header className="p-4 sm:p-6 flex justify-between items-center shrink-0">
      <Logo />
      <div className="flex items-center space-x-3">
        {installPrompt && (
          <button
            onClick={handleInstallClick}
            className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-black font-bold rounded-full hover:bg-green-600 transition-colors shadow-lg hover:shadow-green-500/40"
          >
            <Download className="w-5 h-5" />
            <span>Install App</span>
          </button>
        )}
        <div className="text-right hidden sm:block">
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
