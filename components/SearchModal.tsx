import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SaharaTheme, Fonts } from '@/constants/theme';
import { ProductItem } from './ProductCard';

interface SearchModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectProduct?: (product: ProductItem) => void;
}

const SEARCH_CATALOG: ProductItem[] = [
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

const SUGGESTIONS = ['Niacinamide', 'Lipid Repair', 'Peptides', 'AHA/BHA Exfoliant', 'Serum'];

export const SearchModal: React.FC<SearchModalProps> = ({
  visible,
  onClose,
  onSelectProduct,
}) => {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');

  const filteredProducts = SEARCH_CATALOG.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.categoryTag.toLowerCase().includes(query.toLowerCase()) ||
      (item.badge && item.badge.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <Modal visible={visible} animationType="fade" transparent={false}>
      <View style={styles.container}>
        <View style={[styles.searchHeader, { paddingTop: Math.max(insets.top, 16) + 12 }]}>
          <TouchableOpacity onPress={onClose} style={styles.backBtn} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={24} color={SaharaTheme.onSurface} />
          </TouchableOpacity>

          <View style={styles.inputWrapper}>
            <Ionicons name="search" size={18} color={SaharaTheme.outline} style={styles.searchIcon} />
            <TextInput
              style={styles.input}
              placeholder="Search formulations, ingredients..."
              placeholderTextColor={SaharaTheme.outline}
              value={query}
              onChangeText={setQuery}
              autoFocus
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery('')}>
                <Ionicons name="close-circle" size={18} color={SaharaTheme.outline} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.content}>
          {query.length === 0 ? (
            <View style={styles.suggestionsContainer}>
              <Text style={styles.sectionLabel}>POPULAR SEARCHES</Text>
              <View style={styles.tagWrap}>
                {SUGGESTIONS.map((tag) => (
                  <TouchableOpacity
                    key={tag}
                    style={styles.tagPill}
                    onPress={() => setQuery(tag)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.tagText}>{tag}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : (
            <FlatList
              data={filteredProducts}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.productRow}
                  onPress={() => {
                    onSelectProduct?.(item);
                    onClose();
                  }}
                  activeOpacity={0.8}
                >
                  <Image source={item.image} style={styles.thumb} />
                  <View style={styles.productInfo}>
                    <Text style={styles.productTag}>{item.categoryTag}</Text>
                    <Text style={styles.productTitle}>{item.title}</Text>
                    <Text style={styles.productPrice}>{item.price}</Text>
                  </View>
                  <Feather name="chevron-right" size={20} color={SaharaTheme.outline} />
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SaharaTheme.background,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: SaharaTheme.outlineVariant,
  },
  backBtn: {
    padding: 4,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SaharaTheme.surfaceContainerLow,
    borderRadius: 24,
    paddingHorizontal: 14,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontFamily: Fonts?.sans,
    fontSize: 14,
    color: SaharaTheme.onSurface,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  suggestionsContainer: {
    marginTop: 8,
  },
  sectionLabel: {
    fontFamily: Fonts?.sans,
    fontSize: 11,
    fontWeight: '700',
    color: SaharaTheme.primary,
    letterSpacing: 1.5,
    marginBottom: 16,
  },
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tagPill: {
    backgroundColor: SaharaTheme.surfaceContainerLow,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: SaharaTheme.outlineVariant,
  },
  tagText: {
    fontFamily: Fonts?.sans,
    fontSize: 13,
    color: SaharaTheme.onSurfaceVariant,
  },
  listContent: {
    gap: 16,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SaharaTheme.surfaceContainerLow,
    padding: 12,
    borderRadius: 14,
    gap: 14,
  },
  thumb: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
  },
  productTag: {
    fontFamily: Fonts?.sans,
    fontSize: 10,
    fontWeight: '700',
    color: SaharaTheme.onSurfaceVariant,
    letterSpacing: 1,
  },
  productTitle: {
    fontFamily: Fonts?.sans,
    fontSize: 14,
    fontWeight: '600',
    color: SaharaTheme.primary,
    marginTop: 2,
  },
  productPrice: {
    fontFamily: Fonts?.sans,
    fontSize: 13,
    color: SaharaTheme.onSurfaceVariant,
    marginTop: 2,
  },
});
