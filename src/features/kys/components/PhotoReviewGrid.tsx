/**
 * Photo review grid with individual retake functionality
 */

import { Fonts, SaharaTheme } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface PhotoReviewGridProps {
  /** Array of 3 image URIs (can have nulls for uncaptured photos) */
  capturedImages: [string | null, string | null, string | null];
  /** Labels for each photo slot */
  labels: [string, string, string];
  /** Callback when user wants to retake a specific photo */
  onRetake: (index: 0 | 1 | 2) => void;
  /** Whether retake is currently disabled */
  disabled?: boolean;
}

export const PhotoReviewGrid: React.FC<PhotoReviewGridProps> = ({
  capturedImages,
  labels,
  onRetake,
  disabled = false,
}) => {
  return (
    <View style={styles.container}>
      {capturedImages.map((uri, index) => (
        <PhotoSlot
          key={index}
          uri={uri}
          label={labels[index]}
          onRetake={() => onRetake(index as 0 | 1 | 2)}
          disabled={disabled}
        />
      ))}
    </View>
  );
};

interface PhotoSlotProps {
  uri: string | null;
  label: string;
  onRetake: () => void;
  disabled: boolean;
}

const PhotoSlot: React.FC<PhotoSlotProps> = ({ uri, label, onRetake, disabled }) => {
  if (!uri) {
    // Empty slot - waiting for capture
    return (
      <View style={styles.slot}>
        <View style={styles.emptySlot}>
          <Ionicons name="camera-outline" size={24} color={SaharaTheme.outlineVariant} />
          <Text style={styles.emptyLabel}>{label}</Text>
        </View>
      </View>
    );
  }

  // Captured photo - show with retake option
  return (
    <View style={styles.slot}>
      <TouchableOpacity
        style={styles.photoContainer}
        onPress={disabled ? undefined : onRetake}
        activeOpacity={0.8}
        disabled={disabled}
      >
        <Image source={{ uri }} style={styles.photo} resizeMode="cover" />
        
        {/* Retake overlay */}
        {!disabled && (
          <View style={styles.retakeOverlay}>
            <View style={styles.retakeButton}>
              <Ionicons name="camera" size={18} color="#fff" />
              <Text style={styles.retakeText}>Retake</Text>
            </View>
          </View>
        )}

        {/* Label */}
        <View style={styles.labelBadge}>
          <Text style={styles.labelText}>{label}</Text>
        </View>

        {/* Checkmark for captured */}
        <View style={styles.checkmarkBadge}>
          <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: SaharaTheme.surface,
  },
  slot: {
    width: 90,
    height: 90,
  },
  emptySlot: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: SaharaTheme.outlineVariant,
    backgroundColor: SaharaTheme.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  emptyLabel: {
    fontFamily: Fonts?.sans,
    fontSize: 10,
    fontWeight: '600',
    color: SaharaTheme.onSurfaceVariant,
    letterSpacing: 0.5,
  },
  photoContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  retakeOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  retakeText: {
    fontFamily: Fonts?.sans,
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
    letterSpacing: 0.5,
  },
  labelBadge: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    borderRadius: 6,
    paddingVertical: 3,
    paddingHorizontal: 6,
  },
  labelText: {
    fontFamily: Fonts?.sans,
    fontSize: 9,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    letterSpacing: 0.8,
  },
  checkmarkBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
});
