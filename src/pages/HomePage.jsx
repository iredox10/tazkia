
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Repeat, Settings, BookOpen } from 'lucide-react';
import { db, appId, doc, setDoc, getDoc, Timestamp } from '../config/firebase';
import ZikrCounter from '../components/ZikrCounter';
import PresetModal from '../components/PresetModal';
import TargetModal from '../components/TargetModal';

const HomePage = ({ userId }) => {
  const [activeZikr, setActiveZikr] = useState({ name: 'SubhanAllah', count: 0, target: 100, deadline: '', reminderInterval: 0 });
  const [inputValue, setInputValue] = useState('SubhanAllah');
  const [showTargetModal, setShowTargetModal] = useState(false);
  const [showPresetModal, setShowPresetModal] = useState(false);

  const zikrCollectionPath = useMemo(() => userId ? `/artifacts/${appId}/users/${userId}/zikr-history` : null, [userId]);

  const loadZikrData = useCallback(async (zikrName) => {
    if (!userId || !zikrCollectionPath) return;
    const docId = `${zikrName}-${new Date().toISOString().split('T')[0]}`;
    const docRef = doc(db, zikrCollectionPath, docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      setActiveZikr({
        name: data.name,
        count: data.count || 0,
        target: data.target || 100,
        deadline: data.deadline ? new Date(data.deadline.seconds * 1000).toISOString().substring(0, 16) : '',
        reminderInterval: data.reminderInterval || 0,
      });
      setInputValue(data.name);
    } else {
      setActiveZikr({ name: zikrName, count: 0, target: 100, deadline: '', reminderInterval: 0 });
      setInputValue(zikrName);
    }
  }, [userId, zikrCollectionPath]);

  useEffect(() => { loadZikrData('SubhanAllah'); }, [loadZikrData]);

  const saveZikr = useCallback(async (dataToSave) => {
    if (!userId || !dataToSave.name || !zikrCollectionPath) return;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const docId = `${dataToSave.name}-${today.toISOString().split('T')[0]}`;
    const docRef = doc(db, zikrCollectionPath, docId);
    const finalData = { ...dataToSave, deadline: dataToSave.deadline ? Timestamp.fromDate(new Date(dataToSave.deadline)) : null, date: Timestamp.fromDate(today) };
    try { await setDoc(docRef, finalData, { merge: true }); } catch (error) { console.error("Error saving Zikr: ", error); }
  }, [userId, zikrCollectionPath]);

  useEffect(() => {
    const { count, target, deadline, reminderInterval, name } = activeZikr;
    if (reminderInterval === 0 || !deadline || count >= target) return;
    const deadlineTime = new Date(deadline).getTime();
    const intervalId = setInterval(() => {
      const now = new Date().getTime();
      if (now > deadlineTime || activeZikr.count >= activeZikr.target) { clearInterval(intervalId); return; }
      if ('Notification' in window && Notification.permission === 'granted') { new Notification('Tazkia Zikr Reminder', { body: `Reminder: ${target} ${name}. You're at ${count}.` }); }
    }, reminderInterval * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [activeZikr]);

  const handleIncrement = useCallback(() => { const newCount = activeZikr.count + 1; const updatedZikr = { ...activeZikr, count: newCount }; setActiveZikr(updatedZikr); saveZikr(updatedZikr); }, [activeZikr, saveZikr]);
  const resetCounter = useCallback(() => { const updatedZikr = { ...activeZikr, count: 0 }; setActiveZikr(updatedZikr); saveZikr(updatedZikr); }, [activeZikr, saveZikr]);
  const handleSetTarget = (newTargetData) => { if (newTargetData.reminderInterval > 0 && 'Notification' in window && Notification.permission !== 'granted') { Notification.requestPermission(); } const updatedZikr = { ...activeZikr, ...newTargetData }; setActiveZikr(updatedZikr); saveZikr(updatedZikr); setShowTargetModal(false); };
  const handleSelectPreset = (preset) => { const updatedZikr = { name: preset.name, target: preset.target, count: 0, deadline: '', reminderInterval: 0 }; setActiveZikr(updatedZikr); setInputValue(preset.name); saveZikr(updatedZikr); setShowPresetModal(false); };
  const handleInputBlur = () => { if (inputValue !== activeZikr.name) { loadZikrData(inputValue); } };

  const progress = activeZikr.target > 0 ? Math.min((activeZikr.count / activeZikr.target) * 100, 100) : 0;

  return (
    <>
      <div className="bg-[#1E1E1E] rounded-3xl p-6 md:p-8 text-center relative overflow-hidden">
        <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onBlur={handleInputBlur} className="text-2xl font-bold bg-transparent text-center w-full mb-6 focus:outline-none text-gray-300 placeholder-gray-500" placeholder="Name of Zikr" />

        {/* The ZikrCounter itself is the main clickable area */}
        <ZikrCounter progress={progress} count={activeZikr.count} onIncrement={handleIncrement} />

        {/* Button container - events here are now isolated */}
        <div className="flex items-center justify-center space-x-6 mt-6">
          <button onClick={(e) => { e.stopPropagation(); resetCounter(); }} className="p-3 bg-[#374151] rounded-full text-gray-300 hover:bg-[#4B5563] transition-colors"><Repeat className="w-5 h-5" /></button>
          <button onClick={(e) => { e.stopPropagation(); setShowPresetModal(true); }} className="p-3 bg-[#374151] rounded-full text-gray-300 hover:bg-[#4B5563] transition-colors"><BookOpen className="w-5 h-5" /></button>
          <button onClick={(e) => { e.stopPropagation(); setShowTargetModal(true); }} className="p-3 bg-[#374151] rounded-full text-gray-300 hover:bg-[#4B5563] transition-colors"><Settings className="w-5 h-5" /></button>
        </div>
      </div>
      <PresetModal isVisible={showPresetModal} onClose={() => setShowPresetModal(false)} onSelect={handleSelectPreset} />
      <TargetModal isVisible={showTargetModal} onClose={() => setShowTargetModal(false)} onSave={handleSetTarget} currentZikr={activeZikr} />
    </>
  );
};

export default HomePage;
