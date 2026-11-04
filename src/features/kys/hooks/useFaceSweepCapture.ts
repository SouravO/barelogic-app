/**
 * Face ID-style sweep capture.
 *
 * The user slowly rolls their head; ring segments fill in the direction they
 * look, and a photo is taken automatically the first time the head is held
 * still inside each capture bin (front / left / right). No countdown and no
 * exact positioning: per-frame data lives in refs, React state only changes
 * when something visible changes.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  CapturedImages,
  CaptureMode,
  FaceBounds,
  HeadPose,
  PhotoSlot,
  PositionIssue,
  SweepConfig,
  SweepPhase,
  TargetPose,
} from '../types/selfie-capture.types';
import { DEFAULT_SWEEP_CONFIG, TARGET_POSES } from '../types/selfie-capture.types';
import {
  angleToSegment,
  checkFacePosition,
  isInBin,
  POSITION_HINTS,
  poseToRingAngle,
  poseVelocity,
  smoothPose,
} from '../utils/poseValidation';
import { useLatestRef } from './useLatestRef';

/** One detector callback, already reduced to the first face. */
export interface FaceScan {
  faceCount: number;
  bounds?: FaceBounds;
  pose?: HeadPose;
  leftEyeOpen?: number;
  rightEyeOpen?: number;
}

export interface SweepCircle {
  cx: number;
  cy: number;
  diameter: number;
}

export interface UseFaceSweepCaptureOptions {
  /** Take a photo for `pose`; resolve to a file URI, or null on failure. */
  capture: (pose: TargetPose, bounds: FaceBounds | undefined) => Promise<string | null>;
  /** Called after each automatic capture (haptics, sound). */
  onPoseCaptured?: (pose: TargetPose) => void;
  /** Called once every required pose has a photo. */
  onComplete?: () => void;
  config?: Partial<SweepConfig>;
}

const COMPLETE_ANIMATION_MS = 700;

const NUDGES: Record<TargetPose, string> = {
  front: 'Look straight at the camera',
  left: 'Turn your head a little more to your left',
  right: 'Turn your head a little more to your right',
};

const emptyRing = (n: number) => new Array<boolean>(n).fill(false);

export function useFaceSweepCapture({
  capture,
  onPoseCaptured,
  onComplete,
  config: configOverride,
}: UseFaceSweepCaptureOptions) {
  const config = { ...DEFAULT_SWEEP_CONFIG, ...configOverride };
  const configRef = useLatestRef(config);

  // ---- Visible state ----
  const [phase, setPhaseState] = useState<SweepPhase>('intro');
  const [mode, setMode] = useState<CaptureMode>('automatic');
  const [images, setImages] = useState<CapturedImages>([null, null, null]);
  const [ring, setRing] = useState<boolean[]>(() => emptyRing(config.ringSegments));
  const [instruction, setInstruction] = useState(POSITION_HINTS.noFace);
  const [positionIssue, setPositionIssue] = useState<PositionIssue>('noFace');
  const [showManualFallback, setShowManualFallback] = useState(false);
  const [debugPose, setDebugPose] = useState<HeadPose | null>(null);

  // ---- Per-frame refs ----
  const phaseRef = useRef<SweepPhase>('intro');
  const modeRef = useRef<CaptureMode>('automatic');
  const imagesRef = useRef<CapturedImages>([null, null, null]);
  const ringRef = useRef<boolean[]>(emptyRing(config.ringSegments));
  const smoothedRef = useRef<HeadPose | null>(null);
  const capturingRef = useRef(false);
  const generationRef = useRef(0);
  const scanStartedAtRef = useRef(0);
  const lastProgressAtRef = useRef(0);
  const completeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastDebugAtRef = useRef(0);

  const captureRef = useLatestRef(capture);
  const onPoseCapturedRef = useLatestRef(onPoseCaptured);
  const onCompleteRef = useLatestRef(onComplete);

  const setPhase = useCallback((next: SweepPhase) => {
    phaseRef.current = next;
    setPhaseState(next);
  }, []);

  const updateInstruction = useCallback((text: string) => {
    setInstruction((prev) => (prev === text ? prev : text));
  }, []);

  const missingPoses = useCallback(
    () => TARGET_POSES.filter((_, i) => imagesRef.current[i] === null),
    []
  );

  const resetTracking = useCallback(() => {
    smoothedRef.current = null;
    capturingRef.current = false;
    const blank = emptyRing(configRef.current.ringSegments);
    ringRef.current = blank;
    setRing(blank);
  }, [configRef]);

  const finish = useCallback(() => {
    const full = new Array<boolean>(configRef.current.ringSegments).fill(true);
    ringRef.current = full;
    setRing(full);
    setPhase('complete');
    updateInstruction('Done');
    setShowManualFallback(false);
    onCompleteRef.current?.();
    if (completeTimerRef.current) clearTimeout(completeTimerRef.current);
    completeTimerRef.current = setTimeout(() => setPhase('review'), COMPLETE_ANIMATION_MS);
  }, [configRef, onCompleteRef, setPhase, updateInstruction]);

  /** Store a photo in a slot (used by both auto and manual capture). */
  const setImage = useCallback(
    (slot: PhotoSlot, uri: string | null) => {
      const next: CapturedImages = [...imagesRef.current];
      next[slot] = uri;
      imagesRef.current = next;
      setImages(next);
      lastProgressAtRef.current = Date.now();
      if (uri && next.every(Boolean) && phaseRef.current === 'scanning') {
        if (modeRef.current === 'manual') setPhase('review');
        else finish();
      }
    },
    [finish, setPhase]
  );

  const takePhoto = useCallback(
    async (pose: TargetPose, bounds: FaceBounds | undefined) => {
      capturingRef.current = true;
      const generation = generationRef.current;
      try {
        const uri = await captureRef.current(pose, bounds);
        // Ignore results from a flow that was reset/retaken meanwhile.
        if (generation !== generationRef.current || !uri) return;
        onPoseCapturedRef.current?.(pose);
        setImage(TARGET_POSES.indexOf(pose) as PhotoSlot, uri);
      } finally {
        if (generation === generationRef.current) {
          capturingRef.current = false;
        }
      }
    },
    [captureRef, onPoseCapturedRef, setImage]
  );

  /** Feed one detector result. Call at ~10-15 fps. */
  const handleScan = useCallback(
    (scan: FaceScan, circle: SweepCircle) => {
      if (phaseRef.current !== 'scanning' || modeRef.current !== 'automatic') return;
      const cfg = configRef.current;
      const now = Date.now();

      const issue = checkFacePosition(scan.faceCount, scan.bounds, circle);
      setPositionIssue((prev) => (prev === issue ? prev : issue));
      if (issue !== 'none' || !scan.pose) {
        // Pause, but keep progress.
        smoothedRef.current = null;
        updateInstruction(POSITION_HINTS[issue === 'none' ? 'noFace' : issue]);
        return;
      }

      const prevPose = smoothedRef.current;
      const pose = smoothPose(prevPose, scan.pose, cfg.smoothing);
      smoothedRef.current = pose;
      const velocity = poseVelocity(prevPose, pose);

      if (__DEV__ && now - lastDebugAtRef.current > 250) {
        lastDebugAtRef.current = now;
        setDebugPose(pose);
      }

      // ---- Ring fill (visual progress) ----
      const angle = poseToRingAngle(pose, cfg.ringFillMagnitude);
      if (angle !== null) {
        const seg = angleToSegment(angle, cfg.ringSegments);
        const n = cfg.ringSegments;
        const toFill = [seg, (seg + 1) % n, (seg - 1 + n) % n];
        if (toFill.some((i) => !ringRef.current[i])) {
          const next = [...ringRef.current];
          toFill.forEach((i) => (next[i] = true));
          ringRef.current = next;
          setRing(next);
          lastProgressAtRef.current = now;
        }
      }

      // ---- Capture bins ----
      const missing = missingPoses();
      if (capturingRef.current || missing.length === 0) return;

      // Capture on the first good frame: use the raw pose (no smoothing lag).
      const raw = scan.pose;
      const bin = missing.find((p) => isInBin(raw, cfg.bins[p])) ?? null;

      let eyesOk = true;
      if (bin) {
        const l = scan.leftEyeOpen;
        const r = scan.rightEyeOpen;
        if (l !== undefined && r !== undefined) {
          // When turned, the far eye is hidden, so only one needs to read as open.
          const eye = bin === 'front' ? Math.min(l, r) : Math.max(l, r);
          eyesOk = eye >= cfg.minEyeOpen;
        }
      }

      // Only skip a frame during a very fast whip (would be blurred); the next
      // frame arrives ~50 ms later, so this never feels like holding.
      if (bin && eyesOk && velocity <= cfg.maxCaptureVelocity) {
        takePhoto(bin, scan.bounds);
        return;
      }

      // ---- Instruction ----
      if (bin && !eyesOk) {
        updateInstruction('Keep your eyes open');
      } else if (now - lastProgressAtRef.current > cfg.nudgeAfterMs) {
        updateInstruction(NUDGES[missing[0]]);
      } else if (missing.length === TARGET_POSES.length && !ringRef.current.some(Boolean)) {
        updateInstruction('Move your head slowly to complete the circle');
      } else {
        updateInstruction('Keep going — slowly');
      }
    },
    [configRef, missingPoses, takePhoto, updateInstruction]
  );

  /** Begin (or resume) automatic scanning for whatever slots are empty. */
  const start = useCallback(() => {
    generationRef.current += 1;
    resetTracking();
    modeRef.current = 'automatic';
    setMode('automatic');
    scanStartedAtRef.current = Date.now();
    lastProgressAtRef.current = Date.now();
    setShowManualFallback(false);
    updateInstruction(POSITION_HINTS.noFace);
    setPositionIssue('noFace');
    setPhase('scanning');
  }, [resetTracking, setPhase, updateInstruction]);

  /** Clear one slot and scan again for just that angle. */
  const retake = useCallback(
    (slot: PhotoSlot) => {
      const next: CapturedImages = [...imagesRef.current];
      next[slot] = null;
      imagesRef.current = next;
      setImages(next);
      if (modeRef.current === 'manual') {
        generationRef.current += 1;
        setPhase('scanning');
      } else {
        start();
      }
    },
    [setPhase, start]
  );

  const enableManualMode = useCallback(() => {
    generationRef.current += 1;
    capturingRef.current = false;
    modeRef.current = 'manual';
    setMode('manual');
    setShowManualFallback(false);
    if (phaseRef.current !== 'review') setPhase('scanning');
  }, [setPhase]);

  /** Back to the intro with no photos. */
  const reset = useCallback(() => {
    generationRef.current += 1;
    if (completeTimerRef.current) clearTimeout(completeTimerRef.current);
    resetTracking();
    imagesRef.current = [null, null, null];
    setImages([null, null, null]);
    modeRef.current = 'automatic';
    setMode('automatic');
    setShowManualFallback(false);
    setDebugPose(null);
    setPhase('intro');
  }, [resetTracking, setPhase]);

  // Offer manual capture if the sweep takes too long.
  useEffect(() => {
    if (phase !== 'scanning' || mode !== 'automatic') return;
    const id = setInterval(() => {
      if (Date.now() - scanStartedAtRef.current > configRef.current.manualFallbackMs) {
        setShowManualFallback(true);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [phase, mode, configRef]);

  useEffect(
    () => () => {
      if (completeTimerRef.current) clearTimeout(completeTimerRef.current);
    },
    []
  );

  return {
    phase,
    mode,
    images,
    ring,
    instruction,
    positionIssue,
    showManualFallback,
    debugPose,
    handleScan,
    start,
    retake,
    setImage,
    enableManualMode,
    reset,
  };
}

export type FaceSweepCapture = ReturnType<typeof useFaceSweepCapture>;
