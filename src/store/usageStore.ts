import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppUsage, UsageStats, SortBy } from '@/types';

interface UsageStore extends UsageStats {
  // Actions
  incrementAppClick: (packageName: string, appName: string, icon?: string) => void;
  updateAppUsage: (packageName: string, timeSpent: number) => void;
  resetStats: () => void;
  setSortBy: (sortBy: SortBy) => void;
  getTopApps: (limit: number) => AppUsage[];
  getSortedApps: (sortBy: SortBy) => AppUsage[];
  loadUsageData: () => Promise<void>;
}

const initialState: Omit<
  UsageStore,
  | 'incrementAppClick'
  | 'updateAppUsage'
  | 'resetStats'
  | 'setSortBy'
  | 'getTopApps'
  | 'getSortedApps'
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
        set((state) => {
          const existingAppIndex = state.apps.findIndex(
            (app) => app.id === packageName
          );

          let updatedApps: AppUsage[];

          if (existingAppIndex >= 0) {
            // Update existing app
            updatedApps = state.apps.map((app, index) =>
              index === existingAppIndex
                ? {
                    ...app,
                    clickCount: app.clickCount + 1,
                    lastUsed: now,
                  }
                : app
            );
          } else {
            // Add new app
            const newApp: AppUsage = {
              id: packageName,
              name: appName,
              icon,
              clickCount: 1,
              lastUsed: now,
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

      getTopApps: (limit: number = 3): AppUsage => {
        const state = get();
        return state.apps
          .filter((app) => app.clickCount > 0)
          .sort((a, b) => b.clickCount - a.clickCount)
          .slice(0, limit);
      },

      getSortedApps: (sortBy: SortBy): AppUsage[] => {
        const state = get();
        const apps = [...state.apps].filter((app) => app.clickCount > 0);

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