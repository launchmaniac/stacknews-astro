// Product of Launch Maniac llc, Las Vegas, Nevada - (725) 444-8200 support@launchmaniac.com
// Animated Counter Component - Smooth incrementing number display

import React, { useState, useEffect, useRef, useCallback } from 'react';

interface AnimatedCounterProps {
  baseValue: number;           // Starting value from API
  ratePerSecond: number;       // Growth rate per second
  startTimestamp: number;      // Unix timestamp (ms) when baseValue was recorded
  formatFn?: (value: number) => string; // Custom formatter
  className?: string;
}

export default function AnimatedCounter({
  baseValue,
  ratePerSecond,
  startTimestamp,
  formatFn,
  className = ''
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(baseValue);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const isVisibleRef = useRef(true);

  // Calculate current value based on elapsed time
  const calculateCurrentValue = useCallback(() => {
    const now = Date.now();
    const elapsedSeconds = (now - startTimestamp) / 1000;
    return baseValue + (elapsedSeconds * ratePerSecond);
  }, [baseValue, ratePerSecond, startTimestamp]);

  // Animation loop using requestAnimationFrame
  const animate = useCallback((timestamp: number) => {
    if (!isVisibleRef.current) {
      animationRef.current = requestAnimationFrame(animate);
      return;
    }

    // Throttle updates to ~30fps for performance while keeping smooth appearance
    if (timestamp - lastTimeRef.current >= 33) {
      lastTimeRef.current = timestamp;
      setDisplayValue(calculateCurrentValue());
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [calculateCurrentValue]);

  // Handle page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      isVisibleRef.current = !document.hidden;
      if (!document.hidden) {
        // When tab becomes visible, immediately update to correct value
        setDisplayValue(calculateCurrentValue());
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [calculateCurrentValue]);

  // Start animation loop
  useEffect(() => {
    // Initialize with current calculated value
    setDisplayValue(calculateCurrentValue());

    // Start animation
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate, calculateCurrentValue]);

  // Update when base props change (new API data)
  useEffect(() => {
    setDisplayValue(calculateCurrentValue());
  }, [baseValue, ratePerSecond, startTimestamp, calculateCurrentValue]);

  // Default formatter: locale-aware currency
  const defaultFormatter = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(Math.round(value));
  };

  const formatter = formatFn || defaultFormatter;

  return (
    <span className={`tabular-nums ${className}`}>
      {formatter(displayValue)}
    </span>
  );
}
