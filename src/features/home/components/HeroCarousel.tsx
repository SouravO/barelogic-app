import { colors, fontSize, spacing } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  ImageBackground,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { HERO_SLIDES, HeroSlide } from '../data/heroSlides';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SLIDE_WIDTH = SCREEN_WIDTH; // Full screen width
const CARD_HEIGHT = 300; // Consistent card height
const AUTO_SCROLL_INTERVAL = 4000; // 4 seconds

interface HeroCarouselProps {
  onSlidePress?: (slide: HeroSlide) => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ onSlidePress }) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const autoScrollTimer = useRef<NodeJS.Timeout | null>(null);

  // Handle scroll position change
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / SLIDE_WIDTH);
    setCurrentIndex(index);
  };

  // Auto-scroll logic
  useEffect(() => {
    if (isUserInteracting) return;

    autoScrollTimer.current = setInterval(() => {
      const nextIndex = (currentIndex + 1) % HERO_SLIDES.length;
      scrollViewRef.current?.scrollTo({
        x: nextIndex * SLIDE_WIDTH,
        animated: true,
      });
    }, AUTO_SCROLL_INTERVAL);

    return () => {
      if (autoScrollTimer.current) {
        clearInterval(autoScrollTimer.current);
      }
    };
  }, [currentIndex, isUserInteracting]);

  // Handle user interaction
  const handleScrollBeginDrag = () => {
    setIsUserInteracting(true);
  };

  const handleScrollEndDrag = () => {
    // Resume auto-scroll after 2 seconds of no interaction
    setTimeout(() => {
      setIsUserInteracting(false);
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        onScrollBeginDrag={handleScrollBeginDrag}
        onScrollEndDrag={handleScrollEndDrag}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={SLIDE_WIDTH}
        snapToAlignment="center"
        contentContainerStyle={styles.scrollContent}
      >
        {HERO_SLIDES.map((slide) => (
          <HeroSlideComponent
            key={slide.id}
            slide={slide}
            onPress={() => onSlidePress?.(slide)}
          />
        ))}
      </ScrollView>

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {HERO_SLIDES.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === currentIndex && styles.dotActive,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

// Individual Slide Component
const HeroSlideComponent: React.FC<{
  slide: HeroSlide;
  onPress?: () => void;
}> = ({ slide, onPress }) => {
  return (
    <View style={styles.slide}>
      <ImageBackground
        source={slide.image}
        style={styles.slideBackground}
        resizeMode="cover"
        imageStyle={styles.backgroundImage}
      >
          <View style={styles.contentContainer}>
            {/* Label */}
            <View style={styles.labelContainer}>
              <Text style={styles.label}>
                {slide.label}
              </Text>
            </View>

            {/* Title */}
            <Text style={styles.title}>
              {slide.title}
            </Text>

            {/* Description */}
            <Text style={styles.description}>
              {slide.description}
            </Text>

            {/* Button */}
            <TouchableOpacity
              style={styles.button}
              onPress={onPress}
              activeOpacity={0.9}
            >
              <Text style={styles.buttonText}>
                {slide.buttonText}
              </Text>
              <Ionicons name="arrow-forward" size={18} color={colors.onSurface} />
            </TouchableOpacity>
          </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.sm,
    position: 'relative',
  },
  scrollContent: {
    paddingHorizontal: 0,
  },
  slide: {
    width: SLIDE_WIDTH,
    height: CARD_HEIGHT,
    padding:15,
  },
  slideBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  backgroundImage: {
    borderRadius: 15,
  },
  gradientOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  contentContainer: {
    width:'90%',
    padding: 15,
    height: CARD_HEIGHT - 30
  },
  labelContainer: {
    marginBottom: spacing.md,
  },
  label: {
    fontFamily: 'GoogleSansText-Regular',
    color: colors.onPrimary,
    opacity: 0.95,
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontSize: fontSize.bodySm,
  },
  title: {
    fontFamily: 'GoogleSansText-Bold',
    color: colors.onPrimary,
    fontWeight: '700',
    marginBottom: spacing.sm,
    fontSize: fontSize.headlineMd,
    lineHeight: 28,
  },
  description: {
    fontFamily: 'GoogleSansText-Regular',
    color: colors.onPrimary,
    opacity: 0.95,
    marginBottom: spacing.lg,
    lineHeight: 26,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm + 6,
    paddingVertical: spacing.sm,
    borderRadius: 28,
    alignSelf: 'flex-start',
    gap: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    fontFamily: 'GoogleSansText-Bold',
    color: colors.onSurface,
    fontWeight: '700',
    fontSize: 13,
  },
  pagination: {
    flexDirection: 'row',
    gap: spacing.sm,
    position: 'absolute',
    bottom: spacing.lg,
    left: '50%',
    transform: [{ translateX: -36 }], // Center the dots (approximate width / 2)
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.surface,
    opacity: 0.4,
  },
  dotActive: {
    opacity: 1,
    width: 24,
  },
});
