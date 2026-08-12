import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SaharaTheme, Fonts } from '@/constants/theme';

interface HeroBannerProps {
  onStartScan?: () => void;
}

const HERO_IMAGE = require('@/assets/images/hero_kys.png');

export const HeroBanner: React.FC<HeroBannerProps> = ({ onStartScan }) => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={HERO_IMAGE}
        style={styles.imageBackground}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(250, 245, 238, 0.15)', 'rgba(250, 245, 238, 0.75)', 'rgba(250, 245, 238, 0.98)']}
          locations={[0.2, 0.65, 1.0]}
          style={styles.gradientOverlay}
        >
          <View style={styles.content}>
            <Text style={styles.tagline}>DIAGNOSTIC INTELLIGENCE</Text>
            <Text style={styles.title}>Know Your Skin</Text>
            <Text style={styles.description}>
              Our proprietary AI analyzes 14 markers to formulate a regimen tailored to your precise cellular needs.
            </Text>

            <TouchableOpacity
              style={styles.ctaButton}
              onPress={onStartScan}
              activeOpacity={0.85}
            >
              <Text style={styles.ctaButtonText}>START SCAN</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 480,
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 16,
    marginBottom: 32,
    shadowColor: '#3A302A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  imageBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingBottom: 36,
  },
  content: {
    alignItems: 'center',
    textAlign: 'center',
  },
  tagline: {
    fontFamily: Fonts?.sans,
    fontSize: 11,
    fontWeight: '700',
    color: SaharaTheme.primary,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  title: {
    fontFamily: Fonts?.serif,
    fontSize: 34,
    fontWeight: '500',
    color: SaharaTheme.primary,
    letterSpacing: -0.5,
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontFamily: Fonts?.sans,
    fontSize: 15,
    lineHeight: 22,
    color: SaharaTheme.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: 24,
    maxWidth: 320,
  },
  ctaButton: {
    backgroundColor: SaharaTheme.primary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 30,
    shadowColor: SaharaTheme.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  ctaButtonText: {
    color: SaharaTheme.onPrimary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.8,
    textTransform: 'uppercase',
  },
});
