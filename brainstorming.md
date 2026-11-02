# Brainstorming: App Usage Tracker with Widget

## Overview
A mobile app that tracks app opening frequency and displays the top 3 most-used apps as a home screen widget.

## Requirements
1. Track which apps are opened frequently
2. Display top 3 most-used apps on a widget (like dashboard/telegram widgets, step counters)
3. When opening the app, show which apps are used most and how many times each was clicked
4. Only show apps that have been used at least once
5. Maintain a brainstorming.md file for documentation

## Chosen Stack
- **Framework**: React Native
- **Navigation**: React Navigation (Bottom Tabs + Stack)
- **State Management**: Zustand with AsyncStorage persistence
- **Icons**: React Native Vector Icons
- **TypeScript**: Full type support

## Core Features

### 1. App Usage Tracking
- Detect when apps are opened (requires native module)
- Increment click counts
- Track last used timestamp
- Filter out system apps and the tracker app itself

### 2. Data Model
```typescript
interface AppUsage {
  id: string; // package name
  name: string;
  icon: string; // base64 or URI
  clickCount: number;
  lastUsed: number; // timestamp
  totalTimeUsed?: number; // in seconds
}
```

### 3. Main App UI
- Dashboard screen showing top apps with stats
- App List screen with sorting (clicks, recent, A-Z)
- Settings screen with data management
- Reset and export functionality

### 4. Home Screen Widget
- Android: App Widget (native Java provider)
- iOS: WidgetKit extension (SwiftUI)
- Displays top 3 apps with names and click counts
- Updates periodically or on manual sync

## Architecture

### Folder Structure
```
widget-app/
├── src/
│   ├── components/
│   │   ├── AppCard.tsx        # Individual app card component
│   │   ├── StatCard.tsx       # Statistics display card
│   │   └── AppList.tsx        # Full app list with sorting
│   ├── screens/
│   │   ├── Dashboard.tsx      # Main dashboard screen
│   │   ├── AppList.tsx        # All apps screen
│   │   └── Settings.tsx       # Settings and data management
│   ├── services/
│   │   ├── usageTracker.ts    # App usage tracking logic
│   │   └── widgetSync.ts      # Widget synchronization
│   ├── store/
│   │   └── usageStore.ts      # Zustand state management
│   ├── navigation/
│   │   └── AppNavigator.tsx   # React Navigation setup
│   ├── utils/
│   │   └── Placeholder.tsx    # Utility components
│   └── types/
│       └── index.ts           # TypeScript type definitions
├── android/
│   └── app/
│       └── src/main/
│           ├── java/com/widgetapp/
│           │   └── UsageWidgetProvider.java  # Android widget logic
│           ├── res/layout/widget_usage.xml   # Widget layout
│           └── res/xml/widget_info.xml       # Widget config
├── ios/
│   └── Widget/
│       └── UsageWidget.swift                 # iOS widget implementation
└── brainstorming.md                           # This file
```

## Implementation Plan

### Phase 1: Project Setup
- [x] Initialize React Native project with TypeScript
- [x] Install dependencies (React Navigation, Zustand, Vector Icons)
- [x] Set up navigation structure
- [x] Configure TypeScript paths
- [x] Create folder structure

### Phase 2: Core Functionality
- [x] Create data model and types
- [x] Implement storage service (Zustand persist)
- [x] Build usage tracking service
- [x] Create main app screens (Dashboard, AppList, Settings)
- [x] Implement UI components (AppCard, StatCard, AppList)

### Phase 3: Widget Implementation
- [x] Android widget native code (UsageWidgetProvider.java)
- [x] iOS widget native code (UsageWidget.swift)
- [x] Widget synchronization logic
- [x] Periodic updates setup

### Phase 4: Polish
- [ ] UI/UX refinement
- [ ] Error handling
- [ ] Testing
- [ ] Performance optimization
- [ ] Permission handling for production

## Technical Challenges & Solutions

### Challenge 1: Background App Detection
- **Solution**: Use native modules to access usage stats manager
- **Android**: UsageStatsManager with USAGE_STATS permission
- **iOS**: Limited due to sandboxing, may require WorkManager/BackgroundTasks
- **Libraries**: Custom native modules for platform-specific APIs

### Challenge 2: Widget Updates
- **Solution**: Periodic refresh intervals + manual sync
- **Android**: AppWidgetProvider with updatePeriodMillis
- **iOS**: WidgetKit Timeline with policy
- **Shared Preferences**: Android SharedPreferences, iOS UserDefaults

### Challenge 3: Icon Extraction
- **Solution**: Native APIs to get app icons and convert to base64
- **Android**: PackageManager.getApplicationIcon()
- **iOS**: Limited, may use system icons

## Data Persistence Strategy
- Store usage data in AsyncStorage via Zustand persist middleware
- Widget data synced via:
  - Android: SharedPreferences
  - iOS: UserDefaults (App Group)
- Periodic sync every 15 minutes

## Next Steps (Remaining)
1. Set up proper native module bridges
2. Implement actual app usage tracking (replace placeholder)
3. Add icon extraction from device
4. Test on real devices
5. Add error boundaries and loading states
6. Implement proper permission flows
7. Add analytics (optional)
8. Prepare for app store deployment

## Notes
- This is a template/boilerplate structure
- Native code requires proper signing and configuration
- Actual app usage tracking requires platform-specific permissions
- Widget functionality depends on OS version and capabilities