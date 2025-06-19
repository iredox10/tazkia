
const ResetConfirmModal = ({ isVisible, onClose, onConfirm }) => {
  if (!isVisible) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-[#1E1E1E] border border-yellow-500 rounded-3xl shadow-xl p-6 w-full max-w-sm text-center">
        <div className="flex justify-center mb-4"><AlertTriangle className="w-12 h-12 text-yellow-400" /></div>
        <h2 className="text-xl font-bold mb-2">Reset Counter?</h2>
        <p className="text-gray-400 mb-6">Are you sure you want to reset your current count to zero?</p>
        <div className="flex justify-center space-x-4">
          <button onClick={onClose} className="px-8 py-2 bg-[#374151] font-semibold rounded-xl hover:bg-gray-600 transition-colors">Cancel</button>
          <button onClick={onConfirm} className="px-8 py-2 bg-yellow-500 text-black font-bold rounded-xl hover:bg-yellow-600 transition-colors">Reset</button>
        </div>
      </div>
    </div>
  );
};

export default ResetConfirmModal
