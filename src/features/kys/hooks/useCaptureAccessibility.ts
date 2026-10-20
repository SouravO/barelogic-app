/**
 * Accessibility hook for guided capture
 * Provides audio announcements and haptic feedback
 */

import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';

export interface CaptureAccessibilityResult {
  /** Announce instruction via text-to-speech */
  announceInstruction: (message: string) => Promise<void>;
  /** Play haptic feedback for pose detected */
  playPoseDetectedFeedback: () => Promise<void>;
  /** Play haptic feedback + announcement for photo captured */
  playPhotoCaptureFeedback: () => Promise<void>;
  /** Play haptic feedback for error */
  playErrorFeedback: () => Promise<void>;
  /** Play haptic feedback for countdown tick */
  playCountdownTickFeedback: () => Promise<void>;
  /** Stop any ongoing speech */
  stopAnnouncement: () => void;
  /** Whether speech is currently active */
  isSpeaking: boolean;
}

/**
 * Hook for accessibility features during guided capture
 * 
 * @param enabled - Whether accessibility features are enabled (default: true)
 * @returns Accessibility control functions
 */
export function useCaptureAccessibility(enabled: boolean = true): CaptureAccessibilityResult {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const announcementQueueRef = useRef<string[]>([]);
  const isProcessingQueueRef = useRef(false);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const DEBOUNCE_DELAY_MS = 800;

  /**
   * Process announcement queue to avoid overlapping speech
   */
  const processAnnouncementQueue = useCallback(async () => {
    if (isProcessingQueueRef.current || announcementQueueRef.current.length === 0) {
      return;
    }

    isProcessingQueueRef.current = true;
    setIsSpeaking(true);

    while (announcementQueueRef.current.length > 0) {
      const message = announcementQueueRef.current.shift();
      if (message) {
        try {
          await Speech.speak(message, {
            language: 'en',
            pitch: 1.0,
            rate: 0.9, // Slightly slower for clarity
          });
        } catch (error) {
          console.warn('Speech synthesis error:', error);
        }
        
        // Small delay between announcements
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
    }

    setIsSpeaking(false);
    isProcessingQueueRef.current = false;
  }, []);

  /**
   * Announce instruction via text-to-speech
   */
  const announceInstruction = useCallback(
    (message: string) => {
      if (!enabled) return;

      // Debounce: cancel pending announcement and reschedule
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        announcementQueueRef.current.push(message);
        processAnnouncementQueue();
        debounceTimerRef.current = null;
      }, DEBOUNCE_DELAY_MS);
    },
    [enabled, processAnnouncementQueue]
  );

  /**
   * Stop any ongoing speech
   */
  const stopAnnouncement = useCallback(() => {
    announcementQueueRef.current = [];
    Speech.stop();
    setIsSpeaking(false);
    isProcessingQueueRef.current = false;
  }, []);

  /**
   * Play haptic feedback for pose detected
   * Light pulse to indicate system is tracking
   */
  const playPoseDetectedFeedback = useCallback(async () => {
    if (!enabled) return;

    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      // Haptics may not be available on all devices
      console.warn('Haptics error:', error);
    }
  }, [enabled]);

  /**
   * Play haptic feedback + announcement for photo captured
   * Strong pulse + success sound
   */
  const playPhotoCaptureFeedback = useCallback(async () => {
    if (!enabled) return;

    try {
      // Success haptic
      if (Platform.OS === 'ios') {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }

      // Announce capture
    } catch (error) {
      console.warn('Capture feedback error:', error);
    }
  }, [enabled, announceInstruction]);

  /**
   * Play haptic feedback for error
   * Warning haptic pattern
   */
  const playErrorFeedback = useCallback(async () => {
    if (!enabled) return;

    try {
      if (Platform.OS === 'ios') {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } else {
        // Android: double pulse to indicate error
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        await new Promise((resolve) => setTimeout(resolve, 100));
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }
    } catch (error) {
      console.warn('Error feedback error:', error);
    }
  }, [enabled]);

  /**
   * Play haptic feedback for countdown tick (3, 2, 1)
   * Medium pulse for each number
   */
  const playCountdownTickFeedback = useCallback(async () => {
    if (!enabled) return;

    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error) {
      console.warn('Countdown feedback error:', error);
    }
  }, [enabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      stopAnnouncement();
    };
  }, [stopAnnouncement]);

  return {
    announceInstruction,
    playPoseDetectedFeedback,
    playPhotoCaptureFeedback,
    playErrorFeedback,
    playCountdownTickFeedback,
    stopAnnouncement,
    isSpeaking,
  };
}
