import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SaharaTheme, Fonts } from '@/constants/theme';
import { Header } from '@/components/Header';
import { HeroBanner } from '@/components/HeroBanner';
import { ProductCard, ProductItem } from '@/components/ProductCard';
import { EssentialsBanner } from '@/components/EssentialsBanner';
import { NewFormulations } from '@/components/NewFormulations';
import { KysScannerModal } from '@/components/KysScannerModal';
import { SearchModal } from '@/components/SearchModal';

const BESTSELLERS: ProductItem[] = [
  {
    id: 'serum_01',
    categoryTag: 'SERUM 01',
    title: 'Barrier Repair Complex',
    price: '$68',
    badge: '10% Niacinamide',
    image: require('@/assets/images/serum_01.png'),
  },
  {
    id: 'moisturizer_02',
    categoryTag: 'MOISTURIZER 02',
    title: 'Lipid Replenishing Cream',
    price: '$85',
    image: require('@/assets/images/moisturizer_02.png'),
  },
];

export default function StorefrontSaharaScreen() {
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
    Alert.alert('Prescription Applied', 'Your 2-step clinical regimen ($153) was added to your bag!');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={SaharaTheme.surface} />

      <Header
        onMenuPress={() => Alert.alert('Menu', 'Bare Logic Navigation Menu')}
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
          <Text style={styles.sectionTitle}>Bestsellers</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/shop')} activeOpacity={0.7}>
            <Text style={styles.viewAllText}>VIEW ALL</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bestsellerGrid}>
          {BESTSELLERS.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              onPress={(item) =>
                Alert.alert(item.title, `${item.categoryTag} • ${item.price}\n\nClinical formulation designed for cellular barrier renewal.`)
              }
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
          onProductPress={(item) =>
            Alert.alert(item.title, `${item.categoryTag} • ${item.price}\n\nAdvanced clinical skin active.`)
          }
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
        onSelectProduct={(item) => handleAddToCart(item)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: SaharaTheme.surface,
  },
  scrollView: {
    flex: 1,
    backgroundColor: SaharaTheme.surface,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingBottom: 8,
    marginBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: SaharaTheme.outlineVariant,
  },
  sectionTitle: {
    fontFamily: Fonts?.serif,
    fontSize: 24,
    fontWeight: '500',
    color: SaharaTheme.primary,
  },
  viewAllText: {
    fontFamily: Fonts?.sans,
    fontSize: 11,
    fontWeight: '700',
    color: SaharaTheme.onSurfaceVariant,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  bestsellerGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
});
