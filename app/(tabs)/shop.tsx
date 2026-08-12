import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SaharaTheme, Fonts } from '@/constants/theme';
import { Header } from '@/components/Header';
import { ProductCard, ProductItem } from '@/components/ProductCard';

const CATEGORIES = ['ALL', 'SERUMS', 'MOISTURIZERS', 'TONERS', 'EYE CARE', 'SETS'];

const ALL_PRODUCTS: ProductItem[] = [
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
  {
    id: 'eye_01',
    categoryTag: 'EYE 01',
    title: 'Peptide Eye Matrix',
    price: '$55',
    image: require('@/assets/images/eye_01.png'),
  },
  {
    id: 'toner_02',
    categoryTag: 'TONER 02',
    title: 'Clarifying Acid Solution',
    price: '$42',
    badge: 'AHA/BHA',
    image: require('@/assets/images/toner_02.png'),
  },
];

export default function ShopScreen() {
  const [activeCategory, setActiveCategory] = useState('ALL');

  return (
    <View style={styles.container}>
      <Header />

      <View style={styles.titleSection}>
        <Text style={styles.pageTitle}>Clinical Formulations</Text>
        <Text style={styles.pageSub}>Medical-grade skincare engineered for high efficacy.</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryChip,
                activeCategory === cat && styles.activeChip,
              ]}
              onPress={() => setActiveCategory(cat)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.chipText,
                  activeCategory === cat && styles.activeChipText,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.gridContent} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {ALL_PRODUCTS.map((product) => (
            <View key={product.id} style={styles.gridItem}>
              <ProductCard
                product={product}
                onAddToCart={(item) =>
                  Alert.alert('Added to Bag', `${item.title} added to shopping bag.`)
                }
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SaharaTheme.surface,
  },
  titleSection: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: SaharaTheme.outlineVariant,
  },
  pageTitle: {
    fontFamily: Fonts?.serif,
    fontSize: 28,
    color: SaharaTheme.primary,
    marginBottom: 4,
  },
  pageSub: {
    fontFamily: Fonts?.sans,
    fontSize: 13,
    color: SaharaTheme.onSurfaceVariant,
    marginBottom: 16,
  },
  categoryScroll: {
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: SaharaTheme.surfaceContainerLow,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: SaharaTheme.outlineVariant,
  },
  activeChip: {
    backgroundColor: SaharaTheme.primary,
    borderColor: SaharaTheme.primary,
  },
  chipText: {
    fontFamily: Fonts?.sans,
    fontSize: 11,
    fontWeight: '700',
    color: SaharaTheme.onSurfaceVariant,
    letterSpacing: 1,
  },
  activeChipText: {
    color: SaharaTheme.onPrimary,
  },
  gridContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  gridItem: {
    width: '47%',
  },
});
