import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppUsage, UsageStats, SortBy } from '@/types';
import { getDayKey } from '@/utils/dayKey';

interface UsageStore extends UsageStats {
  sortBy: SortBy;
  // Actions
  incrementAppClick: (packageName: string, appName: string, icon?: string) => void;
  updateAppUsage: (packageName: string, timeSpent: number) => void;
  resetStats: () => void;
  setSortBy: (sortBy: SortBy) => void;
  getTopApps: (limit: number) => AppUsage[]; // top apps by today's clicks
  getSortedApps: (sortBy: SortBy) => AppUsage[]; // apps used today
  getTotalClicksToday: () => number;
  getAppsTrackedToday: () => number;
  loadUsageData: () => Promise<void>;
}

const KEEP_HISTORY_DAYS = 30;

// Clicks an app has on the given day (0 if it was last used on another day)
const todayCount = (app: AppUsage, dayKey: string): number =>
  app.lastUsedDay === dayKey ? app.clickCount : 0;

// Keep the daily history from growing without bound
const pruneDailyCounts = (
  dailyCounts: Record<string, number>
): Record<string, number> => {
  const keys = Object.keys(dailyCounts).sort();
  if (keys.length <= KEEP_HISTORY_DAYS) {
    return dailyCounts;
  }
  const keep = new Set(keys.slice(-KEEP_HISTORY_DAYS));
  return keys
    .filter((key) => keep.has(key))
    .reduce<Record<string, number>>((acc, key) => {
      acc[key] = dailyCounts[key];
      return acc;
    }, {});
};

const initialState: Omit<
  UsageStore,
  | 'incrementAppClick'
  | 'updateAppUsage'
  | 'resetStats'
  | 'setSortBy'
  | 'getTopApps'
  | 'getSortedApps'
  | 'getTotalClicksToday'
  | 'getAppsTrackedToday'
  | 'loadUsageData'
> = {
  apps: [],
  totalClicks: 0,
  lastUpdated: Date.now(),
  sortBy: 'clicks',
};

export const useUsageStore = create<UsageStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      incrementAppClick: (packageName: string, appName: string, icon: string = '') => {
        const now = Date.now();
        const dayKey = getDayKey();

        set((state) => {
          const existingAppIndex = state.apps.findIndex(
            (app) => app.id === packageName
          );

          let updatedApps: AppUsage[];

          if (existingAppIndex >= 0) {
            // Update existing app; the counter rolls over when the day changes
            updatedApps = state.apps.map((app, index) => {
              if (index !== existingAppIndex) {
                return app;
              }
              const count = (app.lastUsedDay === dayKey ? app.clickCount : 0) + 1;
              return {
                ...app,
                clickCount: count,
                lastUsed: now,
                lastUsedDay: dayKey,
                dailyCounts: pruneDailyCounts({
                  ...(app.dailyCounts ?? {}),
                  [dayKey]: count,
                }),
              };
            });
          } else {
            // Add new app, today's counter starting at 1
            const newApp: AppUsage = {
              id: packageName,
              name: appName,
              icon,
              clickCount: 1,
              lastUsed: now,
              lastUsedDay: dayKey,
              dailyCounts: { [dayKey]: 1 },
            };
            updatedApps = [...state.apps, newApp];
          }

          return {
            apps: updatedApps,
            totalClicks: state.totalClicks + 1,
            lastUpdated: now,
          };
        });
      },

      updateAppUsage: (packageName: string, timeSpent: number) => {
        set((state) => ({
          apps: state.apps.map((app) =>
            app.id === packageName
              ? { ...app, totalTimeUsed: (app.totalTimeUsed || 0) + timeSpent }
              : app
          ),
        }));
      },

      resetStats: () => {
        set({
          apps: [],
          totalClicks: 0,
          lastUpdated: Date.now(),
        });
      },

      setSortBy: (sortBy: SortBy) => {
        set({ sortBy });
      },

      // Top apps by today's clicks (calendar-day scoped)
      getTopApps: (limit: number = 3): AppUsage[] => {
        const dayKey = getDayKey();
        return get()
          .apps.map((app) => ({ app, count: todayCount(app, dayKey) }))
          .filter(({ count }) => count > 0)
          .sort((a, b) => b.count - a.count)
          .slice(0, limit)
          .map(({ app }) => app);
      },

      // Apps used today, with clickCount normalized to today's value
      getSortedApps: (sortBy: SortBy): AppUsage[] => {
        const dayKey = getDayKey();
        const apps = get()
          .apps.map((app) => ({ ...app, clickCount: todayCount(app, dayKey) }))
          .filter((app) => app.clickCount > 0);

        switch (sortBy) {
          case 'clicks':
            return apps.sort((a, b) => b.clickCount - a.clickCount);
          case 'recent':
            return apps.sort((a, b) => b.lastUsed - a.lastUsed);
          case 'name':
            return apps.sort((a, b) => a.name.localeCompare(b.name));
          default:
            return apps;
        }
      },

      getTotalClicksToday: (): number => {
        const dayKey = getDayKey();
        return get().apps.reduce((sum, app) => sum + todayCount(app, dayKey), 0);
      },

      getAppsTrackedToday: (): number => {
        const dayKey = getDayKey();
        return get().apps.filter((app) => todayCount(app, dayKey) > 0).length;
      },

      loadUsageData: async () => {
        // Data is automatically persisted by Zustand persist middleware
        // This method can be used for additional loading logic
        return Promise.resolve();
      },
    }),
    {
      name: 'usage-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
