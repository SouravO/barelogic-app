import { Header } from '@/components/layout/Header';
import { SearchModal } from '@/components/SearchModal';
import { KysScannerModal } from '@/features/kys/components/KysScannerModal';
import { colors, spacing } from '@/theme';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { CategoryGrid } from '../components/CategoryGrid';
import { ConcernCards } from '../components/ConcernCards';
import { HeroCarousel } from '../components/HeroCarousel';
import { KnowYourSkinCard } from '../components/KnowYourSkinCard';
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

  return (
    <View style={styles.container}>
      <Header
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
        {/* Hero Carousel */}
        <HeroCarousel onSlidePress={(slide) => Alert.alert(slide.title, slide.description)} />

        {/* Know Your Skin Card */}
        <KnowYourSkinCard onStartScan={() => setIsKysVisible(true)} />

        {/* Shop by Category Section */}
        <CategoryGrid
          onCategoryPress={(category) => Alert.alert(category.name, `Browse ${category.name}`)}
          onViewAllPress={() => router.push('/(tabs)/shop')}
        />

        {/* Shop by Concern Section */}
        <ConcernCards
          onConcernPress={(concern) => Alert.alert(concern.name, `Shop for ${concern.name}`)}
          onViewAllPress={() => router.push('/(tabs)/shop')}
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
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl,
  },
});
