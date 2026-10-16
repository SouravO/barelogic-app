import { Header } from '@/components/layout/Header';
import { SearchModal } from '@/components/SearchModal';
import { Text } from '@/components/ui/Text';
import { KysScannerModal } from '@/features/kys/components/KysScannerModal';
import { colors, fontFamily, spacing } from '@/theme';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { EssentialsBanner } from '../components/EssentialsBanner';
import { HeroBanner } from '../components/HeroBanner';
import { NewFormulations } from '../components/NewFormulations';
import { ProductCard } from '../components/ProductCard';
import { BESTSELLERS } from '../data/products';
import type { ProductItem } from '../types';

export const HomeScreen: React.FC = () => {
  const router = useRouter();
  const [cartCount, setCartCount] = useState(2);
  const [isKysVisible, setIsKysVisible] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const handleAddToCart = (product: ProductItem) => {
    setCartCount((prev) => prev + 1);
    Alert.alert('Added to Bag', `${product.title} has been added to your shopping bag.`);
  };

  const handleApplyRegimen = () => {
    setCartCount((prev) => prev + 2);
    Alert.alert(
      'Prescription Applied',
      'Your 2-step clinical regimen ($153) was added to your bag!'
    );
  };

  const handleProductPress = (item: ProductItem) => {
    Alert.alert(
      item.title,
      `${item.categoryTag} • ${item.price}\n\nClinical formulation designed for cellular barrier renewal.`
    );
  };

  return (
    <View style={styles.container}>
      <Header
        onMenuPress={() => Alert.alert('Menu', 'Notwo Navigation Menu')}
        onSearchPress={() => setIsSearchVisible(true)}
        onCartPress={() => router.push('/(tabs)/cart')}
        onNotificationPress={() => Alert.alert('Notifications', 'You have no new alerts.')}
        cartCount={cartCount}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section: KYS AI Tool */}
        <HeroBanner onStartScan={() => setIsKysVisible(true)} />

        {/* Bestsellers Section */}
        <View style={styles.sectionHeader}>
          <Text variant="headlineMedium" style={styles.sectionTitle}>
            Bestsellers
          </Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/shop')} activeOpacity={0.7}>
            <Text variant="labelMedium" style={styles.viewAllText}>
              VIEW ALL
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bestsellerGrid}>
          {BESTSELLERS.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              onPress={handleProductPress}
            />
          ))}
        </View>

        {/* Essentials Kit Banner */}
        <EssentialsBanner
          onPress={() =>
            Alert.alert(
              'The Essentials Kit',
              'Curated 3-step regimen for compromised barriers. Includes Barrier Repair Complex, Lipid Cream, and Clarifying Solution.\n\nPrice: $140 (Save $45)'
            )
          }
        />

        {/* New Formulations Section */}
        <NewFormulations
          onAddToCart={handleAddToCart}
          onProductPress={handleProductPress}
          onViewAll={() => router.push('/(tabs)/shop')}
        />
      </ScrollView>

      {/* KYS AI Scanner Modal */}
      <KysScannerModal
        visible={isKysVisible}
        onClose={() => setIsKysVisible(false)}
        onApplyRegimen={handleApplyRegimen}
      />

      {/* Search Modal */}
      <SearchModal
        visible={isSearchVisible}
        onClose={() => setIsSearchVisible(false)}
        onSelectProduct={handleAddToCart}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scrollView: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  contentContainer: {
    paddingHorizontal: spacing.marginMobile,
    paddingBottom: spacing.xxxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingBottom: spacing.sm,
    marginBottom: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.outlineVariant,
  },
  sectionTitle: {
    fontFamily: fontFamily.serif,
    color: colors.primary,
  },
  viewAllText: {
    color: colors.onSurfaceVariant,
  },
  bestsellerGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
});
