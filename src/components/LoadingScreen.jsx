import React from 'react';

const LoadingScreen = () => {
  // We can add keyframes directly in a style tag for self-containment,
  // though in a real project this would be in a CSS file.
  const styles = `
        @keyframes pulse-heart {
            0%, 100% {
                transform: scale(1);
                opacity: 0.8;
            }
            50% {
                transform: scale(1.05);
                opacity: 1;
            }
        }
        .animate-pulse-heart {
            animation: pulse-heart 2.5s infinite ease-in-out;
        }
    `;

  return (
    <>
      <style>{styles}</style>
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#121212] text-white antialiased">
        <div className="relative w-32 h-32">
          {/* Islamic Arch SVG */}
          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" fill="none" stroke="#34D399" strokeWidth="3">
            <path d="M 50,5 A 45,45 0 0,1 95,50 L 95,95 L 5,95 L 5,50 A 45,45 0 0,1 50,5 Z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {/* Pulsing Heart SVG */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-12 h-12 animate-pulse-heart" style={{ filter: 'drop-shadow(0 0 10px rgba(52, 211, 153, 0.5))' }}>
              <path fill="#34D399" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
        </div>
        <h1 className="text-4xl font-bold mt-6 tracking-wider" style={{ textShadow: '0 0 15px rgba(52, 211, 153, 0.3)' }}>Tazkia</h1>
        <p className="text-gray-400 mt-2 text-sm">Finding peace for your soul...</p>
      </div>
    </>
  );
};

export default LoadingScreen;
