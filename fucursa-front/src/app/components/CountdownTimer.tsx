'use client';

import { useState, useEffect, useRef } from 'react';

interface CountdownTimerProps {
  initialSeconds: number;
  isActive: boolean;
  onComplete: () => void;
  onReset?: () => void;
  debug?: boolean;
  className?: string;
}

export default function CountdownTimer({
  initialSeconds,
  isActive,
  onComplete,
  onReset,
  debug = false,
  className = ''
}: CountdownTimerProps) {
  const [countdown, setCountdown] = useState(initialSeconds);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const debugLog = (message: string, data?: any) => {
    if (debug) {
      console.log(`[CountdownTimer] ${message}`, data || '');
    }
  };

  const startTimer = () => {
    debugLog('Starting countdown timer', { initialSeconds });
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    setCountdown(initialSeconds);
    
    let currentCount = initialSeconds;
    
    intervalRef.current = setInterval(() => {
      currentCount -= 1;
      debugLog('Countdown tick', { currentCount });
      
      setCountdown(currentCount);
      
      if (currentCount <= 0) {
        debugLog('Countdown completed, triggering onComplete callback');
        
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        
        onComplete();
      }
    }, 1000);
  };

  const stopTimer = () => {
    debugLog('Stopping countdown timer');
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    setCountdown(initialSeconds);
    
    if (onReset) {
      onReset();
    }
  };

  useEffect(() => {
    if (isActive) {
      startTimer();
    } else {
      stopTimer();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isActive, initialSeconds]);

  useEffect(() => {
    return () => {
      debugLog('Component unmounting, cleaning up timer');
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className={`text-center ${className}`}>
      <div className="text-6xl font-bold text-red-200 mb-3 animate-pulse">
        {countdown}
      </div>
      
      <p className="text-red-200 text-sm font-semibold">
        Exam will auto-submit in {countdown} second{countdown !== 1 ? 's' : ''}!
      </p>
      
      <p className="text-red-300 text-xs mt-2">
        Return to fullscreen mode to cancel auto-submission
      </p>
      
      {debug && (
        <div className="mt-4 p-3 bg-black/30 rounded-lg border border-white/20">
          <p className="text-xs text-gray-300 mb-1">Debug Info:</p>
          <div className="text-xs text-gray-400 space-y-1">
            <p>Initial: {initialSeconds}s</p>
            <p>Current: {countdown}s</p>
            <p>Active: {isActive ? 'Yes' : 'No'}</p>
            <p>Interval: {intervalRef.current ? 'Running' : 'Stopped'}</p>
          </div>
        </div>
      )}
    </div>
  );
}
