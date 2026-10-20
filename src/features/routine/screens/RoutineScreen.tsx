import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { colors, spacing } from '@/theme';
import { AppNavbar } from '@/components/layout/AppNavbar';
import { MORNING_ROUTINE, NIGHT_ROUTINE } from '../data/routines';
import { ProductLineup } from '../components/ProductLineup';
import { RoutineStepList } from '../components/RoutineStepList';
import type { RoutineStep } from '../types';

export const RoutineScreen: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'morning' | 'night'>('morning');
  
  const currentRoutine = activeTab === 'morning' ? MORNING_ROUTINE : NIGHT_ROUTINE;

  const handleStepPress = (step: RoutineStep) => {
    // Navigate to product detail - for now just log
    console.log('Navigate to product:', step.productName);
    // TODO: Implement navigation when product detail page is ready
    // router.push(`/product/${step.id}`);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <AppNavbar
        variant="main"
        title="NOTWO"
        onSearchPress={() => {}}
        onCartPress={() => router.push('/(tabs)/cart')}
      />

      {/* Toggle Tabs */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, activeTab === 'morning' && styles.toggleButtonActive]}
          onPress={() => setActiveTab('morning')}
          activeOpacity={0.8}
        >
          <Ionicons 
            name="sunny" 
            size={18} 
            color={activeTab === 'morning' ? colors.onPrimary : colors.onSurfaceVariant} 
          />
          <Text style={[
            styles.toggleText,
            activeTab === 'morning' && styles.toggleTextActive
          ]}>
            Morning
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toggleButton, activeTab === 'night' && styles.toggleButtonActive]}
          onPress={() => setActiveTab('night')}
          activeOpacity={0.8}
        >
          <Ionicons 
            name="moon" 
            size={18} 
            color={activeTab === 'night' ? colors.onPrimary : colors.onSurfaceVariant} 
          />
          <Text style={[
            styles.toggleText,
            activeTab === 'night' && styles.toggleTextActive
          ]}>
            Night
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Product Lineup */}
        <ProductLineup steps={currentRoutine.steps} />

        {/* Routine Steps */}
        <RoutineStepList 
          steps={currentRoutine.steps}
          routineType={activeTab}
          onStepPress={handleStepPress}
        />
      </ScrollView>

      {/* Save Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.saveButton}
          activeOpacity={0.9}
          disabled={true}
        >
          <Text style={styles.saveButtonText}>Save Routine</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.marginMobile,
    paddingTop: spacing.xl + 20, // Account for status bar
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
  toggleContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.marginMobile,
    paddingVertical: spacing.md,
    gap: spacing.sm,
    backgroundColor: colors.surface,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    borderRadius: 12,
    backgroundColor: 'transparent',
    gap: spacing.xs,
  },
  toggleButtonActive: {
    backgroundColor: colors.primary,
  },
  toggleText: {
    fontFamily: 'GoogleSansText-Medium',
    fontSize: 15,
    color: colors.onSurfaceVariant,
    fontWeight: '500',
  },
  toggleTextActive: {
    color: colors.onPrimary,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.marginMobile,
    paddingBottom: spacing.xl,
  },
  footer: {
    padding: spacing.marginMobile,
    paddingBottom: spacing.xl,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant,
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md + 2,
    borderRadius: 30,
    alignItems: 'center',
    opacity: 0.6, // Disabled state
  },
  saveButtonText: {
    fontFamily: 'GoogleSansText-Bold',
    fontSize: 15,
    color: colors.onPrimary,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
