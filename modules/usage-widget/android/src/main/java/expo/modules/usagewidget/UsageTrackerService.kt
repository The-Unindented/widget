package expo.modules.usagewidget

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.app.usage.UsageEvents
import android.app.usage.UsageStatsManager
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.content.pm.ServiceInfo
import android.os.Build
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import androidx.core.app.ServiceCompat

/**
 * Foreground service that polls UsageStatsManager every few seconds and
 * records the current foreground app, so counting continues while the
 * app itself is closed.
 */
class UsageTrackerService : Service() {

    companion object {
        private const val CHANNEL_ID = "usage_tracking"
        private const val NOTIFICATION_ID = 42
        private const val POLL_INTERVAL_MS = 5000L
        private const val LOOKBACK_MS = 60000L

        @Volatile
        private var isRunning = false

        fun isRunning(): Boolean = isRunning
    }

    private val handler = Handler(Looper.getMainLooper())
    private var lastSeenPackage: String? = null

    private val poller = object : Runnable {
        override fun run() {
            try {
                checkForegroundApp()
            } catch (e: Exception) {
                // Keep the loop alive no matter what
            }
            handler.postDelayed(this, POLL_INTERVAL_MS)
        }
    }

    override fun onCreate() {
        super.onCreate()
        createChannel()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        ServiceCompat.startForeground(
            this,
            NOTIFICATION_ID,
            buildNotification(),
            ServiceInfo.FOREGROUND_SERVICE_TYPE_DATA_SYNC
        )
        if (!isRunning) {
            isRunning = true
            handler.post(poller)
        }
        return START_STICKY
    }

    override fun onDestroy() {
        isRunning = false
        handler.removeCallbacks(poller)
        super.onDestroy()
    }

    override fun onBind(intent: Intent?): IBinder? = null

    private fun checkForegroundApp() {
        val pkg = currentForegroundPackage() ?: return
        if (pkg == packageName) return
        if (isLauncher(pkg)) return
        if (pkg == lastSeenPackage) return
        lastSeenPackage = pkg
        WidgetDataStore.recordApp(this, pkg, appName(pkg))
    }

    private fun currentForegroundPackage(): String? {
        val usm = getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
        val now = System.currentTimeMillis()
        val events = usm.queryEvents(now - LOOKBACK_MS, now)
        val event = UsageEvents.Event()
        var foreground: String? = null
        while (events.hasNextEvent()) {
            events.getNextEvent(event)
            if (event.eventType == UsageEvents.Event.MOVE_TO_FOREGROUND) {
                foreground = event.packageName
            }
        }
        return foreground
    }

    private fun isLauncher(pkg: String): Boolean {
        return try {
            val intent = Intent(Intent.ACTION_MAIN)
                .addCategory(Intent.CATEGORY_HOME)
                .setPackage(pkg)
            packageManager.resolveActivity(intent, PackageManager.MATCH_DEFAULT_ONLY) != null
        } catch (e: Exception) {
            false
        }
    }

    private fun appName(pkg: String): String {
        return try {
            val info = packageManager.getApplicationInfo(pkg, 0)
            packageManager.getApplicationLabel(info).toString()
        } catch (e: Exception) {
            pkg
        }
    }

    private fun createChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "Usage tracking",
                NotificationManager.IMPORTANCE_LOW
            )
            channel.description = "Counts which apps you open each day"
            val nm = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            nm.createNotificationChannel(channel)
        }
    }

    private fun buildNotification(): Notification {
        val builder = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            Notification.Builder(this, CHANNEL_ID)
        } else {
            @Suppress("DEPRECATION")
            Notification.Builder(this)
        }
        builder.setContentTitle("Tracking app usage")
            .setContentText("Counting your daily app opens")
            .setSmallIcon(android.R.drawable.ic_menu_view)
            .setOngoing(true)
        try {
            val launch = packageManager.getLaunchIntentForPackage(packageName)
            if (launch != null) {
                builder.setContentIntent(
                    PendingIntent.getActivity(this, 0, launch, PendingIntent.FLAG_IMMUTABLE)
                )
            }
        } catch (e: Exception) {
            // Content intent is optional
        }
        return builder.build()
    }
}
