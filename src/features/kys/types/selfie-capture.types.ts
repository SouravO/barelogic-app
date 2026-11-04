/**
 * Type definitions for the Face ID-style circular selfie capture
 */

/**
 * Head pose orientation (Euler angles in degrees), already normalized so that
 * positive yaw = user turned to THEIR left, positive pitch = looking up.
 */
export interface HeadPose {
  yaw: number;
  pitch: number;
  roll: number;
}

/** Face rectangle in camera-view coordinates (dp). */
export interface FaceBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Angles we save a photo for. Order matches the photo slots. */
export type TargetPose = 'front' | 'left' | 'right';
export const TARGET_POSES: readonly TargetPose[] = ['front', 'left', 'right'];

/** Photo slot index: 0 = Front, 1 = Left, 2 = Right */
export type PhotoSlot = 0 | 1 | 2;

export type CapturedImages = [string | null, string | null, string | null];

export type CaptureMode = 'automatic' | 'manual';

/**
 * Phases of the circular sweep:
 * intro → scanning → complete (short success animation) → review
 */
export type SweepPhase = 'intro' | 'scanning' | 'complete' | 'review';

/** Inclusive angle window for a capture bin, in degrees. */
export interface PoseBin {
  yaw: [number, number];
  pitch: [number, number];
}

export interface SweepConfig {
  /** Number of tick segments around the ring */
  ringSegments: number;
  /** Head must be turned at least this far (deg) to fill a ring segment */
  ringFillMagnitude: number;
  /** Capture windows per pose */
  bins: Record<TargetPose, PoseBin>;
  /** Skip capture only while the head whips faster than this (deg per scan) */
  maxCaptureVelocity: number;
  /** EMA smoothing factor for the pose (0-1, higher = more responsive) */
  smoothing: number;
  /** Minimum eye-open probability for a photo */
  minEyeOpen: number;
  /** Show the manual fallback after this long without finishing (ms) */
  manualFallbackMs: number;
  /** Give a directional nudge after this long without a new capture (ms) */
  nudgeAfterMs: number;
}

export const DEFAULT_SWEEP_CONFIG: SweepConfig = {
  ringSegments: 48,
  ringFillMagnitude: 12,
  bins: {
    front: { yaw: [-8, 8], pitch: [-10, 10] },
    left: { yaw: [22, 50], pitch: [-20, 20] },
    right: { yaw: [-50, -22], pitch: [-20, 20] },
  },
  maxCaptureVelocity: 12,
  smoothing: 0.6,
  minEyeOpen: 0.5,
  manualFallbackMs: 20000,
  nudgeAfterMs: 5000,
};

/** Result of the coarse "is the face usable" check */
export type PositionIssue = 'none' | 'noFace' | 'multipleFaces' | 'tooFar' | 'tooClose' | 'offCenter';
