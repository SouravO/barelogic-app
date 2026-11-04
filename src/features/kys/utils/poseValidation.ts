/**
 * Pose helpers for the circular sweep capture
 */

import type { FaceBounds, HeadPose, PoseBin, PositionIssue } from '../types/selfie-capture.types';

/**
 * Sign applied to ML Kit's raw yaw so that positive = user turned to their own left.
 * If Left/Right photos land in the wrong slot on a device, flip this to -1.
 */
export const YAW_SIGN = 1;

/** Convert raw detector angles into our normalized HeadPose. */
export function normalizePose(rawYaw: number, rawPitch: number, rawRoll: number): HeadPose {
  return { yaw: rawYaw * YAW_SIGN, pitch: rawPitch, roll: rawRoll };
}

/** Exponential moving average to remove frame-to-frame jitter. */
export function smoothPose(prev: HeadPose | null, next: HeadPose, alpha: number): HeadPose {
  if (!prev) return next;
  return {
    yaw: prev.yaw + alpha * (next.yaw - prev.yaw),
    pitch: prev.pitch + alpha * (next.pitch - prev.pitch),
    roll: prev.roll + alpha * (next.roll - prev.roll),
  };
}

/** Angular motion between two consecutive smoothed poses (deg per scan). */
export function poseVelocity(prev: HeadPose | null, next: HeadPose): number {
  if (!prev) return 0;
  return Math.abs(next.yaw - prev.yaw) + Math.abs(next.pitch - prev.pitch);
}

/** Whether the pose is inside a bin, widened by `tolerance` degrees. */
export function isInBin(pose: HeadPose, bin: PoseBin, tolerance = 0): boolean {
  return (
    pose.yaw >= bin.yaw[0] - tolerance &&
    pose.yaw <= bin.yaw[1] + tolerance &&
    pose.pitch >= bin.pitch[0] - tolerance &&
    pose.pitch <= bin.pitch[1] + tolerance
  );
}

/**
 * Screen-space angle (radians, 0 = right, clockwise because screen y grows down)
 * of where the user's nose points on the mirrored front preview.
 * Returns null when the head is too close to straight-on to have a direction.
 */
export function poseToRingAngle(pose: HeadPose, minMagnitude: number): number | null {
  // Mirrored preview: user's left shows on screen left (-x); looking up is screen up (-y).
  const dx = -pose.yaw;
  const dy = -pose.pitch;
  if (Math.hypot(dx, dy) < minMagnitude) return null;
  const angle = Math.atan2(dy, dx);
  return angle < 0 ? angle + Math.PI * 2 : angle;
}

/** Ring segment index for a screen angle. */
export function angleToSegment(angle: number, segments: number): number {
  return Math.floor(angle / ((Math.PI * 2) / segments)) % segments;
}

/**
 * Coarse, forgiving position check relative to the on-screen circle.
 * Users only need to be roughly inside the circle at a sensible distance.
 */
export function checkFacePosition(
  faces: number,
  bounds: FaceBounds | undefined,
  circle: { cx: number; cy: number; diameter: number }
): PositionIssue {
  if (faces === 0 || !bounds) return 'noFace';
  if (faces > 1) return 'multipleFaces';

  const ratio = bounds.width / circle.diameter;
  if (ratio < 0.4) return 'tooFar';
  if (ratio > 1.15) return 'tooClose';

  const fx = bounds.x + bounds.width / 2;
  const fy = bounds.y + bounds.height / 2;
  if (Math.hypot(fx - circle.cx, fy - circle.cy) > circle.diameter * 0.35) return 'offCenter';

  return 'none';
}

export const POSITION_HINTS: Record<Exclude<PositionIssue, 'none'>, string> = {
  noFace: 'Position your face in the circle',
  multipleFaces: 'Only one face, please',
  tooFar: 'Move a little closer',
  tooClose: 'Move back a little',
  offCenter: 'Center your face in the circle',
};

/** Format pose angles for the dev-only debug overlay */
export function formatPoseForDebug(pose: HeadPose): string {
  return `yaw ${pose.yaw.toFixed(0)}°  pitch ${pose.pitch.toFixed(0)}°  roll ${pose.roll.toFixed(0)}°`;
}
