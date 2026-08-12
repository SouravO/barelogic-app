import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import { SaharaTheme } from '@/constants/theme';
import { Header } from '@/components/Header';
import { HeroBanner } from '@/components/HeroBanner';
import { KysScannerModal } from '@/components/KysScannerModal';

export default function KysScreen() {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.content}>
        <HeroBanner onStartScan={() => setModalVisible(true)} />
      </View>
      <KysScannerModal visible={modalVisible} onClose={() => setModalVisible(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SaharaTheme.surface,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
});
