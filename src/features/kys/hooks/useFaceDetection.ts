/**
 * Face detection abstraction hook
 * Provides unified interface for mock and real detection
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { createMockDetector } from '../services/faceDetectionMock';
import type { FaceDetectionResult, FaceDetectionService } from '../types/selfie-capture.types';

export type FaceDetectionMode = 'mock' | 'real';

export interface FaceDetectionHookResult {
  /** Start detection with callback */
  startDetection: (onFaceDetected: (result: FaceDetectionResult) => void) => void;
  /** Stop detection */
  stopDetection: () => void;
  /** Whether detection is active */
  isActive: boolean;
  /** Current detection mode */
  mode: FaceDetectionMode;
  /** Latest detection result (for debugging) */
  latestResult: FaceDetectionResult | null;
}

/**
 * Hook for face detection with throttling and mode switching
 * 
 * @param mode - Detection mode ('mock' for simulation, 'real' for actual detection)
 * @param throttleFps - Limit callback rate to this FPS (default: 12)
 * @returns Face detection controls
 */
export function useFaceDetection(
  mode: FaceDetectionMode = 'mock',
  throttleFps: number = 12
): FaceDetectionHookResult {
  const [isActive, setIsActive] = useState(false);
  const [latestResult, setLatestResult] = useState<FaceDetectionResult | null>(null);

  const detectorRef = useRef<FaceDetectionService | null>(null);
  const callbackRef = useRef<((result: FaceDetectionResult) => void) | null>(null);
  const lastCallbackTimeRef = useRef<number>(0);
  const throttleIntervalMs = 1000 / throttleFps;

  /**
   * Create detector based on mode
   */
  const createDetector = useCallback((): FaceDetectionService => {
    if (mode === 'mock') {
      return createMockDetector({
        fps: 30, // Internal detection rate
        autoCycle: true,
        poseDuration: 3000,
      });
    } else {
      // Real detection not yet implemented
      // This would use react-native-vision-camera + vision-camera-face-detector
      console.warn('Real face detection not yet implemented. Falling back to mock.');
      return createMockDetector({
        fps: 30,
        autoCycle: true,
        poseDuration: 3000,
      });
    }
  }, [mode]);

  /**
   * Throttled callback wrapper
   */
  const throttledCallback = useCallback(
    (result: FaceDetectionResult) => {
      const now = Date.now();
      const timeSinceLastCallback = now - lastCallbackTimeRef.current;

      if (timeSinceLastCallback >= throttleIntervalMs) {
        lastCallbackTimeRef.current = now;
        setLatestResult(result);
        
        if (callbackRef.current) {
          callbackRef.current(result);
        }
      }
    },
    [throttleIntervalMs]
  );

  /**
   * Start detection
   */
  const startDetection = useCallback(
    (onFaceDetected: (result: FaceDetectionResult) => void) => {
      // Stop any existing detection
      if (detectorRef.current?.isActive) {
        detectorRef.current.stopDetection();
      }

      // Store callback
      callbackRef.current = onFaceDetected;

      // Create and start detector
      detectorRef.current = createDetector();
      detectorRef.current.startDetection(throttledCallback);
      
      setIsActive(true);
      lastCallbackTimeRef.current = Date.now();
    },
    [createDetector, throttledCallback]
  );

  /**
   * Stop detection
   */
  const stopDetection = useCallback(() => {
    if (detectorRef.current) {
      detectorRef.current.stopDetection();
      detectorRef.current = null;
    }
    callbackRef.current = null;
    setIsActive(false);
    setLatestResult(null);
  }, []);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (detectorRef.current?.isActive) {
        detectorRef.current.stopDetection();
      }
    };
  }, []);

  /**
   * Restart detection if mode changes
   */
  useEffect(() => {
    if (isActive && callbackRef.current) {
      const callback = callbackRef.current;
      stopDetection();
      startDetection(callback);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  return {
    startDetection,
    stopDetection,
    isActive,
    mode,
    latestResult,
  };
}
