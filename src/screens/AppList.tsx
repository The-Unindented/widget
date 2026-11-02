import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppList } from '@/components/AppList';
import { useUsageStore } from '@/store/usageStore';
import { SortBy } from '@/types';

export const AppListScreen: React.FC = () => {
  const { apps, sortBy, setSortBy, getSortedApps } = useUsageStore();

  const sortedApps = getSortedApps(sortBy);

  return (
    <View style={styles.container}>
      <AppList
        apps={sortedApps}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
});