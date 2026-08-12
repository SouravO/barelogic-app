import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { SaharaTheme, Fonts } from '@/constants/theme';
import { Header } from '@/components/Header';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Header />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarBox}>
            <Image
              source={require('@/assets/images/hero_kys.png')}
              style={styles.avatar}
            />
          </View>
          <Text style={styles.userName}>Dr. Sarah Jenkins</Text>
          <Text style={styles.userBio}>Cellular Skin Index: 94 • Sahara Regimen</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardHeader}>ACTIVE CLINICAL REGIMEN</Text>
          <View style={styles.regimenRow}>
            <MaterialCommunityIcons name="shield-check-outline" size={24} color={SaharaTheme.primary} />
            <View style={styles.regimenText}>
              <Text style={styles.regimenTitle}>Barrier Repair Phase 1</Text>
              <Text style={styles.regimenSub}>Morning: 10% Niacinamide • Night: Lipid Cream</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardHeader}>AI SKIN SCAN HISTORY</Text>
          <View style={styles.historyRow}>
            <View style={styles.historyDot} />
            <View style={styles.historyInfo}>
              <Text style={styles.historyDate}>Aug 12, 2026</Text>
              <Text style={styles.historyResult}>Luminosity 94/100 • TEWL Normal</Text>
            </View>
            <Feather name="chevron-right" size={20} color={SaharaTheme.outline} />
          </View>
        </View>

        <TouchableOpacity style={styles.menuItem}>
          <Feather name="package" size={20} color={SaharaTheme.onSurfaceVariant} />
          <Text style={styles.menuText}>Order Subscriptions & Deliveries</Text>
          <Feather name="chevron-right" size={18} color={SaharaTheme.outline} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Feather name="settings" size={20} color={SaharaTheme.onSurfaceVariant} />
          <Text style={styles.menuText}>Diagnostic & Privacy Settings</Text>
          <Feather name="chevron-right" size={18} color={SaharaTheme.outline} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SaharaTheme.surface,
  },
  content: {
    padding: 20,
    gap: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarBox: {
    width: 84,
    height: 84,
    borderRadius: 42,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: SaharaTheme.primary,
    marginBottom: 12,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  userName: {
    fontFamily: Fonts?.serif,
    fontSize: 24,
    color: SaharaTheme.primary,
    marginBottom: 4,
  },
  userBio: {
    fontFamily: Fonts?.sans,
    fontSize: 13,
    color: SaharaTheme.onSurfaceVariant,
  },
  card: {
    backgroundColor: SaharaTheme.surfaceContainerLow,
    padding: 16,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: SaharaTheme.outlineVariant,
  },
  cardHeader: {
    fontFamily: Fonts?.sans,
    fontSize: 11,
    fontWeight: '700',
    color: SaharaTheme.primary,
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  regimenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  regimenText: {
    flex: 1,
  },
  regimenTitle: {
    fontFamily: Fonts?.sans,
    fontSize: 14,
    fontWeight: '600',
    color: SaharaTheme.onSurface,
  },
  regimenSub: {
    fontFamily: Fonts?.sans,
    fontSize: 12,
    color: SaharaTheme.onSurfaceVariant,
    marginTop: 2,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  historyDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: SaharaTheme.primary,
  },
  historyInfo: {
    flex: 1,
  },
  historyDate: {
    fontFamily: Fonts?.sans,
    fontSize: 13,
    fontWeight: '600',
    color: SaharaTheme.onSurface,
  },
  historyResult: {
    fontFamily: Fonts?.sans,
    fontSize: 12,
    color: SaharaTheme.onSurfaceVariant,
    marginTop: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SaharaTheme.surfaceContainerLow,
    padding: 16,
    borderRadius: 14,
    gap: 12,
  },
  menuText: {
    flex: 1,
    fontFamily: Fonts?.sans,
    fontSize: 14,
    color: SaharaTheme.onSurface,
  },
});
