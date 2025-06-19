import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { auth, onAuthStateChanged, signInAnonymously, signInWithCustomToken, db, appId, doc, setDoc, getDoc, Timestamp } from './config/firebase';
import HomePage from './pages/HomePage';
import StatsPage from './pages/StatsPage';
import TodayPage from './pages/TodayPage'; // Import the new page
import Navbar from './components/Navbar';

function App() {
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');

  const [activeZikr, setActiveZikr] = useState(null);
  const [inputValue, setInputValue] = useState('');

  const zikrCollectionPath = useMemo(() => userId ? `/artifacts/${appId}/users/${userId}/zikr-history` : null, [userId]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        try {
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

  const loadZikrData = useCallback(async (zikrName) => {
    if (!zikrCollectionPath) return;
    const docId = `${zikrName}-${new Date().toISOString().split('T')[0]}`;
    const docRef = doc(db, zikrCollectionPath, docId);
    const docSnap = await getDoc(docRef);

    let zikrData;
    if (docSnap.exists()) {
      const data = docSnap.data();
      zikrData = {
        name: data.name,
        count: data.count || 0,
        target: data.target || 100,
        deadline: data.deadline ? new Date(data.deadline.seconds * 1000).toISOString().substring(0, 16) : '',
        reminderInterval: data.reminderInterval || 0,
      };
    } else {
      zikrData = { name: zikrName, count: 0, target: 100, deadline: '', reminderInterval: 0 };
    }
    setActiveZikr(zikrData);
    setInputValue(zikrData.name);
  }, [zikrCollectionPath]);

  useEffect(() => {
    if (userId) {
      loadZikrData('SubhanAllah');
    }
  }, [userId, loadZikrData]);

  const saveZikr = useCallback(async (dataToSave) => {
    if (!zikrCollectionPath || !dataToSave.name) return;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const docId = `${dataToSave.name}-${today.toISOString().split('T')[0]}`;
    const docRef = doc(db, zikrCollectionPath, docId);
    const finalData = { ...dataToSave, deadline: dataToSave.deadline ? Timestamp.fromDate(new Date(dataToSave.deadline)) : null, date: Timestamp.fromDate(today) };
    try { await setDoc(docRef, finalData, { merge: true }); } catch (error) { console.error("Error saving Zikr: ", error); }
  }, [zikrCollectionPath]);

  const handleSelectZikr = (zikrData) => {
    setActiveZikr(zikrData);
    setInputValue(zikrData.name);
    setCurrentPage('home'); // Switch back to home page to continue
  }

  if (!isAuthReady || !userId || !activeZikr) {
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
          {currentPage === 'home' && (
            <HomePage
              activeZikr={activeZikr}
              userId={userId}
              setActiveZikr={setActiveZikr}
              inputValue={inputValue}
              setInputValue={setInputValue}
              loadZikrData={loadZikrData}
              saveZikr={saveZikr}
            />
          )}
          {currentPage === 'today' && <TodayPage userId={userId} onSelectZikr={handleSelectZikr} />}
          {currentPage === 'stats' && <StatsPage userId={userId} />}
        </div>
      </main>

      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </div>
  );
}

export default App;
