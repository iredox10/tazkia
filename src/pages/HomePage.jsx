
import React, { useState, useEffect, useCallback } from 'react';
import { Repeat, Settings, BookOpen, AlertTriangle, Award, RefreshCw } from 'lucide-react';
import * as Tone from 'tone';
import ZikrCounter from '../components/ZikrCounter';
import PresetModal from '../components/PresetModal';
import TargetModal from '../components/TargetModal';
import AddCustomZikrModal from '../components/AddCustomZikrModal';
import EditCustomZikrModal from '../components/EditCustomZikrModal';
import { db, appId, doc, deleteDoc } from '../config/firebase';

// --- Reusable Confirmation Modal ---
const ConfirmationModal = ({ isVisible, icon: Icon, color, title, message, confirmText, onConfirm, onCancel }) => {
  if (!isVisible) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className={`bg-[#1E1E1E] border border-${color}-500 rounded-3xl shadow-xl p-6 w-full max-w-sm text-center`}>
        <div className="flex justify-center mb-4"><Icon className={`w-12 h-12 text-${color}-400`} /></div>
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <p className="text-gray-400 mb-6">{message}</p>
        <div className="flex justify-center space-x-4">
          <button onClick={onCancel} className="px-8 py-2 bg-[#374151] font-semibold rounded-xl hover:bg-gray-600 transition-colors">Cancel</button>
          <button onClick={onConfirm} className={`px-8 py-2 bg-${color}-500 text-black font-bold rounded-xl hover:bg-${color}-600 transition-colors`}>{confirmText}</button>
        </div>
      </div>
    </div>
  );
}

// --- Target Reached Modal ---
const TargetReachedModal = ({ isVisible, onContinue, onNew, zikrName }) => {
  if (!isVisible) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-[#1E1E1E] border border-green-500 rounded-3xl shadow-xl p-6 w-full max-w-sm text-center">
        <div className="flex justify-center mb-4"><Award className="w-12 h-12 text-green-400" /></div>
        <h2 className="text-xl font-bold mb-2">Masha'Allah!</h2>
        <p className="text-gray-400 mb-6">You have completed your target for {zikrName}. What would you like to do next?</p>
        <div className="flex flex-col space-y-3">
          <button onClick={onContinue} className="w-full px-4 py-3 bg-[#374151] font-semibold rounded-xl hover:bg-gray-600 transition-colors">Continue Counting</button>
          <button onClick={onNew} className="w-full px-4 py-3 bg-green-500 text-black font-bold rounded-xl hover:bg-green-600 transition-colors flex items-center justify-center"><RefreshCw className="w-5 h-5 mr-2" /> Start New Zikr</button>
        </div>
      </div>
    </div>
  );
};

// --- HomePage Component ---
const HomePage = ({ userId, activeZikr, setActiveZikr, inputValue, setInputValue, loadZikrData, saveZikr }) => {
  // --- State Management for ALL Modals ---
  const [showTargetModal, setShowTargetModal] = useState(false);
  const [showPresetModal, setShowPresetModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingZikr, setEditingZikr] = useState(null);
  const [deletingZikr, setDeletingZikr] = useState(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showTargetReached, setShowTargetReached] = useState(false);
  const [showConfirmSwitch, setShowConfirmSwitch] = useState(false);
  const [nextZikr, setNextZikr] = useState(null);

  const playSound = () => {
    if (typeof Tone !== 'undefined' && Tone.context.state !== 'running') {
      Tone.start();
    }
    const synth = new Tone.Synth().toDestination();
    synth.triggerAttackRelease("C5", "8n");
  };

  const handleIncrement = useCallback(() => {
    if (showTargetReached) return;
    const newCount = activeZikr.count + 1;
    const updatedZikr = { ...activeZikr, count: newCount };
    setActiveZikr(updatedZikr);
    saveZikr(updatedZikr);
    if (newCount === activeZikr.target) { playSound(); setShowTargetReached(true); }
  }, [activeZikr, saveZikr, setActiveZikr, showTargetReached]);

  const handleReset = () => {
    const updatedZikr = { ...activeZikr, count: 0 };
    setActiveZikr(updatedZikr);
    saveZikr(updatedZikr);
    setShowResetConfirm(false);
  };

  const attemptToSwitchZikr = (newZikrLoader) => {
    const isInProgress = activeZikr.count > 0 && activeZikr.count < activeZikr.target;
    if (isInProgress) {
      setNextZikr(() => newZikrLoader);
      setShowConfirmSwitch(true);
    } else {
      newZikrLoader();
    }
  };

  const confirmAndSwitch = () => {
    if (nextZikr) nextZikr();
    setShowConfirmSwitch(false);
    setNextZikr(null);
  };

  const handleSelectPreset = (preset) => {
    attemptToSwitchZikr(() => {
      const updatedZikr = { name: preset.name, target: preset.target, count: 0, deadline: '', reminderInterval: 0 };
      setActiveZikr(updatedZikr);
      setInputValue(preset.name);
      saveZikr(updatedZikr);
      setShowPresetModal(false);
    });
  };

  const handleInputBlur = () => {
    if (inputValue !== activeZikr.name) {
      attemptToSwitchZikr(() => loadZikrData(inputValue));
    }
  };

  const handleDeleteZikr = async () => {
    if (!deletingZikr || !userId) return;
    const docRef = doc(db, `/artifacts/${appId}/users/${userId}/custom_zikr`, deletingZikr.id);
    try {
      await deleteDoc(docRef);
      setDeletingZikr(null);
    } catch (error) { console.error("Error deleting document: ", error); }
  };

  const progress = activeZikr.target > 0 ? Math.min((activeZikr.count / activeZikr.target) * 100, 100) : 0;

  return (
    <>
      <div className="bg-[#1E1E1E] rounded-3xl p-6 md:p-8 text-center relative overflow-hidden">
        <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onBlur={handleInputBlur} className="text-2xl font-bold bg-transparent text-center w-full mb-6 focus:outline-none text-gray-300 placeholder-gray-500" placeholder="Name of Zikr" />
        <ZikrCounter progress={progress} count={activeZikr.count} target={activeZikr.target} onIncrement={handleIncrement} />
        <div className="flex items-center justify-center space-x-6 mt-6" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => setShowResetConfirm(true)} className="p-3 bg-[#374151] rounded-full text-gray-300 hover:bg-[#4B5563] transition-colors"><Repeat className="w-5 h-5" /></button>
          <button onClick={() => setShowPresetModal(true)} className="p-3 bg-[#374151] rounded-full text-gray-300 hover:bg-[#4B5563] transition-colors"><BookOpen className="w-5 h-5" /></button>
          <button onClick={() => setShowTargetModal(true)} className="p-3 bg-[#374151] rounded-full text-gray-300 hover:bg-[#4B5563] transition-colors"><Settings className="w-5 h-5" /></button>
        </div>
      </div>

      {/* All Modals are now rendered and managed by the HomePage */}
      <PresetModal isVisible={showPresetModal} onClose={() => setShowPresetModal(false)} onSelect={handleSelectPreset} userId={userId} onAdd={() => setShowAddModal(true)} onEdit={(zikr) => setEditingZikr(zikr)} onDelete={(zikr) => setDeletingZikr(zikr)} />
      <AddCustomZikrModal isVisible={showAddModal} onClose={() => setShowAddModal(false)} userId={userId} />
      <EditCustomZikrModal isVisible={!!editingZikr} onClose={() => setEditingZikr(null)} userId={userId} zikrToEdit={editingZikr} />
      <TargetModal isVisible={showTargetModal} onClose={() => setShowTargetModal(false)} onSave={(data) => { const updated = { ...activeZikr, ...data }; setActiveZikr(updated); saveZikr(updated); setShowTargetModal(false) }} currentZikr={activeZikr} />

      <ConfirmationModal isVisible={!!deletingZikr} icon={AlertTriangle} color="red" title="Delete Zikr?" message={`Are you sure you want to permanently delete "${deletingZikr?.name}"?`} confirmText="Delete" onConfirm={handleDeleteZikr} onCancel={() => setDeletingZikr(null)} />
      <ConfirmationModal isVisible={showResetConfirm} icon={AlertTriangle} color="yellow" title="Reset Counter?" message="Are you sure you want to reset your current count to zero?" confirmText="Reset" onConfirm={handleReset} onCancel={() => setShowResetConfirm(false)} />
      <ConfirmationModal isVisible={showConfirmSwitch} icon={AlertTriangle} color="yellow" title="Switch Zikr?" message="Your current Zikr is in progress. Are you sure you want to switch? Your progress will be saved." confirmText="Switch" onConfirm={confirmAndSwitch} onCancel={() => setShowConfirmSwitch(false)} />
      <TargetReachedModal isVisible={showTargetReached} zikrName={activeZikr.name} onContinue={() => setShowTargetReached(false)} onNew={() => { setShowTargetReached(false); setShowPresetModal(true); }} />
    </>
  );
};

export default HomePage;
