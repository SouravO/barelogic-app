import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Header } from '@/components/layout/Header';
import { colors } from '@/theme';
import { HeroBanner } from '@/features/home/components/HeroBanner';
import { KysScannerModal } from '../components/KysScannerModal';

export const KysScreen: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Header />
      <ScreenContainer style={styles.content} padding>
        <HeroBanner onStartScan={() => setModalVisible(true)} />
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
});
