import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SaharaTheme, Fonts } from '@/constants/theme';
import { Header } from '@/components/Header';

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

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <SafeAreaView style={styles.container}>
      <Header cartCount={items.reduce((acc, i) => acc + i.quantity, 0)} />

      <View style={styles.headerSection}>
        <Text style={styles.pageTitle}>Your Shopping Bag</Text>
        <Text style={styles.pageSub}>{items.length} Clinical Formulations Selected</Text>
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="shopping-bag" size={48} color={SaharaTheme.outline} />
          <Text style={styles.emptyText}>Your shopping bag is empty.</Text>
        </View>
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
            {items.map((item) => (
              <View key={item.id} style={styles.cartCard}>
                <Image source={item.image} style={styles.thumb} resizeMode="cover" />

                <View style={styles.itemInfo}>
                  <Text style={styles.itemTag}>{item.categoryTag}</Text>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemPrice}>${item.price}</Text>
                </View>

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

          <View style={styles.footer}>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SaharaTheme.surface,
  },
  headerSection: {
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
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  emptyText: {
    fontFamily: Fonts?.sans,
    fontSize: 15,
    color: SaharaTheme.onSurfaceVariant,
  },
  listContent: {
    padding: 20,
    gap: 16,
  },
  cartCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SaharaTheme.surfaceContainerLow,
    padding: 12,
    borderRadius: 14,
    gap: 14,
  },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: 10,
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
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    fontFamily: Fonts?.sans,
    fontSize: 13,
    fontWeight: '600',
    color: SaharaTheme.onSurface,
  },
  summaryCard: {
    backgroundColor: SaharaTheme.surfaceContainerLow,
    padding: 20,
    borderRadius: 16,
    marginTop: 12,
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
