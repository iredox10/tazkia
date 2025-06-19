
import React, { useState, useEffect } from 'react';
import { auth, onAuthStateChanged, signInAnonymously, signInWithCustomToken } from './config/firebase';
import HomePage from './pages/HomePage';
import StatsPage from './pages/StatsPage';
import Navbar from './components/Navbar';

function App() {
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        try {
          // This logic is for the platform; for local dev, signInAnonymously() is enough
          const token = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
          if (token) {
            await signInWithCustomToken(auth, token);
          } else {
            await signInAnonymously(auth);
          }
        } catch (error) {
          console.error("Authentication Error:", error);
        }
      }
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  if (!isAuthReady || !userId) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#121212]">
        <div className="text-lg font-semibold text-gray-300">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-gray-200 font-sans flex flex-col">
      <header className="p-4 sm:p-6 flex justify-between items-center shrink-0">
        <h1 className="text-xl font-bold text-gray-300">Tazkia</h1>
        <p className="text-sm text-gray-400">Peace for your soul</p>
      </header>

      <main className="flex-grow p-4 sm:p-6 pt-0">
        <div className="max-w-2xl mx-auto">
          {currentPage === 'home' && <HomePage userId={userId} />}
          {currentPage === 'stats' && <StatsPage userId={userId} />}
        </div>
      </main>

      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </div>
  );
}

export default App;
