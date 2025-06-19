
import React from 'react';
import TodaysZikrList from '../components/TodaysZikrList';

const TodayPage = ({ userId, onSelectZikr }) => {
  return (
    <div>
      <TodaysZikrList userId={userId} onSelectZikr={onSelectZikr} />
    </div>
  );
};

export default TodayPage;
