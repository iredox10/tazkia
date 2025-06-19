
import React, { useState, useEffect, useMemo } from 'react';
import { X, BookOpen, PlusCircle, Edit, Trash2 } from 'lucide-react';
import { PRESET_ZIKR } from '../config/constant';
import { db, appId, collection, onSnapshot, query } from '../config/firebase';

const PresetModal = ({ isVisible, onClose, onSelect, userId, onAdd, onEdit, onDelete }) => {
  const [customZikrList, setCustomZikrList] = useState([]);
  const customZikrCollectionPath = useMemo(() => userId ? `/artifacts/${appId}/users/${userId}/custom_zikr` : null, [userId]);

  useEffect(() => {
    if (!isVisible || !customZikrCollectionPath) return;
    const q = query(collection(db, customZikrCollectionPath));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setCustomZikrList(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsubscribe();
  }, [isVisible, customZikrCollectionPath]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-[#1E1E1E] border border-gray-700 rounded-3xl shadow-xl p-6 w-full max-w-sm flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center mb-4 shrink-0">
          <h2 className="text-xl font-bold flex items-center"><BookOpen className="w-5 h-5 mr-2 text-[#34D399]" />Select a Zikr</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700"><X className="w-5 h-5" /></button>
        </div>

        <div className="space-y-3 overflow-y-auto mb-4">
          {/* Preset Zikr */}
          {PRESET_ZIKR.map((zikr) => (
            <button key={zikr.name} onClick={() => onSelect(zikr)} className="w-full text-left p-4 bg-[#374151] rounded-xl hover:bg-[#4B5563] transition-colors">
              <p className="font-semibold text-gray-200">{zikr.name}</p>
              {zikr.arabic && <p className="text-right text-2xl font-['Amiri',_serif] text-[#34D399]">{zikr.arabic}</p>}
              <p className="text-sm text-gray-400">Target: {zikr.target}</p>
            </button>
          ))}
          {/* Custom Zikr */}
          {customZikrList.map((zikr) => (
            <div key={zikr.id} className="group relative bg-[#374151] rounded-xl">
              <button onClick={() => onSelect(zikr)} className="w-full text-left p-4 hover:bg-[#4B5563] rounded-xl transition-colors">
                <p className="font-semibold text-gray-200">{zikr.name}</p>
                <p className="text-sm text-gray-400">Target: {zikr.target}</p>
              </button>
              <div className="absolute top-1/2 right-4 -translate-y-1/2 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => onEdit(zikr)} className="p-2 rounded-full hover:bg-gray-600"><Edit className="w-4 h-4 text-gray-300" /></button>
                <button onClick={() => onDelete(zikr)} className="p-2 rounded-full hover:bg-gray-600"><Trash2 className="w-4 h-4 text-red-400" /></button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-auto shrink-0 pt-4 border-t border-gray-700">
          <button onClick={onAdd} className="w-full flex items-center justify-center px-4 py-3 bg-[#374151] font-semibold rounded-xl hover:bg-gray-600 transition-colors">
            <PlusCircle className="w-5 h-5 mr-2" />Add Custom Zikr
          </button>
        </div>
      </div>
    </div>
  );
};

export default PresetModal;
