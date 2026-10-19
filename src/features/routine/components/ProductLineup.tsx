import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/theme';
import type { RoutineStep } from '../types';

interface ProductLineupProps {
  steps: RoutineStep[];
}

export const ProductLineup: React.FC<ProductLineupProps> = ({ steps }) => {
  return (
    <LinearGradient
      colors={['#E8EFF5', '#F5F7F9']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.productsRow}>
        {steps.map((step, index) => (
          <View key={step.id} style={[styles.productContainer, { zIndex: steps.length - index }]}>
            <Image
              source={step.productImage}
              style={styles.productImage}
              resizeMode="contain"
            />
          </View>
        ))}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  productsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 20,
  },
  productContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  productImage: {
    width: 70,
    height: 100,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
});
