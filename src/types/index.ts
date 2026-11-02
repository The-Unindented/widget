export interface AppUsage {
  id: string; // package name
  name: string;
  icon: string; // base64 or URI
  clickCount: number;
  lastUsed: number; // timestamp
  totalTimeUsed?: number; // in seconds
}

export interface UsageStats {
  apps: AppUsage[];
  totalClicks: number;
  lastUpdated: number;
}

export interface WidgetData {
  topApps: AppUsage[];
  lastSync: number;
}

export type SortBy = 'clicks' | 'recent' | 'name';