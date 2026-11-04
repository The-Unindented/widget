import { usageWidgetNative } from '@/services/native';

/**
 * Widget bridge. The native module renders the widget from its own
 * storage, so pushing an update is just triggering a native refresh.
 */
class WidgetSync {
  private updateInterval: NodeJS.Timeout | null = null;

  async initialize(): Promise<void> {
    this.startPeriodicUpdates();
  }

  async updateWidget(): Promise<void> {
    try {
      await usageWidgetNative.updateWidget();
    } catch (error) {
      console.error('Error updating widget:', error);
    }
  }

  private startPeriodicUpdates(): void {
    if (this.updateInterval) {
      return;
    }
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
