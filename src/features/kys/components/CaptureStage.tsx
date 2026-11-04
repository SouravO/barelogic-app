/**
 * Capture stage of the KYS scanner: intro → Face ID-style sweep (or manual
 * fallback) → photo review.
 */

import { Fonts } from '@/theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Animated as RNAnimated,
  LayoutChangeEvent,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Camera, useCameraDevice, useCameraPermission, usePhotoOutput } from 'react-native-vision-camera';
import { createFaceScannerOutput } from 'vision-camera-face-detection';
import type { FaceSweepCapture } from '../hooks/useFaceSweepCapture';
import type { FaceBounds, TargetPose } from '../types/selfie-capture.types';
import { faceCropRect } from '../utils/faceCrop';
import { useLatestRef } from '../hooks/useLatestRef';
import { normalizePose } from '../utils/poseValidation';
import { FaceSweepRing, sweepCircleFor, SWEEP_GREEN } from './FaceSweepRing';
import { PhotoReviewGrid } from './PhotoReviewGrid';
import { SweepIntro } from './SweepIntro';

/** Detector callback rate limit (~20 fps) */
const SCAN_INTERVAL_MS = 50;

const MANUAL_HINTS = [
  'Photo 1 of 3 · Look straight at the camera',
  'Photo 2 of 3 · Turn your head to your left',
  'Photo 3 of 3 · Turn your head to your right',
];

interface CaptureStageProps {
  /** Whether the modal is open and on the capture stage */
  active: boolean;
  sweep: FaceSweepCapture;
  onAnalyze: () => void;
  /** Lets the capture function reach the camera owned by this component */
  cameraHandleRef: React.MutableRefObject<CameraHandle | null>;
}

export interface CameraHandle {
  capture: (pose: TargetPose, bounds: FaceBounds | undefined) => Promise<string | null>;
}

export const CaptureStage: React.FC<CaptureStageProps> = ({
  active,
  sweep,
  onAnalyze,
  cameraHandleRef,
}) => {
  const { hasPermission, requestPermission } = useCameraPermission();
  const [cameraPosition, setCameraPosition] = useState<'front' | 'back'>('front');
  const device = useCameraDevice(cameraPosition);
  const [view, setView] = useState<{ width: number; height: number } | null>(null);
  const cameraRef = useRef<any>(null);
  const [flashAnim] = useState(() => new RNAnimated.Value(0));

  const { phase, mode, images } = sweep;
  const circle = useMemo(() => (view ? sweepCircleFor(view.width, view.height) : null), [view]);
  const showCamera = phase === 'scanning' || phase === 'complete';
  const filledCount = images.filter(Boolean).length;

  // ---- Face scanner output (created once per view size, callbacks via refs) ----
  const handleScanRef = useLatestRef(sweep.handleScan);
  const circleRef = useLatestRef(circle);
  const lastScanAtRef = useRef(0);

  const scannerOutput = useMemo(() => {
    if (!view) return null;
    // The callbacks below run later on detector results, never during render,
    // so reading refs / the clock inside them is safe.
    // eslint-disable-next-line react-hooks/refs
    return createFaceScannerOutput({
      onFaceScanned(faces) {
        // eslint-disable-next-line react-hooks/purity
        const now = Date.now();
        if (now - lastScanAtRef.current < SCAN_INTERVAL_MS || !circleRef.current) return;
        lastScanAtRef.current = now;
        const face = faces[0];
        handleScanRef.current(
          face
            ? {
                faceCount: faces.length,
                bounds: { x: face.bounds.x, y: face.bounds.y, width: face.bounds.width, height: face.bounds.height },
                pose: normalizePose(face.yawAngle, face.pitchAngle, face.rollAngle),
                leftEyeOpen: face.leftEyeOpenProbability,
                rightEyeOpen: face.rightEyeOpenProbability,
              }
            : { faceCount: 0 },
          circleRef.current
        );
      },
      onError(error) {
        console.warn('Face scan error:', error);
      },
      autoMode: true,
      windowWidth: view.width,
      windowHeight: view.height,
      cameraFacing: 'front',
      outputResolution: 'preview',
      performanceMode: 'fast',
      runClassifications: true,
    });
  }, [view, handleScanRef, circleRef]);

  const photoOutput = usePhotoOutput({ qualityPrioritization: 'speed' });
  const outputs = useMemo(
    () => (scannerOutput && cameraPosition === 'front' ? [scannerOutput, photoOutput] : [photoOutput]),
    [scannerOutput, photoOutput, cameraPosition]
  );

  const flash = useCallback((intensity: number) => {
    flashAnim.setValue(intensity);
    RNAnimated.timing(flashAnim, { toValue: 0, duration: 260, useNativeDriver: true }).start();
  }, [flashAnim]);

  // ---- Auto capture: fast preview snapshot cropped to the face (Android) ----
  const capture = useCallback(
    async (_pose: TargetPose, bounds: FaceBounds | undefined): Promise<string | null> => {
      try {
        let path: string;
        if (Platform.OS === 'android' && cameraRef.current) {
          const snapshot = await cameraRef.current.takeSnapshot();
          const rect = bounds && view ? faceCropRect(bounds, view, snapshot) : null;
          const image = rect ? snapshot.crop(rect.startX, rect.startY, rect.endX, rect.endY) : snapshot;
          path = await image.saveToTemporaryFileAsync('jpg', 90);
          if (image !== snapshot) image.dispose?.();
          snapshot.dispose?.();
        } else {
          // takeSnapshot is Android-only; iOS uses a regular photo.
          const photo = await photoOutput.capturePhoto({}, {});
          path = await photo.saveToTemporaryFileAsync();
          photo.dispose();
        }
        flash(0.25); // subtle: the badge pulse is the main feedback
        return path.startsWith('file://') ? path : `file://${path}`;
      } catch (error) {
        console.warn('Auto capture failed:', error);
        return null;
      }
    },
    [view, photoOutput, flash]
  );

  useEffect(() => {
    cameraHandleRef.current = { capture };
  }, [capture, cameraHandleRef]);

  // ---- Manual shutter ----
  const handleManualShutter = async () => {
    const slot = images.findIndex((img) => img === null);
    if (slot < 0) return;
    try {
      const photo = await photoOutput.capturePhoto({}, {});
      const path = await photo.saveToTemporaryFileAsync();
      photo.dispose();
      flash(0.8);
      sweep.setImage(slot as 0 | 1 | 2, path.startsWith('file://') ? path : `file://${path}`);
    } catch (error) {
      console.warn('Manual capture failed:', error);
      Alert.alert('Error', 'Failed to capture photo. Please try again.');
    }
  };

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setView((prev) =>
      prev && Math.abs(prev.width - width) < 1 && Math.abs(prev.height - height) < 1 ? prev : { width, height }
    );
  };

  // ---------------------------------------------------------------------------

  if (!hasPermission) {
    return (
      <View style={styles.center}>
        <MaterialCommunityIcons name="camera-off" size={56} color="rgba(255,255,255,0.5)" />
        <Text style={styles.permissionText}>Camera access is needed to scan your skin</Text>
        <TouchableOpacity style={styles.primaryBtn} onPress={requestPermission} activeOpacity={0.85}>
          <Text style={styles.primaryBtnText}>Allow camera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (phase === 'intro') {
    return (
      <SweepIntro
        onStart={sweep.start}
        onManual={() => {
          sweep.enableManualMode();
        }}
      />
    );
  }

  if (phase === 'review') {
    return (
      <Animated.View entering={FadeIn.duration(220)} style={styles.review}>
        <MaterialCommunityIcons name="check-circle" size={44} color={SWEEP_GREEN} />
        <Text style={styles.reviewTitle}>All angles captured</Text>
        <Text style={styles.reviewSub}>Tap a photo to retake it.</Text>
        <View style={styles.reviewGrid}>
          <PhotoReviewGrid
            capturedImages={images}
            labels={['Front', 'Left', 'Right']}
            onRetake={sweep.retake}
          />
        </View>
        <Animated.View entering={FadeInDown.delay(120)} style={styles.reviewActions}>
          <TouchableOpacity style={styles.primaryBtn} onPress={onAnalyze} activeOpacity={0.88}>
            <MaterialCommunityIcons name="radar" size={20} color="#050816" />
            <Text style={styles.primaryBtnText}>Analyze my skin</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={sweep.reset} hitSlop={12} activeOpacity={0.7}>
            <Text style={styles.linkText}>Start over</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    );
  }

  const isManual = mode === 'manual';

  return (
    <View style={styles.flex}>
      <View style={styles.cameraArea} onLayout={onLayout}>
        {view && device && circle && showCamera ? (
          <>
            <Camera
              ref={cameraRef}
              style={StyleSheet.absoluteFill}
              device={device}
              isActive={active && showCamera}
              outputs={outputs}
            />
            <FaceSweepRing
              width={view.width}
              height={view.height}
              circle={circle}
              ring={isManual ? EMPTY_RING : sweep.ring}
              images={images}
              phase={phase}
              instruction={isManual ? MANUAL_HINTS[Math.min(filledCount, 2)] : sweep.instruction}
              positionIssue={isManual ? 'none' : sweep.positionIssue}
              debugPose={isManual ? null : sweep.debugPose}
            />
            <RNAnimated.View
              pointerEvents="none"
              style={[StyleSheet.absoluteFill, { backgroundColor: '#fff', opacity: flashAnim }]}
            />
          </>
        ) : (
          <View style={styles.center}>
            <MaterialCommunityIcons name="camera" size={40} color="rgba(255,255,255,0.3)" />
            <Text style={styles.loadingText}>Starting camera…</Text>
          </View>
        )}
      </View>

      {/* Bottom controls */}
      <View style={styles.controls}>
        {isManual ? (
          <View style={styles.manualRow}>
            <TouchableOpacity onPress={sweep.start} style={styles.sideBtn} activeOpacity={0.7}>
              <MaterialCommunityIcons name="face-recognition" size={22} color="#fff" />
              <Text style={styles.sideBtnText}>Auto</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shutter} onPress={handleManualShutter} activeOpacity={0.8}>
              <View style={styles.shutterInner} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setCameraPosition((p) => (p === 'front' ? 'back' : 'front'))}
              style={styles.sideBtn}
              activeOpacity={0.7}
            >
              <Ionicons name="camera-reverse-outline" size={24} color="#fff" />
              <Text style={styles.sideBtnText}>Flip</Text>
            </TouchableOpacity>
          </View>
        ) : sweep.showManualFallback ? (
          <Animated.View entering={FadeInDown}>
            <TouchableOpacity style={styles.fallbackBtn} onPress={sweep.enableManualMode} activeOpacity={0.85}>
              <MaterialCommunityIcons name="gesture-tap" size={18} color="#fff" />
              <Text style={styles.fallbackText}>Having trouble? Take photos manually</Text>
            </TouchableOpacity>
          </Animated.View>
        ) : (
          <Text style={styles.progressText}>
            {phase === 'complete' ? 'Scan complete' : `${filledCount} of 3 angles captured`}
          </Text>
        )}
      </View>
    </View>
  );
};

const EMPTY_RING: boolean[] = new Array(48).fill(false);

const styles = StyleSheet.create({
  flex: { flex: 1 },
  cameraArea: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: '#050816',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 32,
  },
  permissionText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 15,
    textAlign: 'center',
    fontFamily: Fonts.sans,
  },
  loadingText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
    fontFamily: Fonts.sans,
  },
  controls: {
    minHeight: 112,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  progressText: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 13,
    fontFamily: Fonts.rounded,
    letterSpacing: 0.3,
  },
  fallbackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  fallbackText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: Fonts.rounded,
  },
  manualRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    paddingHorizontal: 12,
  },
  sideBtn: {
    width: 64,
    alignItems: 'center',
    gap: 4,
  },
  sideBtnText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    fontFamily: Fonts.rounded,
  },
  shutter: {
    width: 74,
    height: 74,
    borderRadius: 37,
    borderWidth: 4,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#fff',
  },
  review: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 32,
    gap: 6,
  },
  reviewTitle: {
    color: '#fff',
    fontSize: 22,
    marginTop: 8,
    fontFamily: Fonts.rounded,
  },
  reviewSub: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    fontFamily: Fonts.sans,
  },
  reviewGrid: {
    alignSelf: 'stretch',
    marginTop: 20,
  },
  reviewActions: {
    alignSelf: 'stretch',
    alignItems: 'center',
    gap: 16,
    marginTop: 'auto',
    paddingBottom: 32,
  },
  primaryBtn: {
    alignSelf: 'stretch',
    height: 52,
    borderRadius: 26,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryBtnText: {
    color: '#050816',
    fontSize: 16,
    fontFamily: Fonts.rounded,
  },
  linkText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    textDecorationLine: 'underline',
    fontFamily: Fonts.sans,
  },
});

