/**
 * Face guide overlay with animated countdown and visual feedback
 * Renders over the camera view to guide user positioning
 */

import { SaharaTheme } from '@/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface FaceGuideOverlayProps {
  /** Current countdown number (3, 2, 1, or null) */
  countdownValue: 3 | 2 | 1 | null;
  /** Whether face is being detected/tracked */
  isDetecting: boolean;
  /** Instruction text to display */
  instructionText: string;
  /** Whether to show manual fallback button */
  showTroubleButton: boolean;
  /** Callback when manual mode is activated */
  onManualModeActivated?: () => void;
  /** Progress value (0-1) for animations */
  progress?: number;
}

export const FaceGuideOverlay: React.FC<FaceGuideOverlayProps> = ({
  countdownValue,
  isDetecting,
  instructionText,
  showTroubleButton,
  onManualModeActivated,
  progress = 0,
}) => {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const borderColorAnim = useRef(new Animated.Value(0)).current;

  // Animate countdown number appearance
  useEffect(() => {
    if (countdownValue !== null) {
      // Reset and fade in with scale
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.8);

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [countdownValue, fadeAnim, scaleAnim]);

  // Pulse animation during countdown
  useEffect(() => {
    if (countdownValue !== null) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();

      return () => pulse.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [countdownValue, pulseAnim]);

  // Border color animation based on detection state
  useEffect(() => {
    let targetValue = 0; // gray (no detection)
    
    if (countdownValue !== null) {
      targetValue = 2; // green (counting down)
    } else if (isDetecting) {
      targetValue = 1; // yellow (detecting valid pose)
    }

    borderColorAnim.setValue(targetValue);
  }, [isDetecting, countdownValue, borderColorAnim]);

  // Interpolate border color
  const borderColor = borderColorAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [
      'rgba(255, 255, 255, 0.5)', // gray - no detection
      '#FFD700', // yellow - detecting
      '#4CAF50', // green - countdown
    ],
  });

  // Calculate border width based on progress
  const borderWidth = countdownValue !== null ? 3 + progress * 2 : 3;

  return (
    <View style={styles.container} pointerEvents="box-none">
      {/* Face guide oval */}
      <Animated.View
        style={[
          styles.faceGuide,
          {
            borderColor,
            borderWidth,
            transform: [{ scale: pulseAnim }],
          },
        ]}
      />

      {/* Corner reticles */}
      <Animated.View style={[styles.reticleCornerTL, { borderColor }]} />
      <Animated.View style={[styles.reticleCornerTR, { borderColor }]} />
      <Animated.View style={[styles.reticleCornerBL, { borderColor }]} />
      <Animated.View style={[styles.reticleCornerBR, { borderColor }]} />

      {/* Countdown number */}
      {countdownValue !== null && (
        <Animated.View
          style={[
            styles.countdownContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Text style={styles.countdownNumber}>{countdownValue}</Text>
        </Animated.View>
      )}

      {/* Instruction banner */}
      <View style={styles.instructionBanner}>
        <MaterialCommunityIcons
          name={countdownValue !== null ? 'check-circle' : 'information'}
          size={16}
          color="#fff"
        />
        <Text style={styles.instructionText}>{instructionText}</Text>
      </View>

      {/* Manual fallback button */}
      {showTroubleButton && !countdownValue && (
        <View style={styles.troubleButtonContainer}>
          <TouchableOpacity
            style={styles.troubleButton}
            onPress={onManualModeActivated}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="hand-pointing-up" size={20} color={SaharaTheme.primary} />
            <Text style={styles.troubleButtonText}>Having trouble? Tap to capture manually</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  faceGuide: {
    width: 280,
    height: 350,
    borderRadius: 140,
    borderWidth: 3,
    borderStyle: 'dashed',
  },
  reticleCornerTL: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -175,
    marginLeft: -140,
    width: 20,
    height: 20,
    borderTopWidth: 2,
    borderLeftWidth: 2,
  },
  reticleCornerTR: {
    position: 'absolute',
    top: '50%',
    right: '50%',
    marginTop: -175,
    marginRight: -140,
    width: 20,
    height: 20,
    borderTopWidth: 2,
    borderRightWidth: 2,
  },
  reticleCornerBL: {
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    marginBottom: -175,
    marginLeft: -140,
    width: 20,
    height: 20,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
  },
  reticleCornerBR: {
    position: 'absolute',
    bottom: '50%',
    right: '50%',
    marginBottom: -175,
    marginRight: -140,
    width: 20,
    height: 20,
    borderBottomWidth: 2,
    borderRightWidth: 2,
  },
  countdownContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  countdownNumber: {
    fontSize: 120,
    fontWeight: '700',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  instructionBanner: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 10,
  },
  instructionText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
    letterSpacing: 0.5,
  },
  troubleButtonContainer: {
    position: 'absolute',
    bottom: 80,
    left: 24,
    right: 24,
  },
  troubleButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  troubleButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: SaharaTheme.onSurface,
    letterSpacing: 0.3,
  },
});
