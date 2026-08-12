import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SaharaTheme, Fonts } from '@/constants/theme';

interface EssentialsBannerProps {
  onPress?: () => void;
}

const TEXTURE_IMAGE = require('@/assets/images/essentials_kit.png');

export const EssentialsBanner: React.FC<EssentialsBannerProps> = ({ onPress }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <ImageBackground
        source={TEXTURE_IMAGE}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.darkenOverlay} />

        <View style={styles.glassCard}>
          <MaterialCommunityIcons
            name="flask-outline"
            size={24}
            color={SaharaTheme.primary}
            style={styles.icon}
          />
          <Text style={styles.title}>The Essentials Kit</Text>
          <Text style={styles.description}>
            A curated 3-step regimen for compromised barriers.
          </Text>
          <Text style={styles.actionText}>SHOP SET — $140</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 4,
    marginBottom: 32,
    shadowColor: '#3A302A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  background: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  darkenOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(250, 245, 238, 0.45)',
  },
  glassCard: {
    width: '92%',
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(216, 208, 200, 0.6)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  icon: {
    marginBottom: 6,
  },
  title: {
    fontFamily: Fonts?.serif,
    fontSize: 22,
    fontWeight: '500',
    color: SaharaTheme.primary,
    marginBottom: 4,
    textAlign: 'center',
  },
  description: {
    fontFamily: Fonts?.sans,
    fontSize: 13,
    color: SaharaTheme.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: 10,
  },
  actionText: {
    fontFamily: Fonts?.sans,
    fontSize: 11,
    fontWeight: '700',
    color: SaharaTheme.primary,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});
