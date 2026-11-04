import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, AppState } from 'react-native';
import { useUsageStore } from '@/store/usageStore';
import { AppCard } from '@/components/AppCard';
import { StatCard } from '@/components/StatCard';
import { usageTracker } from '@/services/usageTracker';
import { widgetSync } from '@/services/widgetSync';
import { isNativeAvailable } from '@/services/native';
import { useTheme } from '@/theme/useTheme';
import { Palette } from '@/theme/palette';

export const DashboardScreen: React.FC = () => {
  const { getTopApps, getTotalClicksToday, getAppsTrackedToday } =
    useUsageStore();
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  React.useEffect(() => {
    const init = async () => {
      if (isNativeAvailable()) {
        const granted = await usageTracker.hasUsageAccess();
        if (granted) {
          await usageTracker.startTracking();
        } else {
          Alert.alert(
            'Permission needed',
            'To count which apps you open, enable "Usage access" for WidgetApp in the next screen, then come back.',
            [
              {
                text: 'Open Settings',
                onPress: () => usageTracker.openUsageAccessSettings(),
              },
              { text: 'Cancel', style: 'cancel' },
            ]
          );
        }
      }
      widgetSync.initialize();
    };

    init();

    // Refresh the display whenever the app comes back to the foreground
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        usageTracker.refreshFromNative();
      }
    });

    return () => {
      subscription.remove();
      // The tracking service intentionally keeps running in the background
    };
  }, []);

  const topApps = getTopApps(3);

  const handleReset = () => {
    Alert.alert(
      'Reset Statistics',
      'Are you sure you want to reset all app usage statistics?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            usageTracker.resetAll();
          },
        },
      ]
    );
  };

  const handleSyncWidget = async () => {
    await widgetSync.manualUpdate();
    await usageTracker.refreshFromNative();
    Alert.alert('Success', 'Widget updated successfully');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.headerButton} onPress={handleSyncWidget}>
            <Text style={styles.headerButtonText}>Sync Widget</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={handleReset}>
            <Text style={[styles.headerButtonText, styles.resetText]}>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <StatCard title="Total Clicks" value={getTotalClicksToday()} subtitle="Today" />
        <StatCard
          title="Apps Tracked"
          value={getAppsTrackedToday()}
          subtitle="Used today"
        />
      </View>

      <View style={styles.topAppsContainer}>
        <Text style={styles.sectionTitle}>Top 3 Today</Text>
        {topApps.length > 0 ? (
          topApps.map((app, index) => (
            <AppCard key={app.id} app={app} rank={index + 1} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No apps opened today yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Open some apps and your top 3 for today will show up here
            </Text>
          </View>
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>How it works</Text>
        <Text style={styles.infoText}>
          This app tracks which apps you open each day. The top 3 most-used apps
          for today appear on your home screen widget. Counts reset
          automatically at midnight.
        </Text>
      </View>
    </View>
  );
};

const createStyles = (c: Palette) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.background,
    },
    header: {
      padding: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: c.surface,
      borderBottomWidth: 1,
      borderBottomColor: c.border,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: c.textPrimary,
    },
    headerButtons: {
      flexDirection: 'row',
      gap: 8,
    },
    headerButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      backgroundColor: c.primary,
      borderRadius: 6,
    },
    headerButtonText: {
      color: c.onPrimary,
      fontSize: 12,
      fontWeight: '600',
    },
    resetText: {
      color: c.danger,
      backgroundColor: c.dangerSurface,
    },
    statsContainer: {
      flexDirection: 'row',
      padding: 16,
      gap: 8,
    },
    topAppsContainer: {
      padding: 16,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: c.textPrimary,
      marginBottom: 16,
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 40,
    },
    emptyStateText: {
      fontSize: 16,
      fontWeight: '600',
      color: c.hint,
      marginBottom: 8,
    },
    emptyStateSubtext: {
      fontSize: 14,
      color: c.hint,
      textAlign: 'center',
    },
    infoContainer: {
      padding: 16,
      marginTop: 8,
    },
    infoTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: c.textPrimary,
      marginBottom: 8,
    },
    infoText: {
      fontSize: 14,
      color: c.textSecondary,
      lineHeight: 20,
    },
  });
