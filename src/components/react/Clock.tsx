// Product of Launch Maniac llc, Las Vegas, Nevada - (725) 444-8200 support@launchmaniac.com
// React island - Cyber-terminal clock with VT323 display font

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

const Clock: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
      setBlink(prev => !prev);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-1 font-display">
      <span className="text-cyan-500/60 text-xs">T:</span>
      <span
        className="text-lg tracking-wider tabular-nums"
        style={{
          color: 'var(--color-cyan-bright, #22d3ee)',
          textShadow: '0 0 10px rgba(6, 182, 212, 0.4)'
        }}
      >
        {format(time, 'HH')}
        <span className={blink ? 'opacity-100' : 'opacity-30'}>:</span>
        {format(time, 'mm')}
        <span className={blink ? 'opacity-100' : 'opacity-30'}>:</span>
        <span className="text-cyan-300/80">{format(time, 'ss')}</span>
      </span>
    </div>
  );
};

export default Clock;
