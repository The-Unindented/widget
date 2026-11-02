import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { AppUsage, SortBy } from '@/types';
import { AppCard } from '@/components/AppCard';

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
  const sortOptions: { label: string; value: SortBy }[] = [
    { label: 'Most Clicked', value: 'clicks' },
    { label: 'Recent', value: 'recent' },
    { label: 'A-Z', value: 'name' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.sortContainer}>
        <Text style={styles.sectionTitle}>All Apps</Text>
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
            <Text style={styles.emptyStateText}>No apps tracked yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Start using your phone to see app statistics here
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  sortContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
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
    backgroundColor: '#F0F0F0',
  },
  sortButtonActive: {
    backgroundColor: '#007AFF',
  },
  sortButtonText: {
    color: '#666',
    fontWeight: '500',
  },
  sortButtonTextActive: {
    color: '#FFFFFF',
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
    color: '#999',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#BBB',
    textAlign: 'center',
  },
});