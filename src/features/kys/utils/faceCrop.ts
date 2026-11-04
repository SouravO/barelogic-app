/**
 * Crop a preview snapshot down to the face so users don't need to be
 * perfectly centered and the analysis gets face-filling images.
 */

import type { FaceBounds } from '../types/selfie-capture.types';

/** Extra room around the detected face box, as a fraction of its size (per side). */
const FACE_MARGIN = 0.35;

export interface PixelRect {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

/**
 * Map face bounds from camera-view coordinates into image pixels and expand
 * them into a padded square, clamped to the image. Returns null if the result
 * would be degenerate (caller should keep the full image).
 */
export function faceCropRect(
  bounds: FaceBounds,
  view: { width: number; height: number },
  image: { width: number; height: number }
): PixelRect | null {
  if (view.width <= 0 || view.height <= 0) return null;

  const sx = image.width / view.width;
  const sy = image.height / view.height;

  const cx = (bounds.x + bounds.width / 2) * sx;
  const cy = (bounds.y + bounds.height / 2) * sy;
  const side = Math.max(bounds.width * sx, bounds.height * sy) * (1 + FACE_MARGIN * 2);
  const half = Math.min(side, image.width, image.height) / 2;

  const startX = Math.round(Math.max(0, Math.min(cx - half, image.width - half * 2)));
  const startY = Math.round(Math.max(0, Math.min(cy - half, image.height - half * 2)));
  const endX = Math.round(Math.min(image.width, startX + half * 2));
  const endY = Math.round(Math.min(image.height, startY + half * 2));

  if (endX - startX < 64 || endY - startY < 64) return null;
  return { startX, startY, endX, endY };
}
