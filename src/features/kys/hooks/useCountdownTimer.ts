/**
 * Countdown timer hook for guided capture
 * Manages 3-2-1 countdown with cancellation support
 */

import { useCallback, useEffect, useRef, useState } from 'react';

export interface CountdownTimerResult {
  /** Current countdown value (3, 2, 1, or null when not counting) */
  countdownValue: 3 | 2 | 1 | null;
  /** Whether countdown is currently active */
  isCountingDown: boolean;
  /** Progress from 0 to 1 */
  progress: number;
  /** Start the countdown */
  startCountdown: (onComplete: () => void) => void;
  /** Cancel the countdown */
  cancelCountdown: () => void;
  /** Reset countdown state */
  resetCountdown: () => void;
}

/**
 * Hook for managing countdown timer with 3-2-1 progression
 * 
 * @param durationMs - Total countdown duration in milliseconds (default: 3000)
 * @returns Countdown state and control functions
 */
export function useCountdownTimer(durationMs: number = 3000): CountdownTimerResult {
  const [countdownValue, setCountdownValue] = useState<3 | 2 | 1 | null>(null);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [progress, setProgress] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const onCompleteRef = useRef<(() => void) | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Clear all intervals and timers
   */
  const clearTimers = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  /**
   * Start countdown from 3 to 1
   */
  const startCountdown = useCallback(
    (onComplete: () => void) => {
      // Clear any existing timers
      clearTimers();

      // Store callback
      onCompleteRef.current = onComplete;

      // Initialize state
      setIsCountingDown(true);
      setCountdownValue(3);
      setProgress(0);
      startTimeRef.current = Date.now();

      // Calculate interval for each step (divide total duration by 3)
      const stepDuration = durationMs / 3;

      // Track progress smoothly
      progressIntervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current;
        const newProgress = Math.min(elapsed / durationMs, 1);
        setProgress(newProgress);
      }, 50); // Update progress every 50ms for smooth animation

      // Countdown sequence: 3 -> 2 -> 1 -> complete
      let currentStep = 3;

      intervalRef.current = setInterval(() => {
        currentStep--;

        if (currentStep > 0) {
          setCountdownValue(currentStep as 3 | 2 | 1);
        } else {
          // Countdown complete
          clearTimers();
          setIsCountingDown(false);
          setCountdownValue(null);
          setProgress(1);

          // Call completion callback
          if (onCompleteRef.current) {
            onCompleteRef.current();
            onCompleteRef.current = null;
          }
        }
      }, stepDuration);
    },
    [durationMs, clearTimers]
  );

  /**
   * Cancel ongoing countdown
   */
  const cancelCountdown = useCallback(() => {
    clearTimers();
    setIsCountingDown(false);
    setCountdownValue(null);
    setProgress(0);
    onCompleteRef.current = null;
  }, [clearTimers]);

  /**
   * Reset countdown to initial state
   */
  const resetCountdown = useCallback(() => {
    clearTimers();
    setIsCountingDown(false);
    setCountdownValue(null);
    setProgress(0);
    onCompleteRef.current = null;
  }, [clearTimers]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  return {
    countdownValue,
    isCountingDown,
    progress,
    startCountdown,
    cancelCountdown,
    resetCountdown,
  };
}
