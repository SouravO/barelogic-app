import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Header } from '@/components/layout/Header';
import { colors, spacing } from '@/theme';
import { ScanHeroCard } from '../components/ScanHeroCard';
import { ScanSteps } from '../components/ScanSteps';
import { ScanTips } from '../components/ScanTips';
import { KysScannerModal } from '../components/KysScannerModal';

export const KysScreen: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Header />
      <ScreenContainer style={styles.content} padding>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <ScanHeroCard onStartScan={() => setModalVisible(true)} />
          <View style={styles.section}>
            <ScanSteps />
          </View>
          <View style={styles.section}>
            <ScanTips />
          </View>
        </ScrollView>
      </ScreenContainer>

      <KysScannerModal
        key={modalVisible ? 'open' : 'closed'}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  section: {
    marginTop: spacing.sm,
  },
});