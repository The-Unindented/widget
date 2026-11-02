# React Native App

A mobile app that tracks app opening frequency and displays the top 3 most-used apps as a home screen widget.

## Features

- **App Usage Tracking**: Monitor which apps you open frequently
- **Home Screen Widget**: Display top 3 most-used apps directly on your home screen
- **Detailed Statistics**: View complete usage history with click counts
- **Smart Filtering**: Only shows apps that have been used at least once
- **Sorting Options**: Sort apps by clicks, recent usage, or alphabetical order
- **Data Management**: Export data or reset statistics

## Project Structure

```
widget-app/
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── AppCard.tsx
│   │   ├── StatCard.tsx
│   │   └── AppList.tsx
│   ├── screens/         # Main app screens
│   │   ├── Dashboard.tsx
│   │   ├── AppList.tsx
│   │   └── Settings.tsx
│   ├── services/        # Core services
│   │   ├── usageTracker.ts
│   │   └── widgetSync.ts
│   ├── store/           # State management
│   │   └── usageStore.ts
│   ├── navigation/      # App navigation
│   │   └── AppNavigator.tsx
│   ├── utils/           # Utility functions
│   └── types/           # TypeScript type definitions
├── android/             # Android native code
│   └── app/
│       └── src/main/
│           ├── java/com/widgetapp/
│           │   └── UsageWidgetProvider.java
│           ├── res/layout/widget_usage.xml
│           └── res/xml/widget_info.xml
├── ios/                 # iOS native code
│   └── Widget/
│       └── UsageWidget.swift
└── brainstorming.md     # Brainstorming notes
```

## Getting Started

### Prerequisites

- Node.js (18+)
- React Native CLI
- Android SDK (for Android development)
- Xcode (for iOS development)

### Installation

```bash
npm install
```

### Running the App

**Android:**
```bash
npm run android
```

**iOS:**
```bash
npm run ios
```

## How It Works

1. **Tracking**: The app monitors which apps are opened on your device
2. **Storage**: Usage data is stored locally using AsyncStorage
3. **Widget**: Top 3 apps are displayed on your home screen
4. **Updates**: Widget updates automatically or can be manually synced

## Widget Setup

### Android
1. Long press on home screen
2. Select "Widgets"
3. Find "App Usage Tracker"
4. Place the widget on your home screen

### iOS
1. Long press on home screen
2. Tap "+"
3. Search for "App Usage Tracker"
4. Add the widget

## Permissions

The app requires:
- **Usage Stats Access** (Android): To track app usage
- **Storage**: To save usage data locally

## Privacy

- All data is stored locally on your device
- No personal data is collected
- No messages or content are accessed
- App usage statistics only

## License

Proprietary