/**
 * Guided capture state machine hook
 * Orchestrates the entire automatic capture sequence
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  CaptureInstruction,
  FaceDetectionResult,
  GuidedCaptureConfig,
  HeadPose,
  PhotoSlot,
  TargetPose,
} from '../types/selfie-capture.types';
import { CaptureState, DEFAULT_CAPTURE_CONFIG } from '../types/selfie-capture.types';
import { getFeedbackMessage, hasSignificantPoseChange, validatePose } from '../utils/poseValidation';

export interface GuidedCaptureResult {
  /** Current state of capture process */
  state: CaptureState;
  /** Target pose for current capture */
  targetPose: TargetPose | null;
  /** Instruction for user */
  instruction: CaptureInstruction;
  /** Whether to show manual fallback button */
  showManualFallback: boolean;
  /** Captured image URIs */
  capturedImages: [string | null, string | null, string | null];
  /** Whether countdown is active */
  isCountingDown: boolean;
  /** Start the capture sequence */
  startCapture: () => void;
  /** Handle face detection result */
  handleFaceDetected: (result: FaceDetectionResult) => void;
  /** Handle countdown completion (triggers photo) */
  handleCountdownComplete: () => void;
  /** Handle photo taken (save and advance) */
  handlePhotoTaken: (uri: string) => void;
  /** Retake a specific photo */
  retakePhoto: (slot: PhotoSlot) => void;
  /** Enable manual capture mode */
  enableManualMode: () => void;
  /** Reset entire capture process */
  resetCapture: () => void;
  /** Whether valid pose is detected */
  isPoseValid: boolean;
}

/**
 * Hook for managing guided capture state machine
 */
export function useGuidedCapture(
  config: Partial<GuidedCaptureConfig> = {}
): GuidedCaptureResult {
  const fullConfig = { ...DEFAULT_CAPTURE_CONFIG, ...config };

  // State
  const [state, setState] = useState<CaptureState>(CaptureState.INITIALIZING);
  const [targetPose, setTargetPose] = useState<TargetPose | null>(null);
  const [capturedImages, setCapturedImages] = useState<[string | null, string | null, string | null]>([
    null,
    null,
    null,
  ]);
  const [isPoseValid, setIsPoseValid] = useState(false);
  const [showManualFallback, setShowManualFallback] = useState(false);
  const [isCountingDown, setIsCountingDown] = useState(false);

  // Refs
  const lastValidPoseTimeRef = useRef<number>(0);
  const currentHeadPoseRef = useRef<HeadPose | null>(null);
  const stateStartTimeRef = useRef<number>(Date.now());
  const retakeModeRef = useRef<PhotoSlot | null>(null);
  const manualModeRef = useRef(false);

  /**
   * Get current instruction based on state
   */
  const getInstruction = useCallback((): CaptureInstruction => {
    // Manual mode
    if (manualModeRef.current) {
      return {
        text: 'Tap the button below to capture',
        icon: 'gesture-tap',
        type: 'info',
      };
    }

    switch (state) {
      case CaptureState.INITIALIZING:
        return { text: 'Preparing camera...', icon: 'loading', type: 'info' };

      case CaptureState.WAITING_FOR_FACE:
        return {
          text: 'Position your face inside the guide',
          icon: 'face-recognition',
          type: 'waiting',
        };

      case CaptureState.DETECTING_FRONT:
        if (!isPoseValid && currentHeadPoseRef.current && targetPose) {
          return {
            text: getFeedbackMessage(currentHeadPoseRef.current, targetPose),
            icon: 'information',
            type: 'guidance',
          };
        }
        return { text: 'Look straight into the camera', icon: 'face-man', type: 'guidance' };

      case CaptureState.COUNTDOWN_FRONT:
        return { text: 'Perfect!', icon: 'check-circle', type: 'success' };

      case CaptureState.DETECTING_LEFT:
        if (!isPoseValid && currentHeadPoseRef.current && targetPose) {
          return {
            text: getFeedbackMessage(currentHeadPoseRef.current, targetPose),
            icon: 'information',
            type: 'guidance',
          };
        }
        return {
          text: 'Slowly turn your head to the left',
          icon: 'arrow-left',
          type: 'guidance',
        };

      case CaptureState.COUNTDOWN_LEFT:
        return { text: 'Great! Hold that position…', icon: 'check-circle', type: 'success' };

      case CaptureState.DETECTING_RIGHT:
        if (!isPoseValid && currentHeadPoseRef.current && targetPose) {
          return {
            text: getFeedbackMessage(currentHeadPoseRef.current, targetPose),
            icon: 'information',
            type: 'guidance',
          };
        }
        return {
          text: 'Slowly turn your head to the right',
          icon: 'arrow-right',
          type: 'guidance',
        };

      case CaptureState.COUNTDOWN_RIGHT:
        return { text: 'Excellent! Hold steady...', icon: 'check-circle', type: 'success' };

      case CaptureState.CAPTURING_FRONT:
      case CaptureState.CAPTURING_LEFT:
      case CaptureState.CAPTURING_RIGHT:
        return { text: 'Capturing...', icon: 'camera', type: 'info' };

      case CaptureState.PHOTO_REVIEW:
        return {
          text: 'All photos captured! Review and start analysis',
          icon: 'check-all',
          type: 'success',
        };

      default:
        return { text: '', icon: 'information', type: 'info' };
    }
  }, [state, isPoseValid, targetPose]);

  /**
   * Start capture sequence
   */
  const startCapture = useCallback(() => {
    setState(CaptureState.WAITING_FOR_FACE);
    setTargetPose('front');
    stateStartTimeRef.current = Date.now();
    setShowManualFallback(false);
    manualModeRef.current = false;
  }, []);

  /**
   * Handle face detection result
   */
  const handleFaceDetected = useCallback(
    (result: FaceDetectionResult) => {
      // Ignore if in manual mode or wrong state
      if (
        manualModeRef.current ||
        state === CaptureState.PHOTO_REVIEW ||
        state === CaptureState.INITIALIZING ||
        state === CaptureState.CAPTURING_FRONT ||
        state === CaptureState.CAPTURING_LEFT ||
        state === CaptureState.CAPTURING_RIGHT
      ) {
        return;
      }

      // Update current pose ref
      if (result.headPose && hasSignificantPoseChange(currentHeadPoseRef.current, result.headPose)) {
        currentHeadPoseRef.current = result.headPose;
      }

      // No face detected
      if (!result.faceDetected || result.faceCount === 0) {
        setIsPoseValid(false);
        // If we were detecting, go back to waiting
        if (
          state === CaptureState.DETECTING_FRONT ||
          state === CaptureState.DETECTING_LEFT ||
          state === CaptureState.DETECTING_RIGHT
        ) {
          setState(CaptureState.WAITING_FOR_FACE);
        }
        return;
      }

      // Multiple faces detected
      if (result.faceCount > 1) {
        setIsPoseValid(false);
        return;
      }

      // Single face detected - check pose
      if (result.headPose && targetPose) {
        const isValid = validatePose(result.headPose, targetPose, fullConfig.thresholds);
        setIsPoseValid(isValid);

        if (isValid) {
          lastValidPoseTimeRef.current = Date.now();
        }

        // Transition to countdown if pose is valid
        if (isValid && !isCountingDown) {
          if (state === CaptureState.DETECTING_FRONT) {
            setState(CaptureState.COUNTDOWN_FRONT);
            setIsCountingDown(true);
          } else if (state === CaptureState.DETECTING_LEFT) {
            setState(CaptureState.COUNTDOWN_LEFT);
            setIsCountingDown(true);
          } else if (state === CaptureState.DETECTING_RIGHT) {
            setState(CaptureState.COUNTDOWN_RIGHT);
            setIsCountingDown(true);
          }
        }

        // If in waiting state and face is detected, move to detecting
        if (state === CaptureState.WAITING_FOR_FACE) {
          if (targetPose === 'front') {
            setState(CaptureState.DETECTING_FRONT);
          } else if (targetPose === 'left') {
            setState(CaptureState.DETECTING_LEFT);
          } else if (targetPose === 'right') {
            setState(CaptureState.DETECTING_RIGHT);
          }
        }
      }
    },
    [state, targetPose, isCountingDown, fullConfig.thresholds]
  );

  /**
   * Handle countdown completion
   */
  const handleCountdownComplete = useCallback(() => {
    setIsCountingDown(false);

    // Transition to capturing state
    if (state === CaptureState.COUNTDOWN_FRONT) {
      setState(CaptureState.CAPTURING_FRONT);
    } else if (state === CaptureState.COUNTDOWN_LEFT) {
      setState(CaptureState.CAPTURING_LEFT);
    } else if (state === CaptureState.COUNTDOWN_RIGHT) {
      setState(CaptureState.CAPTURING_RIGHT);
    }
  }, [state]);

  /**
   * Handle photo taken
   */
  const handlePhotoTaken = useCallback(
    (uri: string) => {
      // Determine which slot to save to
      let slot: PhotoSlot;
      if (state === CaptureState.CAPTURING_FRONT || targetPose === 'front') {
        slot = 0;
      } else if (state === CaptureState.CAPTURING_LEFT || targetPose === 'left') {
        slot = 1;
      } else {
        slot = 2;
      }

      // Save photo
      setCapturedImages((prev) => {
        const next: [string | null, string | null, string | null] = [...prev];
        next[slot] = uri;
        return next;
      });

      // If in retake mode, return to review
      if (retakeModeRef.current !== null) {
        retakeModeRef.current = null;
        setState(CaptureState.PHOTO_REVIEW);
        setTargetPose(null);
        return;
      }

      // Advance to next pose
      if (slot === 0) {
        // Front captured, move to left
        setState(CaptureState.DETECTING_LEFT);
        setTargetPose('left');
        setShowManualFallback(false);
        stateStartTimeRef.current = Date.now();
      } else if (slot === 1) {
        // Left captured, move to right
        setState(CaptureState.DETECTING_RIGHT);
        setTargetPose('right');
        setShowManualFallback(false);
        stateStartTimeRef.current = Date.now();
      } else {
        // All photos captured
        setState(CaptureState.PHOTO_REVIEW);
        setTargetPose(null);
      }

      setIsPoseValid(false);
    },
    [state, targetPose]
  );

  /**
   * Retake a specific photo
   */
  const retakePhoto = useCallback((slot: PhotoSlot) => {
    retakeModeRef.current = slot;

    // Clear the captured image for this slot so UI no longer shows it/tick
    setCapturedImages((prev) => {
      const next: [string | null, string | null, string | null] = [...prev];
      next[slot] = null;
      return next;
    });

    // Set appropriate target pose
    const poses: TargetPose[] = ['front', 'left', 'right'];
    setTargetPose(poses[slot]);

    // Move to detecting state for that pose
    const detectingStates = [
      CaptureState.DETECTING_FRONT,
      CaptureState.DETECTING_LEFT,
      CaptureState.DETECTING_RIGHT,
    ];
    setState(detectingStates[slot]);

    setShowManualFallback(false);
    stateStartTimeRef.current = Date.now();
    setIsPoseValid(false);
  }, []);

  /**
   * Enable manual capture mode
   */
  const enableManualMode = useCallback(() => {
    manualModeRef.current = true;
    setState(CaptureState.MANUAL_FALLBACK);
    setShowManualFallback(false);
    setIsCountingDown(false);
  }, []);

  /**
   * Reset capture
   */
  const resetCapture = useCallback(() => {
    setState(CaptureState.INITIALIZING);
    setTargetPose(null);
    setCapturedImages([null, null, null]);
    setIsPoseValid(false);
    setShowManualFallback(false);
    setIsCountingDown(false);
    retakeModeRef.current = null;
    manualModeRef.current = false;
    currentHeadPoseRef.current = null;
  }, []);

  /**
   * Monitor timeout for manual fallback
   */
  useEffect(() => {
    if (
      !manualModeRef.current &&
      (state === CaptureState.DETECTING_FRONT ||
        state === CaptureState.DETECTING_LEFT ||
        state === CaptureState.DETECTING_RIGHT)
    ) {
      const checkTimeout = setInterval(() => {
        const elapsed = Date.now() - stateStartTimeRef.current;
        if (elapsed > fullConfig.manualFallbackTimeout) {
          setShowManualFallback(true);
        }
      }, 1000);

      return () => clearInterval(checkTimeout);
    } else {
      setShowManualFallback(false);
    }
  }, [state, fullConfig.manualFallbackTimeout]);

  /**
   * Cancel countdown if pose becomes invalid
   */
  useEffect(() => {
    if (isCountingDown && !isPoseValid) {
      setIsCountingDown(false);
      // Move back to detecting state
      if (state === CaptureState.COUNTDOWN_FRONT) {
        setState(CaptureState.DETECTING_FRONT);
      } else if (state === CaptureState.COUNTDOWN_LEFT) {
        setState(CaptureState.DETECTING_LEFT);
      } else if (state === CaptureState.COUNTDOWN_RIGHT) {
        setState(CaptureState.DETECTING_RIGHT);
      }
    }
  }, [isCountingDown, isPoseValid, state]);

  return {
    state,
    targetPose,
    instruction: getInstruction(),
    showManualFallback,
    capturedImages,
    isCountingDown,
    startCapture,
    handleFaceDetected,
    handleCountdownComplete,
    handlePhotoTaken,
    retakePhoto,
    enableManualMode,
    resetCapture,
    isPoseValid,
  };
}
