import { X, BookOpen } from 'lucide-react'; // In a real file
import { PRESET_ZIKR } from '../config/constant.js'; // In a real file

const PresetModal = ({ isVisible, onClose, onSelect }) => {
  if (!isVisible) return null;
  return <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm"><div className="bg-[#1E1E1E] border border-gray-700 rounded-3xl shadow-xl p-6 w-full max-w-sm"><div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold flex items-center"><BookOpen className="w-5 h-5 mr-2 text-[#34D399]" />Select a Zikr</h2><button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700"><X className="w-5 h-5" /></button></div><div className="space-y-3 max-h-96 overflow-y-auto">{PRESET_ZIKR.map((preset) => (<button key={preset.name} onClick={() => onSelect(preset)} className="w-full text-left p-4 bg-[#374151] rounded-xl hover:bg-[#4B5563] transition-colors"><p className="font-semibold text-gray-200">{preset.name}</p><p className="text-right text-2xl font-['Amiri',_serif] text-[#34D399]">{preset.arabic}</p><p className="text-sm text-gray-400">Target: {preset.target}</p></button>))}</div></div></div>;
};

export default PresetModal; // In a real file
