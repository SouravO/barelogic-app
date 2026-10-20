import { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, Fonts, SaharaTheme, spacing } from '@/src/theme';
import { ScreenHeader } from '@/components/layout/ScreenHeader';

interface CartItem {
  id: string;
  categoryTag: string;
  title: string;
  price: number;
  quantity: number;
  image: any;
}

const INITIAL_CART: CartItem[] = [
  {
    id: 'serum_01',
    categoryTag: 'SERUM 01',
    title: 'Barrier Repair Complex',
    price: 68,
    quantity: 1,
    image: require('@/assets/images/serum_01.png'),
  },
  {
    id: 'moisturizer_02',
    categoryTag: 'MOISTURIZER 02',
    title: 'Lipid Replenishing Cream',
    price: 85,
    quantity: 1,
    image: require('@/assets/images/moisturizer_02.png'),
  },
];

export default function CartScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [items, setItems] = useState<CartItem[]>(INITIAL_CART);

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Your Shopping Bag"
        onBackPress={handleBack}
      />

      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="shopping-bag" size={56} color={SaharaTheme.outline} />
          <Text style={styles.emptyTitle}>Your bag is empty</Text>
          <Text style={styles.emptyText}>
            Add clinical formulations to continue checkout.
          </Text>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => router.replace('/(tabs)/shop')}
            activeOpacity={0.88}
          >
            <Text style={styles.continueButtonText}>CONTINUE SHOPPING</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView
            contentContainerStyle={[
              styles.listContent,
              { paddingBottom: 150 + insets.bottom },
            ]}
            showsVerticalScrollIndicator={false}
          >
            {items.map((item) => (
              <View key={item.id} style={styles.cartCard}>
                <Image source={item.image} style={styles.thumb} resizeMode="cover" />

                <View style={styles.itemInfo}>
                  <Text style={styles.itemTag}>{item.categoryTag}</Text>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemPrice}>${item.price}</Text>
                </View>

                <View style={styles.itemActions}>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeItem(item.id)}
                    activeOpacity={0.7}
                    accessibilityLabel={`Remove ${item.title}`}
                  >
                    <Feather name="trash-2" size={16} color={SaharaTheme.error} />
                  </TouchableOpacity>

                  <View style={styles.stepper}>
                    <TouchableOpacity
                      style={styles.stepBtn}
                      onPress={() => updateQuantity(item.id, -1)}
                      activeOpacity={0.7}
                    >
                      <Feather name="minus" size={14} color={SaharaTheme.onSurfaceVariant} />
                    </TouchableOpacity>

                    <Text style={styles.qtyText}>{item.quantity}</Text>

                    <TouchableOpacity
                      style={styles.stepBtn}
                      onPress={() => updateQuantity(item.id, 1)}
                      activeOpacity={0.7}
                    >
                      <Feather name="plus" size={14} color={SaharaTheme.onSurfaceVariant} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}

            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryVal}>${subtotal}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Clinical Delivery</Text>
                <Text style={styles.freeVal}>COMPLIMENTARY</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalVal}>${subtotal}</Text>
              </View>
            </View>
          </ScrollView>

          <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
            <TouchableOpacity
              style={styles.checkoutBtn}
              onPress={() => Alert.alert('Checkout', `Order total: $${subtotal}. Thank you!`)}
              activeOpacity={0.88}
            >
              <Text style={styles.checkoutBtnText}>PROCEED TO CHECKOUT — ${subtotal}</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SaharaTheme.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.marginMobile,
    paddingTop: spacing.xl + 20,
    paddingBottom: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'GoogleSansText-Bold',
    fontSize: 20,
    color: colors.primary,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 12,
  },
  emptyTitle: {
    fontFamily: Fonts?.serif,
    fontSize: 24,
    color: SaharaTheme.primary,
  },
  emptyText: {
    fontFamily: Fonts?.sans,
    fontSize: 14,
    color: SaharaTheme.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 20,
  },
  continueButton: {
    marginTop: 8,
    backgroundColor: SaharaTheme.primary,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 30,
  },
  continueButtonText: {
    color: SaharaTheme.onPrimary,
    fontFamily: Fonts?.sans,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  listContent: {
    padding: 20,
    gap: 16,
  },
  cartCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SaharaTheme.surfaceContainerLow,
    padding: 14,
    borderRadius: 16,
    gap: 14,
  },
  thumb: {
    width: 72,
    height: 72,
    borderRadius: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemTag: {
    fontFamily: Fonts?.sans,
    fontSize: 10,
    fontWeight: '700',
    color: SaharaTheme.onSurfaceVariant,
    letterSpacing: 1,
  },
  itemTitle: {
    fontFamily: Fonts?.sans,
    fontSize: 14,
    fontWeight: '600',
    color: SaharaTheme.primary,
    marginTop: 2,
  },
  itemPrice: {
    fontFamily: Fonts?.sans,
    fontSize: 13,
    color: SaharaTheme.onSurfaceVariant,
    marginTop: 2,
  },
  itemActions: {
    alignItems: 'flex-end',
    gap: 10,
  },
  removeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: SaharaTheme.surfaceContainerLowest,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SaharaTheme.surfaceContainerLowest,
    borderRadius: 20,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: SaharaTheme.outlineVariant,
    gap: 8,
  },
  stepBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    fontFamily: Fonts?.sans,
    fontSize: 13,
    fontWeight: '600',
    color: SaharaTheme.onSurface,
    minWidth: 18,
    textAlign: 'center',
  },
  summaryCard: {
    backgroundColor: SaharaTheme.surfaceContainerLow,
    padding: 20,
    borderRadius: 16,
    marginTop: 4,
    gap: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    fontFamily: Fonts?.sans,
    fontSize: 14,
    color: SaharaTheme.onSurfaceVariant,
  },
  summaryVal: {
    fontFamily: Fonts?.sans,
    fontSize: 14,
    fontWeight: '600',
    color: SaharaTheme.onSurface,
  },
  freeVal: {
    fontFamily: Fonts?.sans,
    fontSize: 11,
    fontWeight: '700',
    color: SaharaTheme.primary,
    letterSpacing: 1,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: SaharaTheme.outlineVariant,
    marginVertical: 4,
  },
  totalLabel: {
    fontFamily: Fonts?.serif,
    fontSize: 18,
    color: SaharaTheme.primary,
  },
  totalVal: {
    fontFamily: Fonts?.sans,
    fontSize: 18,
    fontWeight: '700',
    color: SaharaTheme.primary,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: SaharaTheme.outlineVariant,
    backgroundColor: SaharaTheme.surface,
  },
  checkoutBtn: {
    backgroundColor: SaharaTheme.primary,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  checkoutBtnText: {
    color: SaharaTheme.onPrimary,
    fontFamily: Fonts?.sans,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
});