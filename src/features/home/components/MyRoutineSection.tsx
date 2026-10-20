import { colors, spacing } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface MyRoutineSectionProps {
  onViewAllPress?: () => void;
  onRoutinePress?: (routine: 'morning' | 'night') => void;
}

export const MyRoutineSection: React.FC<MyRoutineSectionProps> = ({
  onViewAllPress,
  onRoutinePress,
}) => {
  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Routine</Text>
        <TouchableOpacity onPress={onViewAllPress} activeOpacity={0.7}>
          <Text style={styles.viewAllText}>View All →</Text>
        </TouchableOpacity>
      </View>

      {/* Routine Cards */}
      <View style={styles.cardsContainer}>
        {/* Morning Routine */}
        <TouchableOpacity
          style={styles.routineCard}
          onPress={() => onRoutinePress?.('morning')}
          activeOpacity={0.9}
        >
          <ImageBackground
            source={require('@/assets/images/moisturizer_02.png')}
            style={styles.cardBackground}
            imageStyle={styles.backgroundImage}
            resizeMode="cover"
          >
            <View style={styles.overlay} />
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <Ionicons name="sunny" size={20} color="#F59E0B" />
                <Text style={styles.routineTime}>Morning</Text>
              </View>
              
              <Text style={styles.routineSteps}>
                Cleanse → Treat →{'\n'}Moisturise → SPF
              </Text>
            </View>
          </ImageBackground>
        </TouchableOpacity>

        {/* Night Routine */}
        <TouchableOpacity
          style={styles.routineCard}
          onPress={() => onRoutinePress?.('night')}
          activeOpacity={0.9}
        >
          <ImageBackground
            source={require('@/assets/images/serum_01.png')}
            style={styles.cardBackground}
            imageStyle={styles.backgroundImage}
            resizeMode="cover"
          >
            <View style={styles.overlay} />
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <Ionicons name="moon" size={20} color={colors.primary} />
                <Text style={styles.routineTime}>Night</Text>
              </View>
              
              <Text style={styles.routineSteps}>
                Cleanse → Treat →{'\n'}Moisturise
              </Text>
            </View>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.marginMobile,
  },
  headerTitle: {
    fontFamily: 'GoogleSansText-Bold',
    fontSize: 22,
    color: colors.primary,
    fontWeight: '600',
  },
  viewAllText: {
    fontFamily: 'GoogleSansText-Regular',
    color: colors.onSurfaceVariant,
    fontSize: 13,
  },
  cardsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.marginMobile,
    gap: spacing.md,
  },
  routineCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardBackground: {
    width: '100%',
    minHeight: 180,
  },
  backgroundImage: {
    borderRadius: 16,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(245, 247, 249, 0.65)', // Semi-transparent overlay for text readability
  },
  cardContent: {
    padding: spacing.md,
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  routineTime: {
    fontFamily: 'GoogleSansText-Bold',
    fontSize: 16,
    color: colors.onSurface,
    fontWeight: '600',
  },
  routineSteps: {
    fontFamily: 'GoogleSansText-Regular',
    fontSize: 12,
    color: colors.onSurfaceVariant,
    lineHeight: 18,
  },
});
