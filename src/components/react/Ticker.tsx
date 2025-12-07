// Product of Launch Maniac llc, Las Vegas, Nevada - (725) 444-8200 support@launchmaniac.com
// React island - Cyber-terminal ticker with infinite scroll and fade edges

import React from 'react';

interface TickerProps {
  items: React.ReactNode[];
  speed?: number;
  className?: string;
}

const Ticker: React.FC<TickerProps> = ({
  items,
  speed = 35,
  className = ''
}) => {
  if (!items.length) return null;

  const duration = Math.max(40, items.length * 6);

  return (
    <div className={`w-full overflow-hidden h-full flex items-center relative select-none ${className}`}>
      <div
        className="whitespace-nowrap flex gap-16 items-center"
        style={{
          animation: `ticker-scroll ${duration}s linear infinite`
        }}
      >
        <style>{`
          @keyframes ticker-scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>

        {items.map((item, idx) => (
          <div
            key={`orig-${idx}`}
            className="text-[11px] font-mono text-cyan-200/70 flex items-center gap-2 hover:text-cyan-100 transition-colors"
          >
            <span className="text-cyan-500/40">//</span>
            {item}
          </div>
        ))}

        {items.map((item, idx) => (
          <div
            key={`dup-${idx}`}
            className="text-[11px] font-mono text-cyan-200/70 flex items-center gap-2"
            aria-hidden="true"
          >
            <span className="text-cyan-500/40">//</span>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Ticker;
