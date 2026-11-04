/**
 * Face ID-style overlay: circular camera mask, a ring of ticks that fill as
 * the head moves, and Left / Front / Right badges that turn into thumbnails.
 */

import { Fonts } from '@/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useMemo } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeIn,
  interpolateColor,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
  ZoomIn,
} from 'react-native-reanimated';
import Svg, { Circle, Line, Path } from 'react-native-svg';
import type { SweepCircle } from '../hooks/useFaceSweepCapture';
import type { CapturedImages, HeadPose, PositionIssue, SweepPhase } from '../types/selfie-capture.types';
import { formatPoseForDebug } from '../utils/poseValidation';

export const SWEEP_GREEN = '#34C759';
const TICK_IDLE = 'rgba(255,255,255,0.28)';
const MASK_COLOR = 'rgba(5,8,22,0.9)';
const TICK_GAP = 10;
const TICK_IDLE_LEN = 9;
const TICK_FILLED_LEN = 18;

const AnimatedLine = Animated.createAnimatedComponent(Line);

/** Largest comfortable circle for a camera view of this size. */
export function sweepCircleFor(width: number, height: number): SweepCircle {
  // Leave room above for the instruction and below for the badge row.
  const diameter = Math.min(width * 0.72, height - 250);
  const cy = Math.max(110 + diameter / 2, height * 0.44);
  return { cx: width / 2, cy, diameter };
}

interface FaceSweepRingProps {
  width: number;
  height: number;
  circle: SweepCircle;
  ring: boolean[];
  images: CapturedImages;
  phase: SweepPhase;
  instruction: string;
  positionIssue: PositionIssue;
  debugPose?: HeadPose | null;
}

export const FaceSweepRing: React.FC<FaceSweepRingProps> = ({
  width,
  height,
  circle,
  ring,
  images,
  phase,
  instruction,
  positionIssue,
  debugPose,
}) => {
  const r = circle.diameter / 2;
  const complete = phase === 'complete' || phase === 'review';
  const tracking = positionIssue === 'none';

  // Rect with a circular hole (even-odd fill).
  const maskPath = useMemo(
    () =>
      `M0 0H${width}V${height}H0Z ` +
      `M${circle.cx - r} ${circle.cy} a${r} ${r} 0 1 0 ${r * 2} 0 a${r} ${r} 0 1 0 ${-r * 2} 0Z`,
    [width, height, circle.cx, circle.cy, r]
  );

  const step = (Math.PI * 2) / ring.length;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width={width} height={height}>
        <Path d={maskPath} fill={MASK_COLOR} fillRule="evenodd" />
        <Circle
          cx={circle.cx}
          cy={circle.cy}
          r={r}
          stroke={complete ? SWEEP_GREEN : tracking ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.15)'}
          strokeWidth={complete ? 3 : 1.5}
          fill="none"
        />
        {ring.map((filled, i) => (
          <Tick
            key={i}
            angle={(i + 0.5) * step}
            cx={circle.cx}
            cy={circle.cy}
            radius={r + TICK_GAP}
            filled={filled}
          />
        ))}
      </Svg>

      {/* Instruction above the circle */}
      <View style={[styles.instructionWrap, { top: Math.max(8, circle.cy - r - TICK_GAP - TICK_FILLED_LEN - 56) }]}>
        <Animated.Text
          key={instruction}
          entering={FadeIn.duration(200)}
          style={styles.instruction}
          accessibilityLiveRegion="polite"
        >
          {instruction}
        </Animated.Text>
      </View>

      {/* Angle badges in a row under the ring; user's left on screen left (mirrored preview) */}
      {(() => {
        const y = circle.cy + r + TICK_GAP + TICK_FILLED_LEN + 34;
        return (
          <>
            <AngleBadge uri={images[1]} icon="arrow-left" label="Left" x={circle.cx - BADGE_SPACING} y={y} />
            <AngleBadge uri={images[0]} icon="face-man" label="Front" x={circle.cx} y={y} />
            <AngleBadge uri={images[2]} icon="arrow-right" label="Right" x={circle.cx + BADGE_SPACING} y={y} />
          </>
        );
      })()}

      {complete && (
        <Animated.View
          entering={ZoomIn.springify().damping(12)}
          style={[
            styles.doneBadge,
            { left: circle.cx - 36, top: circle.cy - 36 },
          ]}
        >
          <MaterialCommunityIcons name="check-bold" size={40} color="#fff" />
        </Animated.View>
      )}

      {__DEV__ && debugPose && (
        <Text style={styles.debug}>{formatPoseForDebug(debugPose)}</Text>
      )}
    </View>
  );
};

/** One radial tick; grows and turns green when its segment is filled. */
const Tick: React.FC<{ angle: number; cx: number; cy: number; radius: number; filled: boolean }> = ({
  angle,
  cx,
  cy,
  radius,
  filled,
}) => {
  const progress = useSharedValue(filled ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(filled ? 1 : 0, { duration: 220 });
  }, [filled, progress]);

  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  const animatedProps = useAnimatedProps(() => {
    const len = TICK_IDLE_LEN + (TICK_FILLED_LEN - TICK_IDLE_LEN) * progress.value;
    return {
      x2: cx + (radius + len) * cos,
      y2: cy + (radius + len) * sin,
      stroke: interpolateColor(progress.value, [0, 1], [TICK_IDLE, SWEEP_GREEN]),
    };
  });

  return (
    <AnimatedLine
      x1={cx + radius * cos}
      y1={cy + radius * sin}
      strokeWidth={3}
      strokeLinecap="round"
      animatedProps={animatedProps}
    />
  );
};

const BADGE = 46;
const BADGE_SPACING = 72;

const AngleBadge: React.FC<{
  uri: string | null;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  label: string;
  x: number;
  y: number;
}> = ({ uri, icon, label, x, y }) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (uri) {
      scale.value = withSequence(withTiming(1.25, { duration: 140 }), withSpring(1, { damping: 10 }));
    }
  }, [uri, scale]);

  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <View style={[styles.badgeWrap, { left: x - BADGE / 2, top: y - BADGE / 2 }]}>
      <Animated.View style={[styles.badge, uri ? styles.badgeDone : styles.badgePending, style]}>
        {uri ? (
          <>
            <Image source={{ uri }} style={styles.badgeImage} />
            <View style={styles.badgeCheck}>
              <MaterialCommunityIcons name="check" size={11} color="#fff" />
            </View>
          </>
        ) : (
          <MaterialCommunityIcons name={icon} size={20} color="rgba(255,255,255,0.7)" />
        )}
      </Animated.View>
      <Text style={[styles.badgeLabel, uri && { color: SWEEP_GREEN }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  instructionWrap: {
    position: 'absolute',
    left: 24,
    right: 24,
    alignItems: 'center',
  },
  instruction: {
    color: '#fff',
    fontSize: 17,
    lineHeight: 23,
    textAlign: 'center',
    fontFamily: Fonts.rounded,
  },
  badgeWrap: {
    position: 'absolute',
    width: BADGE,
    alignItems: 'center',
  },
  badge: {
    width: BADGE,
    height: BADGE,
    borderRadius: BADGE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgePending: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: 'rgba(255,255,255,0.4)',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  badgeDone: {
    borderWidth: 2,
    borderColor: SWEEP_GREEN,
  },
  badgeImage: {
    width: BADGE - 4,
    height: BADGE - 4,
    borderRadius: (BADGE - 4) / 2,
  },
  badgeCheck: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: SWEEP_GREEN,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#050816',
  },
  badgeLabel: {
    marginTop: 4,
    width: 60,
    textAlign: 'center',
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
    fontFamily: Fonts.rounded,
  },
  doneBadge: {
    position: 'absolute',
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: SWEEP_GREEN,
    alignItems: 'center',
    justifyContent: 'center',
  },
  debug: {
    position: 'absolute',
    bottom: 6,
    alignSelf: 'center',
    color: '#FFD60A',
    fontSize: 11,
    fontFamily: Fonts.mono,
  },
});
