
import React, { useState, useEffect, useMemo } from 'react'; // In a real file
import { BarChart2, History } from 'lucide-react'; // In a real file
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'; // In a real file
import { db, appId, collection, query, onSnapshot } from '../config/firebase'; // In a real file

const StatsPage = ({ userId }) => {
  const [historyData, setHistoryData] = useState([]);
  const [view, setView] = useState('daily');
  const zikrCollectionPath = useMemo(() => userId ? `/artifacts/${appId}/users/${userId}/zikr-history` : null, [userId]);

  useEffect(() => {
    if (!zikrCollectionPath) return;
    const q = query(collection(db, zikrCollectionPath));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      data.sort((a, b) => b.date.seconds - a.date.seconds);
      setHistoryData(data);
    });
    return () => unsubscribe();
  }, [zikrCollectionPath]);

  const filteredData = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const filterByDate = (dateFilter) => historyData.filter(item => item.date.toDate() >= dateFilter);
    if (view === 'daily') return filterByDate(today);
    if (view === 'weekly') { const oneWeekAgo = new Date(today); oneWeekAgo.setDate(today.getDate() - 7); return filterByDate(oneWeekAgo); }
    if (view === 'monthly') { const oneMonthAgo = new Date(today); oneMonthAgo.setMonth(today.getMonth() - 1); return filterByDate(oneMonthAgo); }
    return [];
  }, [historyData, view]);

  const chartData = useMemo(() => {
    const dataMap = new Map();
    filteredData.forEach(item => {
      const dateStr = item.date.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const currentCount = dataMap.get(dateStr)?.count || 0;
      dataMap.set(dateStr, { date: dateStr, count: currentCount + item.count });
    });
    return Array.from(dataMap.values()).reverse();
  }, [filteredData]);

  const totalZikr = filteredData.reduce((acc, item) => acc + item.count, 0);

  return (
    <div className="bg-[#1E1E1E] rounded-3xl p-6">
      <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-semibold flex items-center"><BarChart2 className="w-5 h-5 mr-2 text-[#34D399]" /> Progress</h2><div className="flex space-x-1 bg-[#374151] p-1 rounded-full text-sm"><button onClick={() => setView('daily')} className={`px-3 py-1 rounded-full transition-colors ${view === 'daily' ? 'bg-[#1E1E1E] text-white shadow-md' : 'text-gray-400'}`}>Day</button><button onClick={() => setView('weekly')} className={`px-3 py-1 rounded-full transition-colors ${view === 'weekly' ? 'bg-[#1E1E1E] text-white shadow-md' : 'text-gray-400'}`}>Week</button><button onClick={() => setView('monthly')} className={`px-3 py-1 rounded-full transition-colors ${view === 'monthly' ? 'bg-[#1E1E1E] text-white shadow-md' : 'text-gray-400'}`}>Month</button></div></div>
      <div className="text-center mb-6"><p className="text-gray-400 capitalize">{view} Total</p><p className="text-4xl font-bold text-[#34D399]">{totalZikr}</p></div>
      <div className="h-60 mb-6"><ResponsiveContainer width="100%" height="100%"><BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}><CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.1)" /><XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} stroke="#9CA3AF" /><YAxis fontSize={12} tickLine={false} axisLine={false} stroke="#9CA3AF" /><Tooltip contentStyle={{ backgroundColor: 'rgba(30, 30, 30, 0.9)', borderColor: '#34D399', color: '#E5E7EB', borderRadius: '0.75rem' }} cursor={{ fill: 'rgba(52, 211, 153, 0.1)' }} /><Bar dataKey="count" fill="#34D399" name="Zikr Count" barSize={20} radius={[8, 8, 0, 0]} /></BarChart></ResponsiveContainer></div>
      <div><h3 className="text-lg font-semibold mb-3 flex items-center"><History className="w-5 h-5 mr-2 text-[#34D399]" /> Recent Activity</h3><ul className="space-y-2 max-h-40 overflow-y-auto pr-2">{filteredData.length > 0 ? filteredData.slice(0, 10).map((item) => (<li key={item.id} className="flex justify-between items-center p-3 rounded-xl bg-[#374151] bg-opacity-40"><div><p className="font-medium text-gray-200">{item.name}</p><p className="text-xs text-gray-400">{item.date.toDate().toLocaleDateString()}</p></div><span className="font-bold text-lg text-[#34D399]">{item.count}</span></li>)) : <p className="text-center text-gray-500 p-4">No Zikr recorded for this period.</p>}</ul></div>
    </div>
  );
};

export default StatsPage
