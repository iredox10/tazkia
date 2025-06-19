import React, { useState, useMemo } from 'react';
import { X, PlusCircle } from 'lucide-react';
import { db, appId, collection, addDoc } from '../config/firebase';

const AddCustomZikrModal = ({ isVisible, onClose, userId }) => {
  const [newZikrName, setNewZikrName] = useState('');
  const [newZikrTarget, setNewZikrTarget] = useState(100);
  const [error, setError] = useState('');

  const customZikrCollectionPath = useMemo(() => userId ? `/artifacts/${appId}/users/${userId}/custom_zikr` : null, [userId]);

  const handleAddCustomZikr = async (e) => {
    e.preventDefault();
    if (!newZikrName.trim()) {
      setError('Please enter a name for the Zikr.');
      return;
    }
    if (newZikrTarget <= 0) {
      setError('Target must be greater than zero.');
      return;
    }

    if (!customZikrCollectionPath) {
      setError('User not found. Cannot save Zikr.');
      return;
    }

    try {
      await addDoc(collection(db, customZikrCollectionPath), {
        name: newZikrName.trim(),
        target: newZikrTarget,
      });
      // Close modal on success
      onClose();
      // Reset form
      setNewZikrName('');
      setNewZikrTarget(100);
      setError('');
    } catch (err) {
      console.error("Error adding custom zikr:", err);
      setError('Could not save custom Zikr. Please try again.');
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-[#1E1E1E] border border-gray-700 rounded-3xl shadow-xl p-6 w-full max-w-sm flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold flex items-center">Add Custom Zikr</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleAddCustomZikr}>
          <div className="space-y-4">
            <div>
              <label htmlFor="zikr-name" className="block text-sm font-medium text-gray-400 mb-1">Zikr Name</label>
              <input
                id="zikr-name"
                type="text"
                value={newZikrName}
                onChange={(e) => setNewZikrName(e.target.value)}
                placeholder="e.g., Alhamdulillah"
                className="w-full px-3 py-2 bg-[#374151] border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#34D399] text-gray-200"
              />
            </div>
            <div>
              <label htmlFor="zikr-target" className="block text-sm font-medium text-gray-400 mb-1">Target</label>
              <input
                id="zikr-target"
                type="number"
                value={newZikrTarget}
                onChange={(e) => setNewZikrTarget(parseInt(e.target.value, 10) || 0)}
                placeholder="100"
                className="w-full px-3 py-2 bg-[#374151] border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#34D399] text-gray-200"
              />
            </div>
          </div>
          {error && <p className="text-red-400 text-xs mt-3 text-center">{error}</p>}
          <div className="mt-6">
            <button type="submit" className="w-full flex items-center justify-center px-4 py-3 bg-[#34D399] text-black font-bold rounded-xl hover:bg-opacity-90 transition-colors">
              <PlusCircle className="w-5 h-5 mr-2" />
              Save Zikr
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCustomZikrModal;
