import React, { useState, useEffect, useMemo } from 'react';
import { Timestamp, collection, query, where, onSnapshot } from '../config/firebase';
import { db, appId } from '../config/firebase';
import { Check, Zap, Activity } from 'lucide-react';

const TodaysZikrList = ({ userId, onSelectZikr }) => {
  const [todaysZikr, setTodaysZikr] = useState([]);
  const zikrCollectionPath = useMemo(() => userId ? `/artifacts/${appId}/users/${userId}/zikr-history` : null, [userId]);

  useEffect(() => {
    if (!zikrCollectionPath) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = Timestamp.fromDate(today);

    const q = query(collection(db, zikrCollectionPath), where("date", "==", todayTimestamp));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const zikrList = [];
      querySnapshot.forEach((doc) => {
        zikrList.push({ id: doc.id, ...doc.data() });
      });
      setTodaysZikr(zikrList);
    });

    return () => unsubscribe();
  }, [zikrCollectionPath, userId]);

  const inProgress = todaysZikr.filter(z => z.count < z.target);
  const completed = todaysZikr.filter(z => z.count >= z.target);

  const handleSelect = (zikrDoc) => {
    onSelectZikr({
      name: zikrDoc.name,
      count: zikrDoc.count || 0,
      target: zikrDoc.target || 100,
      deadline: zikrDoc.deadline ? new Date(zikrDoc.deadline.seconds * 1000).toISOString().substring(0, 16) : '',
      reminderInterval: zikrDoc.reminderInterval || 0,
    });
  }

  if (todaysZikr.length === 0) {
    return (
      <div className="bg-[#1E1E1E] rounded-3xl p-6 mt-8 text-center">
        <h2 className="text-xl font-semibold flex items-center mb-4"><Activity className="w-5 h-5 mr-2 text-[#34D399]" /> Today's Progress</h2>
        <p className="text-gray-400">No Zikr started for today. Begin by using the counter on the Home page.</p>
      </div>
    )
  };

  return (
    <div className="bg-[#1E1E1E] rounded-3xl p-6">
      <h2 className="text-xl font-semibold flex items-center mb-4"><Activity className="w-5 h-5 mr-2 text-[#34D399]" /> Today's Progress</h2>

      {inProgress.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-yellow-400 mb-2">In Progress</h3>
          <div className="space-y-2">
            {inProgress.map(zikr => (
              <button key={zikr.id} onClick={() => handleSelect(zikr)} className="w-full text-left p-3 bg-[#374151] rounded-xl hover:bg-[#4B5563] transition-colors flex items-center justify-between">
                <div>
                  <p className="font-medium">{zikr.name}</p>
                  <p className="text-xs text-gray-400">{zikr.count} / {zikr.target}</p>
                </div>
                <Zap className="w-5 h-5 text-yellow-400" />
              </button>
            ))}
          </div>
        </div>
      )}

      {completed.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-green-400 mb-2">Completed</h3>
          <div className="space-y-2">
            {completed.map(zikr => (
              <div key={zikr.id} className="w-full text-left p-3 bg-[#374151] bg-opacity-50 rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-400 line-through">{zikr.name}</p>
                  <p className="text-xs text-gray-500">{zikr.count} / {zikr.target}</p>
                </div>
                <Check className="w-5 h-5 text-green-400" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default TodaysZikrList;
