import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { AppUsage, SortBy } from '@/types';
import { AppCard } from '@/components/AppCard';
import { useTheme } from '@/theme/useTheme';
import { Palette } from '@/theme/palette';

interface AppListProps {
  apps: AppUsage[];
  sortBy: SortBy;
  onSortChange: (sortBy: SortBy) => void;
  onAppPress?: (app: AppUsage) => void;
}

export const AppList: React.FC<AppListProps> = ({
  apps,
  sortBy,
  onSortChange,
  onAppPress,
}) => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  const sortOptions: { label: string; value: SortBy }[] = [
    { label: 'Most Clicked', value: 'clicks' },
    { label: 'Recent', value: 'recent' },
    { label: 'A-Z', value: 'name' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.sortContainer}>
        <Text style={styles.sectionTitle}>Today's Apps</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.sortButtons}>
            {sortOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.sortButton,
                  sortBy === option.value && styles.sortButtonActive,
                ]}
                onPress={() => onSortChange(option.value)}
              >
                <Text
                  style={[
                    styles.sortButtonText,
                    sortBy === option.value && styles.sortButtonTextActive,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {apps.map((app, index) => (
          <AppCard
            key={app.id}
            app={app}
            rank={index + 1}
            onPress={onAppPress}
          />
        ))}
        {apps.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No apps used today</Text>
            <Text style={styles.emptyStateSubtext}>
              Apps you open today will appear here
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const createStyles = (c: Palette) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.background,
    },
    sortContainer: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: c.border,
      backgroundColor: c.surface,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: c.textPrimary,
      marginBottom: 12,
    },
    sortButtons: {
      flexDirection: 'row',
      gap: 8,
    },
    sortButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: c.fill,
    },
    sortButtonActive: {
      backgroundColor: c.primary,
    },
    sortButtonText: {
      color: c.textSecondary,
      fontWeight: '500',
    },
    sortButtonTextActive: {
      color: c.onPrimary,
    },
    list: {
      flex: 1,
      padding: 16,
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 60,
    },
    emptyStateText: {
      fontSize: 18,
      fontWeight: '600',
      color: c.hint,
      marginBottom: 8,
    },
    emptyStateSubtext: {
      fontSize: 14,
      color: c.hint,
      textAlign: 'center',
    },
  });
