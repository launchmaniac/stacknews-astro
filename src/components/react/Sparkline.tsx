// Product of Launch Maniac llc, Las Vegas, Nevada - (725) 444-8200 support@launchmaniac.com
// Reusable Sparkline component for mini charts in data panels

import React from 'react';

interface SparklineProps {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
  className?: string;
  showDots?: boolean;
  strokeWidth?: number;
}

export default function Sparkline({
  data,
  color = '#22d3ee',
  width = 100,
  height = 40,
  className = '',
  showDots = false,
  strokeWidth = 1.5
}: SparklineProps) {
  if (!data || data.length < 2) return null;

  const values = data.filter(v => v !== null && v !== undefined && !isNaN(v));
  if (values.length < 2) return null;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const padding = 4;

  const points = values.map((val, i) => {
    const x = (i / (values.length - 1)) * width;
    const y = height - padding - ((val - min) / range) * (height - padding * 2);
    return { x, y };
  });

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ');

  // Determine trend color based on start vs end
  const trendUp = values[values.length - 1] > values[0];

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      style={{ width: '100%', height: '100%' }}
    >
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {showDots && points.length > 0 && (
        <circle
          cx={points[points.length - 1].x}
          cy={points[points.length - 1].y}
          r={2}
          fill={color}
        />
      )}
    </svg>
  );
}
