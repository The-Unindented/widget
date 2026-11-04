import { AppUsage } from '@/types';
import { useUsageStore } from '@/store/usageStore';
import { usageWidgetNative, TodayStatsEntry } from '@/services/native';
import { getDayKey } from '@/utils/dayKey';

/**
 * Controller for the native usage tracker. The native side owns the actual
 * counting (foreground service + native storage, works while the app is
 * closed); this class starts/stops it, checks permission, and hydrates
 * the JS store from native data for display.
 */
class UsageTracker {
  async hasUsageAccess(): Promise<boolean> {
    return usageWidgetNative.hasUsageAccess();
  }

  openUsageAccessSettings(): void {
    usageWidgetNative.openUsageAccessSettings();
  }

  async startTracking(): Promise<void> {
    if (await usageWidgetNative.hasUsageAccess()) {
      await usageWidgetNative.startTrackingService();
      await this.refreshFromNative();
    }
  }

  async stopTracking(): Promise<void> {
    await usageWidgetNative.stopTrackingService();
  }

  // Pull today's counts (native is the source of truth) into the JS store
  async refreshFromNative(): Promise<void> {
    const entries: TodayStatsEntry[] = await usageWidgetNative.getTodayStats();
    const today = getDayKey();
    const apps: AppUsage[] = entries.map((entry) => ({
      id: entry.id,
      name: entry.name,
      icon: '',
      clickCount: entry.count,
      lastUsed: Date.now(),
      lastUsedDay: today,
    }));
    useUsageStore.getState().replaceAllApps(apps);
  }

  async resetAll(): Promise<void> {
    await usageWidgetNative.resetAllData();
    useUsageStore.getState().resetStats();
  }
}

export const usageTracker = new UsageTracker();
