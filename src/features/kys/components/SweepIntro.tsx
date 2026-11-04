/**
 * One-screen intro shown before the camera: an animated head tracing a
 * circle, short tips, and a single Start button.
 */

import { Fonts } from '@/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Line } from 'react-native-svg';
import { SWEEP_GREEN } from './FaceSweepRing';

const DEMO_SIZE = 168;
const DEMO_TICKS = 36;
const ORBIT = 14;

const TIPS: { icon: React.ComponentProps<typeof MaterialCommunityIcons>['name']; text: string }[] = [
  { icon: 'white-balance-sunny', text: 'Face a window or bright light' },
  { icon: 'glasses', text: 'Remove glasses, pull hair back' },
  { icon: 'cellphone', text: 'Hold your phone at eye level' },
];

interface SweepIntroProps {
  onStart: () => void;
  onManual: () => void;
}

export const SweepIntro: React.FC<SweepIntroProps> = ({ onStart, onManual }) => {
  const t = useSharedValue(0);

  useEffect(() => {
    t.value = withRepeat(withTiming(Math.PI * 2, { duration: 2600, easing: Easing.linear }), -1, false);
  }, [t]);

  // Face icon traces a small circle, like the head should.
  const headStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: Math.cos(t.value) * ORBIT },
      { translateY: Math.sin(t.value) * ORBIT },
    ],
  }));

  // Green highlight sweeping round the ring.
  const sweepStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${t.value}rad` }],
  }));

  const r = DEMO_SIZE / 2 - 14;
  const c = DEMO_SIZE / 2;

  return (
    <View style={styles.container}>
      <View style={styles.demo}>
        <Svg width={DEMO_SIZE} height={DEMO_SIZE} style={StyleSheet.absoluteFill}>
          {Array.from({ length: DEMO_TICKS }).map((_, i) => {
            const a = (i / DEMO_TICKS) * Math.PI * 2;
            return (
              <Line
                key={i}
                x1={c + r * Math.cos(a)}
                y1={c + r * Math.sin(a)}
                x2={c + (r + 8) * Math.cos(a)}
                y2={c + (r + 8) * Math.sin(a)}
                stroke="rgba(255,255,255,0.25)"
                strokeWidth={2.5}
                strokeLinecap="round"
              />
            );
          })}
        </Svg>
        <Animated.View style={[StyleSheet.absoluteFill, sweepStyle]}>
          <View style={[styles.sweepDot, { left: c + r + 4 - 5, top: c - 5 }]} />
        </Animated.View>
        <Animated.View style={headStyle}>
          <MaterialCommunityIcons name="face-man-outline" size={72} color="#fff" />
        </Animated.View>
      </View>

      <Text style={styles.title}>Scan your face</Text>
      <Text style={styles.subtitle}>
        Keep your face in the circle and move your head slowly in a circle. We take the
        front, left and right photos automatically.
      </Text>

      <View style={styles.tips}>
        {TIPS.map((tip) => (
          <View key={tip.text} style={styles.tipRow}>
            <MaterialCommunityIcons name={tip.icon} size={18} color={SWEEP_GREEN} />
            <Text style={styles.tipText}>{tip.text}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.startBtn} onPress={onStart} activeOpacity={0.85}>
        <Text style={styles.startText}>Get started</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onManual} hitSlop={12} activeOpacity={0.7}>
        <Text style={styles.manualText}>Take photos manually instead</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 14,
  },
  demo: {
    width: DEMO_SIZE,
    height: DEMO_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  sweepDot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: SWEEP_GREEN,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontFamily: Fonts.rounded,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 15,
    lineHeight: 21,
    textAlign: 'center',
    fontFamily: Fonts.sans,
  },
  tips: {
    alignSelf: 'stretch',
    gap: 10,
    marginTop: 8,
    marginBottom: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tipText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
    fontFamily: Fonts.sans,
  },
  startBtn: {
    alignSelf: 'stretch',
    height: 52,
    borderRadius: 26,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  startText: {
    color: '#050816',
    fontSize: 16,
    fontFamily: Fonts.rounded,
  },
  manualText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    textDecorationLine: 'underline',
    fontFamily: Fonts.sans,
  },
});
