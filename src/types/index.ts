export interface AppUsage {
  id: string; // package name
  name: string;
  icon: string; // base64 or URI
  clickCount: number; // clicks on lastUsedDay (today's count)
  lastUsed: number; // timestamp
  lastUsedDay?: string; // day key ("YYYY-MM-DD") the clickCount belongs to
  dailyCounts?: Record<string, number>; // history: day key -> clicks (last 30 days)
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
  day: string; // day key ("YYYY-MM-DD") the data reflects
}

export type SortBy = 'clicks' | 'recent' | 'name';
