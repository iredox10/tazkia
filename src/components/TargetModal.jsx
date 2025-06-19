import { useEffect, useState } from 'react'
import { X, Target, CheckCircle } from 'lucide-react'; // In a real file

const TargetModal = ({ isVisible, onClose, onSave, currentZikr }) => {
  const [localData, setLocalData] = useState(currentZikr);
  useEffect(() => { setLocalData(currentZikr); }, [currentZikr, isVisible]);

  const handleSave = () => { onSave(localData); };

  if (!isVisible) return null;
  return <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm"><div className="bg-[#1E1E1E] border border-gray-700 rounded-3xl shadow-xl p-6 w-full max-w-sm"><div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold flex items-center"><Target className="w-5 h-5 mr-2 text-[#34D399]" />Set Your Goal</h2><button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700"><X className="w-5 h-5" /></button></div><div className="space-y-4"><div><label htmlFor="target-count" className="block text-sm font-medium text-gray-400 mb-1">Target Count</label><input id="target-count" type="number" value={localData.target} onChange={(e) => setLocalData(d => ({ ...d, target: parseInt(e.target.value) || 0 }))} className="w-full px-4 py-2 bg-[#374151] border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#34D399] text-gray-200" /></div><div><label htmlFor="deadline" className="block text-sm font-medium text-gray-400 mb-1">Deadline</label><input id="deadline" type="datetime-local" value={localData.deadline} onChange={(e) => setLocalData(d => ({ ...d, deadline: e.target.value }))} className="w-full px-4 py-2 bg-[#374151] border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#34D399] text-gray-200" /></div><div><label htmlFor="reminder" className="block text-sm font-medium text-gray-400 mb-1">Reminder Interval</label><select id="reminder" value={localData.reminderInterval} onChange={(e) => setLocalData(d => ({ ...d, reminderInterval: parseInt(e.target.value) }))} className="w-full px-4 py-2 bg-[#374151] border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#34D399] text-gray-200"><option value="0">No Reminders</option><option value="5">Every 5 Minutes</option><option value="15">Every 15 Minutes</option><option value="30">Every 30 Minutes</option><option value="60">Every Hour</option></select></div></div><div className="mt-6"><button onClick={handleSave} className="w-full px-4 py-3 bg-[#34D399] text-black font-bold rounded-xl hover:bg-opacity-90 transition-all flex items-center justify-center"><CheckCircle className="w-5 h-5 mr-2" /> Set Goal</button></div></div></div>;
};

export default TargetModal; // In a real file
