import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { useUsageStore } from '@/store/usageStore';
import { useTheme } from '@/theme/useTheme';
import { Palette } from '@/theme/palette';
import { ThemeMode } from '@/store/themeStore';

const themeOptions: { label: string; value: ThemeMode }[] = [
  { label: 'Follow System', value: 'system' },
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
  { label: 'OLED Dark', value: 'oled' },
];

export const SettingsScreen: React.FC = () => {
  const { apps, resetStats } = useUsageStore();
  const { mode, setMode, colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const [autoSync, setAutoSync] = React.useState(true);
  const [trackSystemApps, setTrackSystemApps] = React.useState(false);

  const handleReset = () => {
    Alert.alert(
      'Reset All Data',
      'This will permanently delete all app usage statistics. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            resetStats();
            Alert.alert('Success', 'All usage data has been reset');
          },
        },
      ]
    );
  };

  const handleExportData = () => {
    const data = JSON.stringify(apps, null, 2);
    // In real app, would share or download the file
    Alert.alert('Export', 'Data exported to clipboard');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        {themeOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={styles.appearanceRow}
            onPress={() => setMode(option.value)}
          >
            <Text style={styles.settingLabel}>{option.label}</Text>
            {mode === option.value && <Text style={styles.checkmark}>✓</Text>}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tracking Settings</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Auto Sync Widget</Text>
            <Text style={styles.settingDescription}>
              Update home screen widget automatically
            </Text>
          </View>
          <Switch
            value={autoSync}
            onValueChange={setAutoSync}
            trackColor={{ false: colors.hint, true: colors.primary }}
            thumbColor={colors.onPrimary}
          />
        </View>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Track System Apps</Text>
            <Text style={styles.settingDescription}>
              Include system apps in statistics
            </Text>
          </View>
          <Switch
            value={trackSystemApps}
            onValueChange={setTrackSystemApps}
            trackColor={{ false: colors.hint, true: colors.primary }}
            thumbColor={colors.onPrimary}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Total Apps Tracked</Text>
          <Text style={styles.infoValue}>{apps.length}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Version</Text>
          <Text style={styles.infoValue}>1.0.0</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Management</Text>
        <TouchableOpacity style={styles.actionButton} onPress={handleExportData}>
          <Text style={styles.actionButtonText}>Export Data</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.dangerButton]}
          onPress={handleReset}
        >
          <Text style={styles.dangerButtonText}>Reset All Statistics</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privacy</Text>
        <Text style={styles.privacyText}>
          This app tracks app usage only. We do not collect personal data,
          messages, or content. All data is stored locally on your device.
        </Text>
      </View>
    </ScrollView>
  );
};

const createStyles = (c: Palette) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.background,
    },
    section: {
      backgroundColor: c.surface,
      marginBottom: 16,
      paddingVertical: 8,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: c.hint,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      padding: 16,
      marginBottom: 8,
    },
    appearanceRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: c.border,
    },
    checkmark: {
      fontSize: 16,
      fontWeight: 'bold',
      color: c.primary,
    },
    settingItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: c.border,
    },
    settingInfo: {
      flex: 1,
      marginRight: 16,
    },
    settingLabel: {
      fontSize: 16,
      color: c.textPrimary,
      marginBottom: 4,
    },
    settingDescription: {
      fontSize: 14,
      color: c.textSecondary,
    },
    infoItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: c.border,
    },
    infoLabel: {
      fontSize: 16,
      color: c.textPrimary,
    },
    infoValue: {
      fontSize: 16,
      color: c.textSecondary,
    },
    actionButton: {
      backgroundColor: c.primary,
      marginHorizontal: 16,
      marginVertical: 8,
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
    },
    actionButtonText: {
      color: c.onPrimary,
      fontSize: 16,
      fontWeight: '600',
    },
    dangerButton: {
      backgroundColor: c.danger,
    },
    dangerButtonText: {
      color: c.onPrimary,
      fontSize: 16,
      fontWeight: '600',
    },
    privacyText: {
      fontSize: 14,
      color: c.textSecondary,
      lineHeight: 20,
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
  });
