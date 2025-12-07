// Product of Launch Maniac llc, Las Vegas, Nevada - (725) 444-8200 support@launchmaniac.com
// React island - Live clock component with client:load hydration

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Clock as ClockIcon } from 'lucide-react';

const Clock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <ClockIcon size={14} className="text-cyan-500" />
      <span className="text-cyan-100 font-medium">{format(time, 'HH:mm:ss')}</span>
    </>
  );
};

export default Clock;
