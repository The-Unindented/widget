const { withAndroidManifest } = require('@expo/config-plugins');

const PERMISSIONS = [
  'android.permission.PACKAGE_USAGE_STATS',
  'android.permission.FOREGROUND_SERVICE',
  'android.permission.FOREGROUND_SERVICE_DATA_SYNC',
  'android.permission.POST_NOTIFICATIONS',
];

const WIDGET_RECEIVER = 'expo.modules.usagewidget.UsageWidgetProvider';
const TRACKER_SERVICE = 'expo.modules.usagewidget.UsageTrackerService';

function withUsageWidgetAndroidManifest(config) {
  return withAndroidManifest(config, (config) => {
    const root = config.modResults.manifest;

    if (!root.$) {
      root.$ = {};
    }
    root.$['xmlns:tools'] = 'http://schemas.android.com/tools';

    // Permissions
    const permissions = root['uses-permission'] || [];
    const existing = new Set(
      permissions
        .map((entry) => entry.$ && entry.$['android:name'])
        .filter(Boolean)
    );
    for (const name of PERMISSIONS) {
      if (!existing.has(name)) {
        const entry = { $: { 'android:name': name } };
        if (name === 'android.permission.PACKAGE_USAGE_STATS') {
          entry.$['tools:ignore'] = 'UsageAccessPolicy';
        }
        permissions.push(entry);
      }
    }
    root['uses-permission'] = permissions;

    // App components
    const app = root.application[0];

    const receivers = app.receiver || [];
    const hasReceiver = receivers.some(
      (entry) => entry.$ && entry.$['android:name'] === WIDGET_RECEIVER
    );
    if (!hasReceiver) {
      receivers.push({
        $: {
          'android:name': WIDGET_RECEIVER,
          'android:label': 'App Usage Tracker',
          'android:exported': 'false',
        },
        'intent-filter': [
          {
            action: [{ $: { 'android:name': 'android.appwidget.APP_WIDGET_UPDATE' } }],
          },
        ],
        'meta-data': [
          {
            $: {
              'android:name': 'android.appwidget.provider',
              'android:resource': '@xml/widget_info',
            },
          },
        ],
      });
    }
    app.receiver = receivers;

    const services = app.service || [];
    const hasService = services.some(
      (entry) => entry.$ && entry.$['android:name'] === TRACKER_SERVICE
    );
    if (!hasService) {
      services.push({
        $: {
          'android:name': TRACKER_SERVICE,
          'android:exported': 'false',
          'android:foregroundServiceType': 'dataSync',
        },
      });
    }
    app.service = services;

    return config;
  });
}

module.exports = function withUsageWidget(config) {
  return withUsageWidgetAndroidManifest(config);
};
