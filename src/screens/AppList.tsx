import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppList } from '@/components/AppList';
import { useUsageStore } from '@/store/usageStore';
import { useTheme } from '@/theme/useTheme';
import { Palette } from '@/theme/palette';

export const AppListScreen: React.FC = () => {
  const { sortBy, setSortBy, getSortedApps } = useUsageStore();
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

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

const createStyles = (c: Palette) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.background,
    },
  });
