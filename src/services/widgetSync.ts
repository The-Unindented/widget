import { AppUsage, WidgetData } from '@/types';
import { useUsageStore } from '@/store/usageStore';
import { getDayKey } from '@/utils/dayKey';

class WidgetSync {
  private updateInterval: NodeJS.Timeout | null = null;

  async initialize(): Promise<void> {
    // Set up periodic widget updates
    this.startPeriodicUpdates();
  }

  async updateWidget(): Promise<void> {
    try {
      // This would call native modules to update the widget
      // For now, it's a placeholder
      const widgetData = await this.getWidgetData();
      console.log('Widget data to sync:', widgetData);
      
      // In real implementation:
      // await NativeModules.WidgetModule.updateWidget(widgetData);
    } catch (error) {
      console.error('Error updating widget:', error);
    }
  }

  private async getWidgetData(): Promise<WidgetData> {
    // Get today's top apps from the store
    const { getTopApps } = useUsageStore.getState();
    const topApps = getTopApps(3);

    return {
      topApps,
      lastSync: Date.now(),
      day: getDayKey(),
    };
  }

  private startPeriodicUpdates(): void {
    // Update widget every 15 minutes
    this.updateInterval = setInterval(() => {
      this.updateWidget();
    }, 15 * 60 * 1000);
  }

  stopPeriodicUpdates(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  async manualUpdate(): Promise<void> {
    await this.updateWidget();
  }
}

export const widgetSync = new WidgetSync();