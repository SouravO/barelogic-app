/**
 * Type definitions for automatic guided selfie capture system
 */

/**
 * Capture state machine states
 */
export enum CaptureState {
  INITIALIZING = 'INITIALIZING',
  WAITING_FOR_FACE = 'WAITING_FOR_FACE',
  DETECTING_FRONT = 'DETECTING_FRONT',
  COUNTDOWN_FRONT = 'COUNTDOWN_FRONT',
  CAPTURING_FRONT = 'CAPTURING_FRONT',
  DETECTING_LEFT = 'DETECTING_LEFT',
  COUNTDOWN_LEFT = 'COUNTDOWN_LEFT',
  CAPTURING_LEFT = 'CAPTURING_LEFT',
  DETECTING_RIGHT = 'DETECTING_RIGHT',
  COUNTDOWN_RIGHT = 'COUNTDOWN_RIGHT',
  CAPTURING_RIGHT = 'CAPTURING_RIGHT',
  PHOTO_REVIEW = 'PHOTO_REVIEW',
  MANUAL_FALLBACK = 'MANUAL_FALLBACK',
  ANALYSIS = 'ANALYSIS',
}

/**
 * Head pose orientation (Euler angles in degrees)
 */
export interface HeadPose {
  /** Yaw: left/right rotation (-90 to +90, negative = right turn, positive = left turn) */
  yaw: number;
  /** Pitch: up/down tilt (-90 to +90, negative = looking down, positive = looking up) */
  pitch: number;
  /** Roll: head tilt (-90 to +90, negative = tilt right, positive = tilt left) */
  roll: number;
}

/**
 * Face detection result
 */
export interface FaceDetectionResult {
  /** Whether a face is detected */
  faceDetected: boolean;
  /** Number of faces detected */
  faceCount: number;
  /** Face bounding box (normalized 0-1) */
  bounds?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  /** Head pose orientation */
  headPose?: HeadPose;
  /** Confidence score (0-1) */
  confidence?: number;
}

/**
 * Pose validation thresholds
 */
export interface PoseThresholds {
  front: {
    yaw: [number, number]; // min, max range in degrees
    pitch: [number, number];
  };
  left: {
    yaw: [number, number];
    pitch: [number, number];
  };
  right: {
    yaw: [number, number];
    pitch: [number, number];
  };
}

/**
 * Default pose thresholds (moderate angles, calibratable)
 */
export const DEFAULT_THRESHOLDS: PoseThresholds = {
  front: { yaw: [-10, 10], pitch: [-15, 15] },
  left: { yaw: [30, 45], pitch: [-15, 15] },
  right: { yaw: [-45, -30], pitch: [-15, 15] },
};

/**
 * Target pose for capture
 */
export type TargetPose = 'front' | 'left' | 'right';

/**
 * Countdown state
 */
export type CountdownState = 'IDLE' | 'COUNTING' | 'CAPTURING';

/**
 * Visual feedback for countdown
 */
export interface CountdownVisuals {
  /** Current countdown number */
  number: 3 | 2 | 1 | null;
  /** Border color for face guide */
  borderColor: string;
  /** Border width in pixels */
  borderWidth: number;
  /** Scale pulse animation value (1.0 - 1.05) */
  pulseScale: number;
  /** Progress from 0 to 1 */
  progress: number;
}

/**
 * Capture mode
 */
export type CaptureMode = 'automatic' | 'manual';

/**
 * Photo slot for retake functionality
 */
export type PhotoSlot = 0 | 1 | 2; // Front, Left, Right

/**
 * Guided capture configuration
 */
export interface GuidedCaptureConfig {
  /** Countdown duration in milliseconds */
  countdownDuration: number;
  /** Timeout before showing manual fallback (milliseconds) */
  manualFallbackTimeout: number;
  /** Pose validation thresholds */
  thresholds: PoseThresholds;
  /** Enable accessibility features */
  enableAccessibility: boolean;
  /** Detection frame rate throttle (fps) */
  detectionFps: number;
}

/**
 * Default guided capture configuration
 */
export const DEFAULT_CAPTURE_CONFIG: GuidedCaptureConfig = {
  countdownDuration: 3000, // 3 seconds
  manualFallbackTimeout: 18000, // 18 seconds
  thresholds: DEFAULT_THRESHOLDS,
  enableAccessibility: true,
  detectionFps: 12,
};

/**
 * Capture instruction message
 */
export interface CaptureInstruction {
  /** Primary instruction text */
  text: string;
  /** Icon name for MaterialCommunityIcons */
  icon?: string;
  /** Instruction type for styling */
  type: 'info' | 'guidance' | 'success' | 'error' | 'waiting';
}

/**
 * Face detection service interface
 */
export interface FaceDetectionService {
  /** Start detection with callback */
  startDetection(onDetected: (result: FaceDetectionResult) => void): void;
  /** Stop detection and cleanup */
  stopDetection(): void;
  /** Whether detection is currently active */
  isActive: boolean;
}
