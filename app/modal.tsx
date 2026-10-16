import { Text } from '@/components/ui/Text';
import { colors, spacing } from '@/src/theme';
import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';

export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <Text variant="titleLarge">This is a modal</Text>
      <Link href="/" dismissTo style={styles.link}>
        <Text variant="bodyLarge" color="primary">Go to home screen</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  link: {
    marginTop: spacing.md,
    paddingVertical: spacing.md,
  },
});
