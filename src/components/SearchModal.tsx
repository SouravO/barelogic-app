import React, { useState } from 'react';
import {
  Modal,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, fontFamily } from '@/theme';
import { Text } from './ui/Text';
import type { ProductItem } from '@/features/home/types';

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
            <Ionicons name="arrow-back" size={24} color={colors.onSurface} />
          </TouchableOpacity>

          <View style={styles.inputWrapper}>
            <Ionicons name="search" size={18} color={colors.outline} style={styles.searchIcon} />
            <TextInput
              style={styles.input}
              placeholder="Search formulations, ingredients..."
              placeholderTextColor={colors.outline}
              value={query}
              onChangeText={setQuery}
              autoFocus
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery('')}>
                <Ionicons name="close-circle" size={18} color={colors.outline} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.content}>
          {query.length === 0 ? (
            <View style={styles.suggestionsContainer}>
              <Text variant="labelSmall" style={styles.sectionLabel}>POPULAR SEARCHES</Text>
              <View style={styles.tagWrap}>
                {SUGGESTIONS.map((tag) => (
                  <TouchableOpacity
                    key={tag}
                    style={styles.tagPill}
                    onPress={() => setQuery(tag)}
                    activeOpacity={0.7}
                  >
                    <Text variant="bodySmall" style={styles.tagText}>{tag}</Text>
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
                    <Text variant="labelSmall" style={styles.productTag}>{item.categoryTag}</Text>
                    <Text variant="bodyMedium" style={styles.productTitle}>{item.title}</Text>
                    <Text variant="bodySmall" style={styles.productPrice}>{item.price}</Text>
                  </View>
                  <Feather name="chevron-right" size={20} color={colors.outline} />
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
    backgroundColor: colors.background,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    gap: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.outlineVariant,
  },
  backBtn: {
    padding: spacing.xs,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 24,
    paddingHorizontal: spacing.sm,
    height: 44,
  },
  searchIcon: {
    marginRight: spacing.xs,
  },
  input: {
    flex: 1,
    fontFamily: fontFamily.sans,
    fontSize: 14,
    color: colors.onSurface,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  suggestionsContainer: {
    marginTop: spacing.xs,
  },
  sectionLabel: {
    color: colors.primary,
    letterSpacing: 1.5,
    marginBottom: spacing.md,
  },
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tagPill: {
    backgroundColor: colors.surfaceContainerLow,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.outlineVariant,
  },
  tagText: {
    color: colors.onSurfaceVariant,
  },
  listContent: {
    gap: spacing.md,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLow,
    padding: spacing.sm,
    borderRadius: 14,
    gap: spacing.sm,
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
    color: colors.onSurfaceVariant,
    letterSpacing: 1,
  },
  productTitle: {
    color: colors.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  productPrice: {
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
});
