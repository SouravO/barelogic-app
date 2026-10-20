/**
 * Pose validation utilities for determining if head pose matches target
 */

import type { HeadPose, PoseThresholds, TargetPose } from '../types/selfie-capture.types';
import { DEFAULT_THRESHOLDS } from '../types/selfie-capture.types';

// Allow custom thresholds to be set (useful for calibration)
let customThresholds: PoseThresholds | null = null;

/**
 * Set custom pose thresholds (overrides defaults)
 * Used by calibration mode
 */
export function setCustomThresholds(thresholds: PoseThresholds | null): void {
  customThresholds = thresholds;
}

/**
 * Get currently active thresholds (custom or default)
 */
export function getActiveThresholds(): PoseThresholds {
  return customThresholds || DEFAULT_THRESHOLDS;
}

/**
 * Validate if the current head pose matches the target pose
 * 
 * @param headPose - Current head orientation
 * @param targetPose - Desired pose (front, left, right)
 * @param thresholds - Optional custom thresholds (uses active if not provided)
 * @returns True if pose is within acceptable range
 */
export function validatePose(
  headPose: HeadPose,
  targetPose: TargetPose,
  thresholds?: PoseThresholds
): boolean {
  const activeThresholds = thresholds || getActiveThresholds();
  const poseThreshold = activeThresholds[targetPose];

  const yawInRange =
    headPose.yaw >= poseThreshold.yaw[0] && headPose.yaw <= poseThreshold.yaw[1];
  const pitchInRange =
    headPose.pitch >= poseThreshold.pitch[0] && headPose.pitch <= poseThreshold.pitch[1];

  return yawInRange && pitchInRange;
}

/**
 * Get user-friendly feedback message based on current pose vs target
 * 
 * @param headPose - Current head orientation
 * @param targetPose - Desired pose
 * @returns Helpful guidance message
 */
export function getFeedbackMessage(headPose: HeadPose, targetPose: TargetPose): string {
  const thresholds = getActiveThresholds();
  const poseThreshold = thresholds[targetPose];

  // Check if already valid
  if (validatePose(headPose, targetPose)) {
    return getSuccessMessage(targetPose);
  }

  // Determine what adjustment is needed
  const yawError = calculateYawError(headPose.yaw, poseThreshold.yaw);
  const pitchError = calculatePitchError(headPose.pitch, poseThreshold.pitch);

  // Prioritize the larger error
  if (Math.abs(yawError) > Math.abs(pitchError)) {
    return getYawFeedback(yawError, targetPose);
  } else if (Math.abs(pitchError) > 5) {
    // Only give pitch feedback if it's significant
    return getPitchFeedback(pitchError);
  } else {
    return getYawFeedback(yawError, targetPose);
  }
}

/**
 * Calculate how far off the pose is (0-100 scale)
 * Lower is better, 0 means perfect
 * 
 * @param headPose - Current head orientation
 * @param targetPose - Desired pose
 * @returns Deviation score (0 = perfect, 100 = very far off)
 */
export function calculatePoseDeviation(headPose: HeadPose, targetPose: TargetPose): number {
  const thresholds = getActiveThresholds();
  const poseThreshold = thresholds[targetPose];

  const yawError = calculateYawError(headPose.yaw, poseThreshold.yaw);
  const pitchError = calculatePitchError(headPose.pitch, poseThreshold.pitch);

  // Normalize errors to 0-100 scale
  // Assume max deviation of 90 degrees for yaw and 45 for pitch
  const normalizedYawError = Math.min(Math.abs(yawError) / 90, 1) * 100;
  const normalizedPitchError = Math.min(Math.abs(pitchError) / 45, 1) * 100;

  // Weight yaw more heavily than pitch for this use case
  const deviation = normalizedYawError * 0.7 + normalizedPitchError * 0.3;

  return Math.round(Math.min(deviation, 100));
}

/**
 * Check if face is roughly centered (good starting position)
 * 
 * @param headPose - Current head orientation
 * @returns True if face is in neutral-ish position
 */
export function isFaceCentered(headPose: HeadPose): boolean {
  // More lenient than front pose - just check if reasonably centered
  return Math.abs(headPose.yaw) < 20 && Math.abs(headPose.pitch) < 25;
}

/**
 * Get the closest matching pose for current head orientation
 * Useful for determining which pose user is attempting
 * 
 * @param headPose - Current head orientation
 * @returns The pose that best matches current orientation
 */
export function getClosestPose(headPose: HeadPose): TargetPose {
  const poses: TargetPose[] = ['front', 'left', 'right'];
  
  let closestPose: TargetPose = 'front';
  let minDeviation = Infinity;

  for (const pose of poses) {
    const deviation = calculatePoseDeviation(headPose, pose);
    if (deviation < minDeviation) {
      minDeviation = deviation;
      closestPose = pose;
    }
  }

  return closestPose;
}

// ============================================================================
// Helper Functions
// ============================================================================

function calculateYawError(currentYaw: number, targetRange: [number, number]): number {
  if (currentYaw < targetRange[0]) {
    return currentYaw - targetRange[0]; // Negative = need to turn more positive
  } else if (currentYaw > targetRange[1]) {
    return currentYaw - targetRange[1]; // Positive = need to turn more negative
  }
  return 0; // Within range
}

function calculatePitchError(currentPitch: number, targetRange: [number, number]): number {
  if (currentPitch < targetRange[0]) {
    return currentPitch - targetRange[0];
  } else if (currentPitch > targetRange[1]) {
    return currentPitch - targetRange[1];
  }
  return 0;
}

function getYawFeedback(yawError: number, targetPose: TargetPose): string {
  if (targetPose === 'front') {
    if (yawError < 0) {
      return 'Turn your head slightly to the left';
    } else {
      return 'Turn your head slightly to the right';
    }
  } else if (targetPose === 'left') {
    if (yawError < 0) {
      return 'Turn your head more to the left';
    } else {
      return 'Turn your head back to center a bit';
    }
  } else {
    // right
    if (yawError > 0) {
      return 'Turn your head more to the right';
    } else {
      return 'Turn your head back to center a bit';
    }
  }
}

function getPitchFeedback(pitchError: number): string {
  if (pitchError < 0) {
    return 'Lift your chin up slightly';
  } else {
    return 'Lower your chin slightly';
  }
}

function getSuccessMessage(targetPose: TargetPose): string {
  switch (targetPose) {
    case 'front':
      return 'Perfect! Hold still...';
    case 'left':
      return 'Great! Hold that position...';
    case 'right':
      return 'Excellent! Hold steady...';
  }
}

/**
 * Format pose angles for debugging display
 */
export function formatPoseForDebug(headPose: HeadPose): string {
  return `Yaw: ${headPose.yaw.toFixed(1)}° | Pitch: ${headPose.pitch.toFixed(1)}° | Roll: ${headPose.roll.toFixed(1)}°`;
}

/**
 * Check if two poses are significantly different
 * Used to avoid unnecessary state updates
 */
export function hasSignificantPoseChange(
  oldPose: HeadPose | null,
  newPose: HeadPose,
  threshold: number = 2
): boolean {
  if (!oldPose) return true;

  const yawDiff = Math.abs(newPose.yaw - oldPose.yaw);
  const pitchDiff = Math.abs(newPose.pitch - oldPose.pitch);
  const rollDiff = Math.abs(newPose.roll - oldPose.roll);

  return yawDiff > threshold || pitchDiff > threshold || rollDiff > threshold;
}
