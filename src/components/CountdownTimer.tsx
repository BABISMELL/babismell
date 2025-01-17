import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownTimerProps {
  endDate: string;
  isActive: boolean;
}

export function CountdownTimer({ endDate, isActive }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => {
    if (!endDate) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();
    const difference = Math.max(0, end - now);
    
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000)
    };
  });

  const calculateTimeLeft = useCallback(() => {
    if (!endDate) {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    try {
      const end = new Date(endDate).getTime();
      const now = new Date().getTime();
      const difference = Math.max(0, end - now);
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    } catch (error) {
      console.error('Error calculating time left:', error);
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    }
  }, [endDate]);

  useEffect(() => {
    if (!isActive || !endDate) {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [isActive, endDate, calculateTimeLeft]);

  if (!isActive || (timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0)) {
    return null;
  }

  return (
    <div className="flex items-center gap-4">
      <TimeUnit value={timeLeft.days} label="jours" />
      <TimeUnit value={timeLeft.hours} label="heures" />
      <TimeUnit value={timeLeft.minutes} label="minutes" />
      <TimeUnit value={timeLeft.seconds} label="secondes" />
    </div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex flex-col items-center"
    >
      <div className="bg-white/10 rounded-lg px-3 py-1">
        <span className="text-lg font-bold">{value.toString().padStart(2, '0')}</span>
      </div>
      <span className="text-xs mt-1">{label}</span>
    </motion.div>
  );
}