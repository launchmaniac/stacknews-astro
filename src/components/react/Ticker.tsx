// Product of Launch Maniac llc, Las Vegas, Nevada - (725) 444-8200 support@launchmaniac.com
// React island - Animated ticker component with client:visible hydration

import React from 'react';

interface TickerProps {
  items: React.ReactNode[];
  speed?: number;
  className?: string;
}

const Ticker: React.FC<TickerProps> = ({
  items,
  speed = 35,
  className = 'bg-black/40 border-b border-white/10'
}) => {
  if (!items.length) return null;

  const duration = Math.max(30, items.length * 8);

  return (
    <div className={`w-full overflow-hidden h-8 flex items-center relative select-none ${className}`}>
      <div className="absolute left-0 top-0 bottom-0 w-8 z-10 bg-gradient-to-r from-black to-transparent" />
      <div className="absolute right-0 top-0 bottom-0 w-8 z-10 bg-gradient-to-l from-black to-transparent" />

      <div
        className="whitespace-nowrap flex gap-12 items-center animate-scroll"
        style={{
          animation: `scroll ${duration}s linear infinite`
        }}
      >
        <style>{`
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>

        {items.map((item, idx) => (
          <div key={`orig-${idx}`} className="text-xs font-mono font-thin text-cyan-100/80 flex items-center gap-2">
            {item}
          </div>
        ))}

        {items.map((item, idx) => (
          <div key={`dup-${idx}`} className="text-xs font-mono font-thin text-cyan-100/80 flex items-center gap-2" aria-hidden="true">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Ticker;
