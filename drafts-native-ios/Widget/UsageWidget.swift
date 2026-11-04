import WidgetKit
import SwiftUI
import Foundation

struct UsageWidgetEntry: TimelineEntry {
    let date: Date
    let topApps: [AppUsageData]
}

struct AppUsageData: Codable {
    let name: String
    let clickCount: Int
}

struct UsageWidgetProvider: TimelineProvider {
    func placeholder(in context: Context) -> UsageWidgetEntry {
        UsageWidgetEntry(date: Date(), topApps: [
            AppUsageData(name: "Example App", clickCount: 10),
            AppUsageData(name: "Another App", clickCount: 5),
            AppUsageData(name: "Third App", clickCount: 3)
        ])
    }

    func getSnapshot(in context: Context, completion: @escaping (UsageWidgetEntry) -> ()) {
        let entry = UsageWidgetEntry(date: Date(), topApps: [
            AppUsageData(name: "Example App", clickCount: 10),
            AppUsageData(name: "Another App", clickCount: 5),
            AppUsageData(name: "Third App", clickCount: 3)
        ])
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<UsageWidgetEntry>) -> ()) {
        // Read data from App Group shared preferences
        let userDefaults = UserDefaults(suiteName: "group.com.widgetapp")
        var topApps: [AppUsageData] = []
        
        if let widgetData = userDefaults?.data(forKey: "widget_data"),
           let decoded = try? JSONDecoder().decode(WidgetData.self, from: widgetData) {
            topApps = decoded.topApps
        }
        
        let entry = UsageWidgetEntry(date: Date(), topApps: topApps)
        let timeline = Timeline(entries: [entry], policy: .after(Date().addingTimeInterval(900)))
        completion(timeline)
    }
}

struct WidgetData: Codable {
    let topApps: [AppUsageData]
    let lastSync: Double
}

struct UsageWidgetView: View {
    var entry: UsageWidgetProvider.Entry

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Top Apps")
                .font(.caption)
                .foregroundColor(.secondary)
            
            ForEach(entry.topApps.prefix(3), id: \.name) { app in
                HStack {
                    Text(app.name)
                        .font(.caption)
                        .lineLimit(1)
                    Spacer()
                    Text("\(app.clickCount)")
                        .font(.caption2)
                        .foregroundColor(.secondary)
                }
            }
            
            if entry.topApps.isEmpty {
                Text("No data")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
        }
        .widgetBackground(.clear)
    }
}

struct UsageWidget: Widget {
    let kind: String = "UsageWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: UsageWidgetProvider()) { entry in
            UsageWidgetView(entry: entry)
        }
        .configurationDisplayName("App Usage Tracker")
        .description("Shows your top 3 most used apps.")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}

#Preview(as: .systemMedium) {
    UsageWidget()
    .previewContext(WidgetPreviewContext(family: .systemMedium))
}