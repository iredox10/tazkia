
import React, { useState, useEffect, useMemo } from 'react';
import { X, CheckCircle } from 'lucide-react';
import { db, appId, doc, updateDoc } from '../config/firebase';

const EditCustomZikrModal = ({ isVisible, onClose, userId, zikrToEdit }) => {
  const [name, setName] = useState('');
  const [target, setTarget] = useState(100);
  const [error, setError] = useState('');

  const customZikrCollectionPath = useMemo(() => userId ? `/artifacts/${appId}/users/${userId}/custom_zikr` : null, [userId]);

  useEffect(() => {
    if (zikrToEdit) {
      setName(zikrToEdit.name);
      setTarget(zikrToEdit.target);
    }
  }, [zikrToEdit]);

  const handleUpdateZikr = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter a name for the Zikr.');
      return;
    }
    if (target <= 0) {
      setError('Target must be greater than zero.');
      return;
    }
    if (!customZikrCollectionPath || !zikrToEdit?.id) {
      setError('Cannot update Zikr. Invalid data.');
      return;
    }

    const docRef = doc(db, customZikrCollectionPath, zikrToEdit.id);

    try {
      await updateDoc(docRef, {
        name: name.trim(),
        target: target,
      });
      onClose(); // Close modal on success
      setError('');
    } catch (err) {
      console.error("Error updating custom zikr:", err);
      setError('Could not update custom Zikr. Please try again.');
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-[#1E1E1E] border border-gray-700 rounded-3xl shadow-xl p-6 w-full max-w-sm flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold flex items-center">Edit Custom Zikr</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleUpdateZikr}>
          <div className="space-y-4">
            <div>
              <label htmlFor="edit-zikr-name" className="block text-sm font-medium text-gray-400 mb-1">Zikr Name</label>
              <input
                id="edit-zikr-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-[#374151] border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#34D399] text-gray-200"
              />
            </div>
            <div>
              <label htmlFor="edit-zikr-target" className="block text-sm font-medium text-gray-400 mb-1">Target</label>
              <input
                id="edit-zikr-target"
                type="number"
                value={target}
                onChange={(e) => setTarget(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3 py-2 bg-[#374151] border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#34D399] text-gray-200"
              />
            </div>
          </div>
          {error && <p className="text-red-400 text-xs mt-3 text-center">{error}</p>}
          <div className="mt-6">
            <button type="submit" className="w-full flex items-center justify-center px-4 py-3 bg-[#34D399] text-black font-bold rounded-xl hover:bg-opacity-90 transition-colors">
              <CheckCircle className="w-5 h-5 mr-2" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCustomZikrModal;
