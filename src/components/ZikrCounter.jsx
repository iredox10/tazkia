import React from 'react'; // In a real file

const ZikrCounter = ({ progress, count, onIncrement }) => {
  const CIRCLE_RADIUS = 120;
  const CIRCLE_STROKE_WIDTH = 15;
  const circumference = 2 * Math.PI * (CIRCLE_RADIUS - CIRCLE_STROKE_WIDTH / 2);
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  return <div className="relative w-full h-[260px] flex items-center justify-center my-4" onClick={onIncrement} style={{ cursor: 'pointer' }}><svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 260 260"><circle cx="130" cy="130" r={CIRCLE_RADIUS - CIRCLE_STROKE_WIDTH / 2} fill="transparent" stroke="#374151" strokeWidth={CIRCLE_STROKE_WIDTH} /><circle cx="130" cy="130" r={CIRCLE_RADIUS - CIRCLE_STROKE_WIDTH / 2} fill="transparent" stroke="#34D399" strokeWidth={CIRCLE_STROKE_WIDTH} strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.5s ease-out' }} /></svg><div className="z-10 text-center select-none"><div className="text-7xl font-mono font-bold text-white">{count}</div><div className="text-gray-400 text-sm mt-1">TAP TO COUNT</div></div></div>;
};

export default ZikrCounter; 
