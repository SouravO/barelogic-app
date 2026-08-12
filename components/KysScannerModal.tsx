import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
  Easing,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SaharaTheme, Fonts } from '@/constants/theme';
import * as ImagePicker from 'expo-image-picker';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { analyzeSkinWithGemini, convertImageToBase64 } from '@/services/geminiApi';
import type { SkinAnalysisResult } from '@/services/geminiApi';

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

export const KysScannerModal: React.FC<KysScannerModalProps> = ({
  visible,
  onClose,
  onApplyRegimen,
}) => {
  const insets = useSafeAreaInsets();
  const [stage, setStage] = useState<'capture' | 'scanning' | 'results'>('capture');
  const [activeMarkerIndex, setActiveMarkerIndex] = useState(0);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<SkinAnalysisResult | null>(null);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [cameraRef, setCameraRef] = useState<CameraView | null>(null);
  const [facing, setFacing] = useState<'front' | 'back'>('front');
  const scanProgress = React.useRef(new Animated.Value(0)).current;

  // Reset state when modal opens
  useEffect(() => {
    if (visible) {
      setStage('capture');
      setCapturedImage(null);
      setAnalysisResult(null);
      setActiveMarkerIndex(0);
      scanProgress.setValue(0);
    }
  }, [visible, scanProgress]);

  const handleTakePhoto = async () => {
    if (!cameraRef) return;

    try {
      const photo = await cameraRef.takePictureAsync({
        quality: 0.8,
        base64: false,
      });

      if (photo?.uri) {
        setCapturedImage(photo.uri);
        await startAnalysis(photo.uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to capture photo. Please try again.');
    }
  };

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setCapturedImage(result.assets[0].uri);
        await startAnalysis(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  const startAnalysis = async (imageUri: string) => {
    setStage('scanning');

    // Start animation
    Animated.timing(scanProgress, {
      toValue: 1,
      duration: 4500,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();

    // Animate through markers
    const markerInterval = setInterval(() => {
      setActiveMarkerIndex((prev) => (prev < MARKERS.length - 1 ? prev + 1 : prev));
    }, 300);

    try {
      // Convert image to base64 and send to Gemini
      const base64Image = await convertImageToBase64(imageUri);
      const result = await analyzeSkinWithGemini(base64Image);
      
      setAnalysisResult(result);
      
      // Wait for animation to complete
      setTimeout(() => {
        clearInterval(markerInterval);
        setStage('results');
      }, 4500);
    } catch (error) {
      console.error('Analysis error:', error);
      clearInterval(markerInterval);
      
      // Handle specific error types
      let errorTitle = 'Analysis Failed';
      let errorMessage = 'Failed to analyze the image. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('API_KEY_NOT_CONFIGURED')) {
          errorTitle = 'API Key Missing';
          errorMessage = 'Please add your Gemini API key to the .env file.\n\n' +
            '1. Get a free key from https://makersuite.google.com/app/apikey\n' +
            '2. Add it to .env file as EXPO_PUBLIC_GEMINI_API_KEY\n' +
            '3. Restart the app';
        } else if (error.message.includes('INVALID_API_KEY')) {
          errorTitle = 'Invalid API Key';
          errorMessage = 'Your Gemini API key is invalid.\n\n' +
            'Please verify your key at:\nhttps://makersuite.google.com/app/apikey';
        } else if (error.message.includes('MODEL_NOT_AVAILABLE')) {
          errorTitle = 'Vision Model Not Available';
          errorMessage = 'Groq vision models are not available with your API key.\n\n' +
            'Options:\n' +
            '1. Upgrade your Groq plan for vision access\n' +
            '2. Or use OpenAI GPT-4 Vision instead\n\n' +
            'For now, showing demo results...';
          // Still show results with mock data
          setTimeout(() => {
            clearInterval(markerInterval);
            setStage('results');
          }, 1000);
          return;
        } else if (error.message.includes('Network request failed')) {
          errorTitle = 'Network Error';
          errorMessage = 'Please check your internet connection and try again.';
        }
      }
      
      Alert.alert(
        errorTitle,
        errorMessage,
        [{ text: 'OK', onPress: () => setStage('capture') }]
      );
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setAnalysisResult(null);
    setStage('capture');
  };

  const translateY = scanProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 240],
  });

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={styles.container}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) + 12 }]}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
            <Ionicons name="close" size={24} color={SaharaTheme.onSurface} />
          </TouchableOpacity>

          <View style={styles.titleBox}>
            <Text style={styles.headerTitle}>KYS DIAGNOSTIC INTELLIGENCE</Text>
            <Text style={styles.headerSub}>
              {stage === 'capture' ? 'Capture Your Face' : '14-Marker AI Scan'}
            </Text>
          </View>

          <View style={{ width: 40 }} />
        </View>

        {/* Capture Stage */}
        {stage === 'capture' && (
          <View style={styles.captureContainer}>
            {!cameraPermission?.granted ? (
              <View style={styles.permissionContainer}>
                <MaterialCommunityIcons name="camera-off" size={64} color={SaharaTheme.onSurfaceVariant} />
                <Text style={styles.permissionText}>Camera permission is required</Text>
                <TouchableOpacity
                  style={styles.permissionBtn}
                  onPress={requestCameraPermission}
                  activeOpacity={0.8}
                >
                  <Text style={styles.permissionBtnText}>Grant Permission</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.permissionBtn, styles.uploadBtn]}
                  onPress={handlePickImage}
                  activeOpacity={0.8}
                >
                  <Text style={styles.permissionBtnText}>Upload from Gallery</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <View style={styles.cameraWrapper}>
                  <CameraView
                    ref={(ref) => setCameraRef(ref)}
                    style={styles.camera}
                    facing={facing}
                  />
                  {/* Overlay rendered outside CameraView to avoid warning */}
                  <View style={styles.cameraOverlay}>
                    <View style={styles.faceGuide} />
                    <View style={styles.reticleCornerTL} />
                    <View style={styles.reticleCornerTR} />
                    <View style={styles.reticleCornerBL} />
                    <View style={styles.reticleCornerBR} />
                  </View>
                </View>

                <View style={styles.captureControls}>
                  <Text style={styles.captureHint}>
                    Position your face within the frame
                  </Text>

                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={styles.flipBtn}
                      onPress={() => setFacing(facing === 'front' ? 'back' : 'front')}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="camera-reverse" size={28} color={SaharaTheme.onSurface} />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.captureBtn}
                      onPress={handleTakePhoto}
                      activeOpacity={0.8}
                    >
                      <View style={styles.captureBtnInner} />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.galleryBtn}
                      onPress={handlePickImage}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="images" size={28} color={SaharaTheme.onSurface} />
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}
          </View>
        )}

        {/* Scanning Stage */}
        {stage === 'scanning' && (
          <View style={styles.scanContainer}>
            <View style={styles.frameWrapper}>
              {capturedImage ? (
                <Image source={{ uri: capturedImage }} style={styles.scanImage} resizeMode="cover" />
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
            {/* Display captured image */}
            {capturedImage && (
              <View style={styles.resultImageWrapper}>
                <Image source={{ uri: capturedImage }} style={styles.resultImage} resizeMode="cover" />
              </View>
            )}

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
                <Text style={styles.retakeBtnText}>Retake Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.applyBtn}
                onPress={() => {
                  onApplyRegimen?.();
                  onClose();
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
    backgroundColor: SaharaTheme.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: SaharaTheme.outlineVariant,
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
    color: SaharaTheme.onSurface,
  },
  // Capture Stage Styles
  captureContainer: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 16,
  },
  permissionText: {
    fontFamily: Fonts?.sans,
    fontSize: 16,
    color: SaharaTheme.onSurfaceVariant,
    textAlign: 'center',
  },
  permissionBtn: {
    backgroundColor: SaharaTheme.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 25,
    minWidth: 200,
  },
  uploadBtn: {
    backgroundColor: SaharaTheme.surfaceContainerLow,
  },
  permissionBtnText: {
    color: SaharaTheme.onPrimary,
    fontFamily: Fonts?.sans,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  cameraWrapper: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none', // Allow touches to pass through to camera
  },
  faceGuide: {
    width: 280,
    height: 350,
    borderRadius: 140,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderStyle: 'dashed',
  },
  captureControls: {
    paddingVertical: 30,
    paddingHorizontal: 24,
    backgroundColor: SaharaTheme.surface,
    alignItems: 'center',
    gap: 20,
  },
  captureHint: {
    fontFamily: Fonts?.sans,
    fontSize: 14,
    color: SaharaTheme.onSurfaceVariant,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    gap: 20,
  },
  captureBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: SaharaTheme.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 5,
    borderColor: SaharaTheme.surface,
  },
  captureBtnInner: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: SaharaTheme.onPrimary,
  },
  flipBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: SaharaTheme.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  galleryBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: SaharaTheme.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Scanning Stage Styles
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
    backgroundColor: SaharaTheme.surfaceContainerLow,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
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
    color: SaharaTheme.onSurface,
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
  resultImageWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: SaharaTheme.primary,
  },
  resultImage: {
    width: '100%',
    height: '100%',
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
