'use client';

import { useState, useEffect, useRef } from 'react';

interface CountdownTimerProps {
  /** Initial countdown value in seconds */
  initialSeconds: number;
  /** Whether the countdown is active */
  isActive: boolean;
  /** Callback when countdown reaches zero */
  onComplete: () => void;
  /** Callback when countdown is reset/stopped */
  onReset?: () => void;
  /** Whether to show debug logs */
  debug?: boolean;
  /** Custom className for styling */
  className?: string;
}

/**
 * CountdownTimer Component
 * 
 * A reusable countdown timer component that counts down from a specified number
 * of seconds and triggers a callback when it reaches zero.
 * 
 * Features:
 * - Automatic countdown with 1-second intervals
 * - Start/stop functionality via isActive prop
 * - Debug logging for troubleshooting
 * - Proper cleanup of intervals to prevent memory leaks
 * - Visual countdown display with pulsing animation
 */
export default function CountdownTimer({
  initialSeconds,
  isActive,
  onComplete,
  onReset,
  debug = false,
  className = ''
}: CountdownTimerProps) {
  // State to track current countdown value
  const [countdown, setCountdown] = useState(initialSeconds);
  // Ref to store the interval ID for cleanup
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Debug logging function - only logs when debug prop is true
   */
  const debugLog = (message: string, data?: any) => {
    if (debug) {
      console.log(`[CountdownTimer] ${message}`, data || '');
    }
  };

  /**
   * Starts the countdown timer
   */
  const startTimer = () => {
    debugLog('Starting countdown timer', { initialSeconds });
    
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Reset countdown to initial value
    setCountdown(initialSeconds);
    
    // Use local variable to avoid closure issues with React state
    let currentCount = initialSeconds;
    
    intervalRef.current = setInterval(() => {
      currentCount -= 1;
      debugLog('Countdown tick', { currentCount });
      
      // Update React state
      setCountdown(currentCount);
      
      // Check if countdown has reached zero
      if (currentCount <= 0) {
        debugLog('Countdown completed, triggering onComplete callback');
        
        // Clear the interval
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        
        // Trigger completion callback
        onComplete();
      }
    }, 1000);
  };

  /**
   * Stops the countdown timer and resets it
   */
  const stopTimer = () => {
    debugLog('Stopping countdown timer');
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Reset countdown to initial value
    setCountdown(initialSeconds);
    
    // Call reset callback if provided
    if (onReset) {
      onReset();
    }
  };

  /**
   * Effect to handle starting/stopping the timer based on isActive prop
   */
  useEffect(() => {
    if (isActive) {
      startTimer();
    } else {
      stopTimer();
    }

    // Cleanup function to clear interval when component unmounts
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isActive, initialSeconds]); // Re-run when isActive or initialSeconds changes

  /**
   * Effect to handle cleanup when component unmounts
   */
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
      {/* Large countdown number with pulsing animation */}
      <div className="text-6xl font-bold text-red-200 mb-3 animate-pulse">
        {countdown}
      </div>
      
      {/* Countdown description */}
      <p className="text-red-200 text-sm font-semibold">
        Exam will auto-submit in {countdown} second{countdown !== 1 ? 's' : ''}!
      </p>
      
      {/* Additional instruction text */}
      <p className="text-red-300 text-xs mt-2">
        Return to fullscreen mode to cancel auto-submission
      </p>
      
      {/* Debug information (only shown when debug prop is true) */}
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
