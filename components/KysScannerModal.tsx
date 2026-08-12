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
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SaharaTheme, Fonts } from '@/constants/theme';

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
  const [stage, setStage] = useState<'scanning' | 'results'>('scanning');
  const [activeMarkerIndex, setActiveMarkerIndex] = useState(0);
  const scanProgress = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setStage('scanning');
      setActiveMarkerIndex(0);
      scanProgress.setValue(0);

      Animated.timing(scanProgress, {
        toValue: 1,
        duration: 4500,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => {
        setStage('results');
      });

      const interval = setInterval(() => {
        setActiveMarkerIndex((prev) => (prev < MARKERS.length - 1 ? prev + 1 : prev));
      }, 300);

      return () => clearInterval(interval);
    }
  }, [visible, scanProgress]);

  const translateY = scanProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 240],
  });

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
            <Ionicons name="close" size={24} color={SaharaTheme.onSurface} />
          </TouchableOpacity>

          <View style={styles.titleBox}>
            <Text style={styles.headerTitle}>KYS DIAGNOSTIC INTELLIGENCE</Text>
            <Text style={styles.headerSub}>14-Marker AI Scan</Text>
          </View>

          <View style={{ width: 40 }} />
        </View>

        {stage === 'scanning' ? (
          <View style={styles.scanContainer}>
            <View style={styles.frameWrapper}>
              <Image source={SCAN_IMAGE} style={styles.scanImage} resizeMode="cover" />

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
        ) : (
          <ScrollView contentContainerStyle={styles.resultsContainer}>
            <View style={styles.scoreBadge}>
              <Text style={styles.scoreNumber}>94</Text>
              <Text style={styles.scoreLabel}>CELLULAR LUMINOSITY SCORE</Text>
            </View>

            <Text style={styles.diagnosisTitle}>Diagnosis Summary</Text>
            <Text style={styles.diagnosisText}>
              Your lipid barrier shows mild micro-stress with elevated TEWL rates. We recommend a high-concentration Niacinamide formula paired with biomimetic lipid replenishment.
            </Text>

            <Text style={styles.sectionHeader}>Prescribed Cellular Regimen</Text>

            <View style={styles.regimenCard}>
              <MaterialCommunityIcons name="bottle-tonic-plus-outline" size={24} color={SaharaTheme.primary} />
              <View style={styles.regimenInfo}>
                <Text style={styles.regimenStep}>STEP 1: REPAIR</Text>
                <Text style={styles.regimenTitle}>Barrier Repair Complex (10% Niacinamide)</Text>
                <Text style={styles.regimenPrice}>$68</Text>
              </View>
            </View>

            <View style={styles.regimenCard}>
              <MaterialCommunityIcons name="lotion-outline" size={24} color={SaharaTheme.primary} />
              <View style={styles.regimenInfo}>
                <Text style={styles.regimenStep}>STEP 2: MOISTURIZE</Text>
                <Text style={styles.regimenTitle}>Lipid Replenishing Cream</Text>
                <Text style={styles.regimenPrice}>$85</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.applyBtn}
              onPress={() => {
                onApplyRegimen?.();
                onClose();
              }}
              activeOpacity={0.88}
            >
              <Text style={styles.applyBtnText}>ADD PRESCRIBED REGIMEN TO BAG ($153)</Text>
            </TouchableOpacity>
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
  resultsContainer: {
    padding: 24,
    alignItems: 'center',
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
    marginBottom: 24,
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
  diagnosisTitle: {
    fontFamily: Fonts?.serif,
    fontSize: 24,
    color: SaharaTheme.primary,
    marginBottom: 8,
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
  regimenCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SaharaTheme.surfaceContainerLow,
    padding: 16,
    borderRadius: 14,
    gap: 16,
    marginBottom: 12,
  },
  regimenInfo: {
    flex: 1,
  },
  regimenStep: {
    fontFamily: Fonts?.sans,
    fontSize: 10,
    fontWeight: '700',
    color: SaharaTheme.onSurfaceVariant,
    letterSpacing: 1,
  },
  regimenTitle: {
    fontFamily: Fonts?.sans,
    fontSize: 14,
    fontWeight: '600',
    color: SaharaTheme.primary,
    marginTop: 2,
  },
  regimenPrice: {
    fontFamily: Fonts?.sans,
    fontSize: 13,
    fontWeight: '500',
    color: SaharaTheme.onSurfaceVariant,
    marginTop: 2,
  },
  applyBtn: {
    width: '100%',
    backgroundColor: SaharaTheme.primary,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 24,
  },
  applyBtnText: {
    color: SaharaTheme.onPrimary,
    fontFamily: Fonts?.sans,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
});
