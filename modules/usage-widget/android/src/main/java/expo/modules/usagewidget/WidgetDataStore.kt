package expo.modules.usagewidget

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.content.Context
import android.widget.RemoteViews
import org.json.JSONArray
import org.json.JSONObject
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

/**
 * Native source of truth for usage counts. Stores a JSON map per calendar
 * day in SharedPreferences so tracking keeps working while the JS runtime
 * is not running, and renders the home screen widget from that data.
 */
object WidgetDataStore {

    private const val PREFS_NAME = "usage_widget_store"
    private const val KEY_DAILY = "daily_counts"
    private const val KEEP_DAYS = 30

    fun dayKey(): String =
        SimpleDateFormat("yyyy-MM-dd", Locale.US).format(Date())

    fun recordApp(context: Context, packageName: String, appName: String) {
        try {
            val root = readRoot(context)
            val today = root.optJSONObject(dayKey()) ?: JSONObject()
            val entry = today.optJSONObject(packageName) ?: JSONObject()
            entry.put("n", appName)
            entry.put("c", entry.optInt("c", 0) + 1)
            entry.put("t", System.currentTimeMillis())
            today.put(packageName, entry)
            root.put(dayKey(), today)
            prune(root)
            writeRoot(context, root)
            updateWidgets(context)
        } catch (e: Exception) {
            // Never crash the tracking service over storage issues
        }
    }

    /** JSON array [{ id, name, count }] for today, sorted by count desc */
    fun getTodayStats(context: Context): String {
        val today = readRoot(context).optJSONObject(dayKey()) ?: JSONObject()
        val entries = ArrayList<Triple<String, String, Int>>()
        for (key in today.keys()) {
            val entry = today.optJSONObject(key) ?: continue
            entries.add(Triple(key, entry.optString("n", key), entry.optInt("c", 0)))
        }
        entries.sortByDescending { it.third }
        val arr = JSONArray()
        for ((id, name, count) in entries) {
            val obj = JSONObject()
            obj.put("id", id)
            obj.put("name", name)
            obj.put("count", count)
            arr.put(obj)
        }
        return arr.toString()
    }

    fun resetAll(context: Context) {
        context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            .edit().remove(KEY_DAILY).apply()
        updateWidgets(context)
    }

    /** Re-renders every widget instance from current data */
    fun updateWidgets(context: Context) {
        try {
            val manager = AppWidgetManager.getInstance(context)
            val ids = manager.getAppWidgetIds(
                ComponentName(context, UsageWidgetProvider::class.java)
            )
            if (ids.isNullOrEmpty()) return
            manager.updateAppWidget(ids, buildViews(context, topToday(context, 3)))
        } catch (e: Exception) {
            // Widget update failures must not break tracking
        }
    }

    private fun readRoot(context: Context): JSONObject {
        val raw = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            .getString(KEY_DAILY, null)
        return if (raw != null) {
            try {
                JSONObject(raw)
            } catch (e: Exception) {
                JSONObject()
            }
        } else {
            JSONObject()
        }
    }

    private fun writeRoot(context: Context, root: JSONObject) {
        context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            .edit().putString(KEY_DAILY, root.toString()).apply()
    }

    private fun prune(root: JSONObject) {
        try {
            val keys = ArrayList<String>()
            val iterator = root.keys()
            while (iterator.hasNext()) {
                keys.add(iterator.next())
            }
            keys.sort()
            if (keys.size > KEEP_DAYS) {
                for (i in 0 until keys.size - KEEP_DAYS) {
                    root.remove(keys[i])
                }
            }
        } catch (e: Exception) {
            // Ignore pruning issues
        }
    }

    private fun topToday(context: Context, limit: Int): List<Pair<String, Int>> {
        val today = readRoot(context).optJSONObject(dayKey()) ?: JSONObject()
        val entries = ArrayList<Pair<String, Int>>()
        for (key in today.keys()) {
            val entry = today.optJSONObject(key) ?: continue
            entries.add(Pair(entry.optString("n", key), entry.optInt("c", 0)))
        }
        entries.sortByDescending { it.second }
        return entries.take(limit)
    }

    private fun buildViews(context: Context, top: List<Pair<String, Int>>): RemoteViews {
        val views = RemoteViews(context.packageName, R.layout.widget_usage)
        val nameIds = intArrayOf(R.id.app_1_name, R.id.app_2_name, R.id.app_3_name)
        val countIds = intArrayOf(R.id.app_1_count, R.id.app_2_count, R.id.app_3_count)

        if (top.isEmpty()) {
            views.setTextViewText(R.id.widget_title, "App Usage Tracker")
            views.setTextViewText(nameIds[0], "No apps tracked today")
            views.setTextViewText(countIds[0], "")
            for (i in 1..2) {
                views.setTextViewText(nameIds[i], "")
                views.setTextViewText(countIds[i], "")
            }
        } else {
            views.setTextViewText(R.id.widget_title, "Top apps today")
            for (i in 0 until 3) {
                if (i < top.size) {
                    views.setTextViewText(nameIds[i], "${i + 1}. ${top[i].first}")
                    views.setTextViewText(countIds[i], "${top[i].second}")
                } else {
                    views.setTextViewText(nameIds[i], "")
                    views.setTextViewText(countIds[i], "")
                }
            }
        }

        try {
            val launch = context.packageManager.getLaunchIntentForPackage(context.packageName)
            if (launch != null) {
                val pending = PendingIntent.getActivity(
                    context, 0, launch, PendingIntent.FLAG_IMMUTABLE
                )
                views.setOnClickPendingIntent(R.id.widget_container, pending)
            }
        } catch (e: Exception) {
            // Click handler is optional
        }
        return views
    }
}
