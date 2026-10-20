import { KysScannerModal } from '@/features/kys/components/KysScannerModal';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

export default function KysRoute() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  // Open modal every time this tab becomes focused
  useFocusEffect(
    useCallback(() => {
      setIsVisible(true);
      
      return () => {
        // Cleanup when leaving the tab
        setIsVisible(false);
      };
    }, [])
  );

  const handleClose = () => {
    setIsVisible(false);
    // Navigate back to home after closing
    router.push('/');
  };

  return (
    <View style={styles.container}>
      <KysScannerModal
        visible={isVisible}
        onClose={handleClose}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
