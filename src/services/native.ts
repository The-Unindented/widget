import { requireNativeModule } from 'expo';

export interface TodayStatsEntry {
  id: string;
  name: string;
  count: number;
}

interface UsageWidgetNativeModule {
  hasUsageAccess(): Promise<boolean>;
  openUsageAccessSettings(): void;
  startTrackingService(): Promise<boolean>;
  stopTrackingService(): Promise<boolean>;
  isTrackingRunning(): Promise<boolean>;
  getTodayStats(): Promise<string>;
  resetAllData(): Promise<boolean>;
  updateWidget(): Promise<boolean>;
}

let nativeModule: UsageWidgetNativeModule | null = null;
try {
  nativeModule = requireNativeModule<UsageWidgetNativeModule>('UsageWidget');
} catch {
  // Not available in Expo Go (custom native code requires a real build)
  nativeModule = null;
}

export const isNativeAvailable = (): boolean => nativeModule !== null;

export const usageWidgetNative = {
  hasUsageAccess: (): Promise<boolean> =>
    nativeModule?.hasUsageAccess() ?? Promise.resolve(false),

  openUsageAccessSettings: (): void => {
    nativeModule?.openUsageAccessSettings();
  },

  startTrackingService: (): Promise<boolean> =>
    nativeModule?.startTrackingService() ?? Promise.resolve(false),

  stopTrackingService: (): Promise<boolean> =>
    nativeModule?.stopTrackingService() ?? Promise.resolve(false),

  isTrackingRunning: (): Promise<boolean> =>
    nativeModule?.isTrackingRunning() ?? Promise.resolve(false),

  getTodayStats: async (): Promise<TodayStatsEntry[]> => {
    if (!nativeModule) return [];
    try {
      const raw = await nativeModule.getTodayStats();
      return JSON.parse(raw) as TodayStatsEntry[];
    } catch {
      return [];
    }
  },

  resetAllData: (): Promise<boolean> =>
    nativeModule?.resetAllData() ?? Promise.resolve(false),

  updateWidget: (): Promise<boolean> =>
    nativeModule?.updateWidget() ?? Promise.resolve(false),
};
