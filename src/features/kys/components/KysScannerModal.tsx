import { Fonts, SaharaTheme } from '@/theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Easing,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCaptureAccessibility } from '../hooks/useCaptureAccessibility';
import { useFaceSweepCapture } from '../hooks/useFaceSweepCapture';
import { analyzeSkinWithGemini, convertImageToBase64, testConnectivity } from '../services/geminiApi';
import type { SkinAnalysisResult } from '../types';
import { CaptureStage, type CameraHandle } from './CaptureStage';

interface KysScannerModalProps {
  visible: boolean;
  onClose: () => void;
  onApplyRegimen?: () => void;
}

const MARKERS = [
  'Stratum Corneum Hydration',
  'Lipid Barrier Density',
  'Melanin Distribution',
  'Cellular Turnover Velocity',
  'Sebum Matrix Index',
  'Microbiome Balance',
  'TEWL (Transepidermal Water Loss)',
  'Dermal Elasticity',
  'Oxidative Stress Level',
  'Micro-Capillary Reactivity',
  'Pore Structural Integrity',
  'UV Induced Pigmentation',
  'Epidermal Thickness',
  'Peptide Receptor Binding',
];

const SCAN_IMAGE = require('@/assets/images/hero_kys.png');
const MIN_PHOTOS = 3;

/** Spoken prompts: only the few that matter, so voice never chatters. */
const SPOKEN_INSTRUCTIONS = new Set([
  'Position your face in the circle',
  'Move your head slowly to complete the circle',
  'Turn your head a little more to your left',
  'Turn your head a little more to your right',
  'Look straight at the camera',
]);

export const KysScannerModal: React.FC<KysScannerModalProps> = ({
  visible,
  onClose,
  onApplyRegimen,
}) => {
  const insets = useSafeAreaInsets();
  const [stage, setStage] = useState<'capture' | 'scanning' | 'results'>('capture');
  const [activeMarkerIndex, setActiveMarkerIndex] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<SkinAnalysisResult | null>(null);
  const [scanProgress] = useState(() => new Animated.Value(0));
  const scanLoopRef = useRef<Animated.CompositeAnimation | null>(null);
  const markerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const accessibility = useCaptureAccessibility(true); // Voice + haptics enabled
  const cameraHandleRef = useRef<CameraHandle | null>(null);

  const sweep = useFaceSweepCapture({
    capture: (pose, bounds) => cameraHandleRef.current?.capture(pose, bounds) ?? Promise.resolve(null),
    onPoseCaptured: () => accessibility.playPoseDetectedFeedback(),
    onComplete: () => accessibility.playCompleteFeedback(),
  });

  const capturedImages = sweep.images;
  const canAnalyze = capturedImages.filter((img) => img !== null).length >= MIN_PHOTOS;

  // Speak only key instructions during the automatic sweep
  const { announceInstruction, stopAnnouncement } = accessibility;
  useEffect(() => {
    if (sweep.phase === 'scanning' && sweep.mode === 'automatic' && SPOKEN_INSTRUCTIONS.has(sweep.instruction)) {
      announceInstruction(sweep.instruction);
    }
  }, [sweep.instruction, sweep.phase, sweep.mode, announceInstruction]);

  const stopScanAnimation = useCallback(() => {
    scanLoopRef.current?.stop();
    scanLoopRef.current = null;
    if (markerIntervalRef.current) {
      clearInterval(markerIntervalRef.current);
      markerIntervalRef.current = null;
    }
  }, []);

  // Reset everything when the user closes the scanner
  const { reset: resetSweep } = sweep;
  const handleClose = useCallback(() => {
    stopScanAnimation();
    resetSweep();
    stopAnnouncement();
    setAnalysisResult(null);
    setStage('capture');
    onClose();
  }, [stopScanAnimation, resetSweep, stopAnnouncement, onClose]);

  // Stop any running scan animation when the modal unmounts
  useEffect(() => stopScanAnimation, [stopScanAnimation]);

  const startAnalysis = async () => {
    if (!canAnalyze) return;
    setStage('scanning');
    setActiveMarkerIndex(0);

    // Indeterminate scan-line sweep — loops until the response actually arrives
    scanProgress.setValue(0);
    const loop = Animated.loop(
      Animated.timing(scanProgress, {
        toValue: 1,
        duration: 2500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    scanLoopRef.current = loop;
    loop.start();

    // Cycle markers continuously so the UI never stalls while waiting
    markerIntervalRef.current = setInterval(() => {
      setActiveMarkerIndex((prev) => (prev + 1) % MARKERS.length);
    }, 250);

    try {
      // Convert all captured images to base64 and send together to Gemini
      const imageUris = capturedImages.filter((uri): uri is string => uri !== null);
      const base64Images = await Promise.all(
        imageUris.slice(0, MIN_PHOTOS).map((uri) => convertImageToBase64(uri))
      );

      let result: SkinAnalysisResult;
      const MAX_ATTEMPTS = 2;
      for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        try {
          result = await analyzeSkinWithGemini(base64Images);
          break;
        } catch (err) {
          const isTransient =
            err instanceof Error &&
            (err.message.includes('Network request failed') ||
              err.message.includes('REQUEST_TIMEOUT'));
          if (!isTransient || attempt === MAX_ATTEMPTS) {
            throw err;
          }
        }
      }

      setAnalysisResult(result!);

      // Response received — stop the loop and do a short completion sweep
      stopScanAnimation();
      Animated.timing(scanProgress, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start(() => setStage('results'));
    } catch (error) {
      console.error('Analysis error:', error);
      stopScanAnimation();

      let errorTitle = 'Analysis Failed';
      let errorMessage = 'Failed to analyze the images. Please try again.';

      if (error instanceof Error) {
        if (error.message.includes('API_KEY_NOT_CONFIGURED')) {
          errorTitle = 'API Key Missing';
          errorMessage =
            'Please add your Gemini API key to the .env file.\n\n' +
            '1. Get a free key from https://aistudio.google.com/app/apikey\n' +
            '2. Add it to .env as EXPO_PUBLIC_GEMINI_API_KEY\n' +
            '3. Rebuild the app';
        } else if (error.message.includes('INVALID_API_KEY')) {
          errorTitle = 'Invalid API Key';
          errorMessage =
            'Your Gemini API key is invalid.\n\nVerify it at:\nhttps://aistudio.google.com/app/apikey';
        } else if (error.message.includes('REQUEST_TIMEOUT')) {
          errorTitle = 'Taking Too Long';
          errorMessage = 'The analysis timed out. Please try again.';
        } else if (error.message.includes('Network request failed')) {
          errorTitle = 'Network Error';
          const code = (error as Error & { code?: string }).code;

          const report = await testConnectivity().catch(() => null);
          if (report && !report.internetReachable) {
            errorMessage =
              'No internet connection detected.\n\nPlease connect to the internet and try again.';
          } else if (report && !report.geminiHostReachable) {
            errorMessage =
              `Your internet works, but this network is blocking Google's analysis servers (${report.errorCode || 'blocked'}).\n\n` +
              'Please try:\n' +
              '• Switch from WiFi to mobile data\n' +
              '• Connect to a different WiFi network\n' +
              '• Enable a VPN';
          } else {
            errorMessage = `Could not reach the analysis server (${code || 'network error'}). Please try again.`;
          }
        } else if (error.message.startsWith('Gemini API error')) {
          errorTitle = 'Analysis Failed';
          errorMessage = error.message.replace(/^Gemini API error/, 'The analysis service returned an error:');
        }
      }

      Alert.alert(errorTitle, errorMessage, [{ text: 'OK', onPress: () => setStage('capture') }]);
    }
  };


  const handleRetake = () => {
    sweep.reset();
    setAnalysisResult(null);
    setStage('capture');
  };

  const translateY = scanProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 240],
  });

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={handleClose}>
      <View style={styles.container}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) + 12 }]}>
          <TouchableOpacity onPress={handleClose} style={styles.closeBtn} activeOpacity={0.7}>
            <Ionicons name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.titleBox}>
            <Text style={styles.headerTitle}>KYS DIAGNOSTIC INTELLIGENCE</Text>
            <Text style={styles.headerSub}>
              {stage === 'capture'
                ? sweep.phase === 'review'
                  ? 'Ready to analyse'
                  : sweep.mode === 'manual'
                  ? 'Manual capture'
                  : 'Face scan'
                : '14-Marker AI Scan'}
            </Text>
          </View>

          <View style={{ width: 40 }} />
        </View>

        {/* Capture Stage */}
        {stage === 'capture' && (
          <View style={styles.captureContainer}>
            <CaptureStage
              active={visible && stage === 'capture'}
              sweep={sweep}
              onAnalyze={startAnalysis}
              cameraHandleRef={cameraHandleRef}
            />
          </View>
        )}

        {/* Scanning Stage */}
        {stage === 'scanning' && (
          <View style={styles.scanContainer}>
            <View style={styles.frameWrapper}>
              {capturedImages[0] ? (
                <Image source={{ uri: capturedImages[0]! }} style={styles.scanImage} resizeMode="cover" />
              ) : (
                <Image source={SCAN_IMAGE} style={styles.scanImage} resizeMode="cover" />
              )}

              {/* Scanning reticle overlay */}
              <View style={styles.reticleCornerTL} />
              <View style={styles.reticleCornerTR} />
              <View style={styles.reticleCornerBL} />
              <View style={styles.reticleCornerBR} />

              <Animated.View style={[styles.scanLine, { transform: [{ translateY }] }]} />
            </View>

            <View style={styles.statusBox}>
              <View style={styles.statusRow}>
                <MaterialCommunityIcons name="radar" size={20} color={SaharaTheme.primary} />
                <Text style={styles.statusTitle}>Analyzing Marker {activeMarkerIndex + 1}/14</Text>
              </View>
              <Text style={styles.markerName}>{MARKERS[activeMarkerIndex]}</Text>

              <View style={styles.progressBarBg}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${((activeMarkerIndex + 1) / 14) * 100}%` },
                  ]}
                />
              </View>
            </View>
          </View>
        )}

        {/* Results Stage */}
        {stage === 'results' && analysisResult && (
          <ScrollView contentContainerStyle={styles.resultsContainer}>
            {/* 3-photo thumbnail strip */}
            <View style={styles.resultThumbRow}>
              {capturedImages.filter((uri): uri is string => uri !== null).slice(0, MIN_PHOTOS).map((uri, i) => (
                <Image
                  key={i}
                  source={{ uri }}
                  style={styles.resultThumb}
                  resizeMode="cover"
                />
              ))}
            </View>

            <View style={styles.scoreBadge}>
              <Text style={styles.scoreNumber}>{analysisResult.overall_score}</Text>
              <Text style={styles.scoreLabel}>SKIN HEALTH SCORE</Text>
            </View>

            {/* Skin Type Badge */}
            <View style={styles.skinTypeBadge}>
              <Text style={styles.skinTypeText}>{analysisResult.skin_type.toUpperCase()} SKIN</Text>
            </View>

            {/* Conditions Grid */}
            <Text style={styles.sectionHeader}>Skin Conditions Analysis</Text>
            <View style={styles.conditionsGrid}>
              {Object.entries(analysisResult.conditions).map(([key, value]) => (
                <View key={key} style={styles.conditionCard}>
                  <Text style={styles.conditionName}>{key.replace('_', ' ')}</Text>
                  <Text style={styles.conditionValue}>{value}%</Text>
                  <View style={styles.conditionBar}>
                    <View
                      style={[
                        styles.conditionBarFill,
                        {
                          width: `${value}%`,
                          backgroundColor:
                            value > 70
                              ? '#E57373'
                              : value > 40
                              ? '#FFB74D'
                              : '#81C784',
                        },
                      ]}
                    />
                  </View>
                </View>
              ))}
            </View>

            <Text style={styles.diagnosisTitle}>Professional Diagnosis</Text>
            <Text style={styles.diagnosisText}>{analysisResult.diagnosis}</Text>

            {/* Detailed Markers */}
            <Text style={styles.sectionHeader}>Detailed Skin Markers</Text>
            {analysisResult.markers.map((marker, index) => (
              <View key={index} style={styles.markerCard}>
                <View style={styles.markerHeader}>
                  <Text style={styles.markerCardName}>{marker.name}</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          marker.status === 'good'
                            ? '#C8E6C9'
                            : marker.status === 'fair'
                            ? '#FFE0B2'
                            : '#FFCDD2',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        {
                          color:
                            marker.status === 'good'
                              ? '#2E7D32'
                              : marker.status === 'fair'
                              ? '#E65100'
                              : '#C62828',
                        },
                      ]}
                    >
                      {marker.status.toUpperCase()}
                    </Text>
                  </View>
                </View>
                <View style={styles.markerBar}>
                  <View
                    style={[
                      styles.markerBarFill,
                      {
                        width: `${marker.value}%`,
                        backgroundColor:
                          marker.status === 'good'
                            ? '#66BB6A'
                            : marker.status === 'fair'
                            ? '#FFA726'
                            : '#EF5350',
                      },
                    ]}
                  />
                </View>
                <Text style={styles.markerValue}>{marker.value}/100</Text>
              </View>
            ))}

            <Text style={styles.sectionHeader}>Recommended Actions</Text>
            {analysisResult.recommendations.map((rec, index) => (
              <View key={index} style={styles.recommendationCard}>
                <MaterialCommunityIcons
                  name="check-circle"
                  size={20}
                  color={SaharaTheme.primary}
                />
                <Text style={styles.recommendationText}>{rec}</Text>
              </View>
            ))}

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.retakeBtn}
                onPress={handleRetake}
                activeOpacity={0.8}
              >
                <Ionicons name="camera" size={20} color={SaharaTheme.onSurface} />
                <Text style={styles.retakeBtnText}>New Scan</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.applyBtn}
                onPress={() => {
                  onApplyRegimen?.();
                  handleClose();
                }}
                activeOpacity={0.88}
              >
                <Text style={styles.applyBtnText}>VIEW PRODUCTS</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050816',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255, 255, 255, 0.12)',
    backgroundColor: '#050816',
    zIndex: 20,
    elevation: 4,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleBox: {
    alignItems: 'center',
    gap: 6,
  },
  headerTitle: {
    fontFamily: Fonts?.sans,
    fontSize: 11,
    fontWeight: '700',
    color: SaharaTheme.primary,
    letterSpacing: 1.5,
  },
  headerSub: {
    fontFamily: Fonts?.serif,
    fontSize: 16,
    color: '#FFFFFF',
  },
  // Capture Stage Styles
  captureContainer: {
    flex: 1,
    overflow: 'hidden',
  },

  // Angle prompt banner
  // Thumbnail slots
  // Start Analysis CTA
  scanContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  frameWrapper: {
    width: 280,
    height: 280,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 32,
  },
  scanImage: {
    width: '100%',
    height: '100%',
  },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: SaharaTheme.primary,
    shadowColor: SaharaTheme.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
  },
  reticleCornerTL: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 20,
    height: 20,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderColor: SaharaTheme.primary,
  },
  reticleCornerTR: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 20,
    height: 20,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderColor: SaharaTheme.primary,
  },
  reticleCornerBL: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    width: 20,
    height: 20,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderColor: SaharaTheme.primary,
  },
  reticleCornerBR: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 20,
    height: 20,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderColor: SaharaTheme.primary,
  },
  statusBox: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  statusTitle: {
    fontFamily: Fonts?.sans,
    fontSize: 12,
    fontWeight: '700',
    color: SaharaTheme.primary,
    letterSpacing: 1,
  },
  markerName: {
    fontFamily: Fonts?.serif,
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 16,
  },
  progressBarBg: {
    width: '100%',
    height: 6,
    backgroundColor: SaharaTheme.outlineVariant,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: SaharaTheme.primary,
  },
  // Results Stage Styles
  resultsContainer: {
    padding: 24,
    alignItems: 'center',
  },
  resultThumbRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  resultThumb: {
    width: 88,
    height: 88,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: SaharaTheme.primary,
  },
  scoreBadge: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: SaharaTheme.surfaceContainerLow,
    borderWidth: 3,
    borderColor: SaharaTheme.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  scoreNumber: {
    fontFamily: Fonts?.serif,
    fontSize: 44,
    fontWeight: '600',
    color: SaharaTheme.primary,
  },
  scoreLabel: {
    fontFamily: Fonts?.sans,
    fontSize: 8,
    fontWeight: '700',
    color: SaharaTheme.onSurfaceVariant,
    letterSpacing: 0.8,
  },
  skinTypeBadge: {
    backgroundColor: SaharaTheme.primary,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 24,
  },
  skinTypeText: {
    fontFamily: Fonts?.sans,
    fontSize: 12,
    fontWeight: '700',
    color: SaharaTheme.onPrimary,
    letterSpacing: 1.2,
  },
  conditionsGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  conditionCard: {
    width: '48%',
    backgroundColor: SaharaTheme.surfaceContainerLow,
    padding: 12,
    borderRadius: 12,
  },
  conditionName: {
    fontFamily: Fonts?.sans,
    fontSize: 11,
    fontWeight: '600',
    color: SaharaTheme.onSurfaceVariant,
    textTransform: 'capitalize',
    marginBottom: 6,
  },
  conditionValue: {
    fontFamily: Fonts?.serif,
    fontSize: 20,
    fontWeight: '600',
    color: SaharaTheme.onSurface,
    marginBottom: 8,
  },
  conditionBar: {
    width: '100%',
    height: 4,
    backgroundColor: SaharaTheme.outlineVariant,
    borderRadius: 2,
    overflow: 'hidden',
  },
  conditionBarFill: {
    height: '100%',
  },
  diagnosisTitle: {
    fontFamily: Fonts?.serif,
    fontSize: 24,
    color: SaharaTheme.primary,
    marginBottom: 8,
    marginTop: 8,
  },
  diagnosisText: {
    fontFamily: Fonts?.sans,
    fontSize: 14,
    lineHeight: 22,
    color: SaharaTheme.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: 32,
  },
  sectionHeader: {
    fontFamily: Fonts?.sans,
    fontSize: 12,
    fontWeight: '700',
    color: SaharaTheme.primary,
    letterSpacing: 1.5,
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  markerCard: {
    width: '100%',
    backgroundColor: SaharaTheme.surfaceContainerLow,
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  markerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  markerCardName: {
    fontFamily: Fonts?.sans,
    fontSize: 13,
    fontWeight: '600',
    color: SaharaTheme.onSurface,
    flex: 1,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  statusText: {
    fontFamily: Fonts?.sans,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  markerBar: {
    width: '100%',
    height: 6,
    backgroundColor: SaharaTheme.outlineVariant,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  markerBarFill: {
    height: '100%',
  },
  markerValue: {
    fontFamily: Fonts?.sans,
    fontSize: 12,
    color: SaharaTheme.onSurfaceVariant,
    textAlign: 'right',
  },
  recommendationCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: SaharaTheme.surfaceContainerLow,
    padding: 14,
    borderRadius: 12,
    gap: 12,
    marginBottom: 10,
  },
  recommendationText: {
    flex: 1,
    fontFamily: Fonts?.sans,
    fontSize: 13,
    lineHeight: 20,
    color: SaharaTheme.onSurface,
  },
  actionButtons: {
    width: '100%',
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  retakeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: SaharaTheme.surfaceContainerLow,
    paddingVertical: 14,
    borderRadius: 25,
  },
  retakeBtnText: {
    color: SaharaTheme.onSurface,
    fontFamily: Fonts?.sans,
    fontSize: 12,
    fontWeight: '600',
  },
  applyBtn: {
    flex: 1,
    backgroundColor: SaharaTheme.primary,
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyBtnText: {
    color: SaharaTheme.onPrimary,
    fontFamily: Fonts?.sans,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
