import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useUsageStore } from '@/store/usageStore';
import { AppCard } from '@/components/AppCard';
import { StatCard } from '@/components/StatCard';
import { usageTracker } from '@/services/usageTracker';
import { widgetSync } from '@/services/widgetSync';

export const DashboardScreen: React.FC = () => {
  const { apps, totalClicks, getTopApps, resetStats } = useUsageStore();

  React.useEffect(() => {
    usageTracker.startTracking();
    widgetSync.initialize();

    return () => {
      usageTracker.stopTracking();
    };
  }, []);

  const topApps = getTopApps(3);

  const handleReset = () => {
    Alert.alert(
      'Reset Statistics',
      'Are you sure you want to reset all app usage statistics?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: resetStats },
      ]
    );
  };

  const handleSyncWidget = async () => {
    await usageTracker.syncWidgetData();
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
        <StatCard
          title="Total Clicks"
          value={totalClicks}
          subtitle="All time"
        />
        <StatCard
          title="Apps Tracked"
          value={apps.length}
          subtitle="Used at least once"
        />
      </View>

      <View style={styles.topAppsContainer}>
        <Text style={styles.sectionTitle}>Top 3 Most Used</Text>
        {topApps.length > 0 ? (
          topApps.map((app, index) => (
            <AppCard key={app.id} app={app} rank={index + 1} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No usage data yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Start using apps to see your top 3 here
            </Text>
          </View>
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>How it works</Text>
        <Text style={styles.infoText}>
          This app tracks which apps you open on your phone. The top 3 most
          used apps will appear on your home screen widget. Only apps you've
          used at least once are shown.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#007AFF',
    borderRadius: 6,
  },
  headerButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  resetText: {
    color: '#FF3B30',
    backgroundColor: '#FFF0F0',
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
    color: '#333',
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
    color: '#999',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#BBB',
    textAlign: 'center',
  },
  infoContainer: {
    padding: 16,
    marginTop: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});