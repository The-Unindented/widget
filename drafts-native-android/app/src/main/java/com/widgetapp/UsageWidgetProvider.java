package com.widgetapp;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.widget.RemoteViews;
import org.json.JSONArray;
import org.json.JSONObject;

public class UsageWidgetProvider extends AppWidgetProvider {

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId);
        }
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        super.onReceive(context, intent);
        if (intent.hasExtra("WIDGET_DATA")) {
            AppWidgetManager appWidgetManager = AppWidgetManager.getInstance(context);
            int[] appWidgetIds = appWidgetManager.getAppWidgetIds(
                new android.content.ComponentName(context, UsageWidgetProvider.class));
            for (int appWidgetId : appWidgetIds) {
                updateAppWidget(context, appWidgetManager, appWidgetId);
            }
        }
    }

    public static void updateAppWidget(Context context, AppWidgetManager appWidgetManager, int appWidgetId) {
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_usage);

        String widgetData = readWidgetData(context);
        if (widgetData != null) {
            try {
                JSONObject jsonObject = new JSONObject(widgetData);
                JSONArray topApps = jsonObject.optJSONArray("topApps");
                if (topApps != null && topApps.length() > 0) {
                    populateAppList(views, topApps);
                }
            } catch (Exception e) {
                views.setTextViewText(R.id.widget_title, "Error loading data");
            }
        } else {
            views.setTextViewText(R.id.widget_title, "No data available");
        }

        Intent intent = new Intent(context, MainActivity.class);
        android.content.PendingIntent pendingIntent = android.content.PendingIntent.getActivity(
            context, 0, intent, android.content.PendingIntent.FLAG_IMMUTABLE);
        views.setOnClickPendingIntent(R.id.widget_container, pendingIntent);

        appWidgetManager.updateAppWidget(appWidgetId, views);
    }

    private void populateAppList(RemoteViews views, JSONArray topApps) {
        int[] appTextIds = {R.id.app_1_name, R.id.app_2_name, R.id.app_3_name};
        int[] countTextIds = {R.id.app_1_count, R.id.app_2_count, R.id.app_3_count};

        for (int i = 0; i < topApps.length() && i < 3; i++) {
            try {
                JSONObject app = topApps.optJSONObject(i);
                if (app != null) {
                    views.setTextViewText(appTextIds[i], app.getString("name"));
                    views.setTextViewText(countTextIds[i], app.getInt("clickCount") + " clicks");
                }
            } catch (Exception e) {
                views.setTextViewText(appTextIds[i], "Error");
            }
        }
    }

    private String readWidgetData(Context context) {
        return contextSharedPreferences(context).getString("widget_data", null);
    }

    private android.content.Sharedpreferences contextSharedPreferences(Context context) {
        return context.getPreferences(Context.MODE_PRIVATE);
    }
}