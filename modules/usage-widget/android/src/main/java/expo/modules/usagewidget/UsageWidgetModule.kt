package expo.modules.usagewidget

import android.app.AppOpsManager
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.Process
import android.provider.Settings
import androidx.core.content.ContextCompat
import expo.modules.kotlin.Promise
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class UsageWidgetModule : Module() {

    private val context: Context
        get() = requireNotNull(appContext.reactContext) { "Application context is not available" }

    override fun definition() = ModuleDefinition {
        Name("UsageWidget")

        AsyncFunction("hasUsageAccess") { promise: Promise ->
            promise.resolve(hasUsageAccess())
        }

        Function("openUsageAccessSettings") {
            try {
                val intent = Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS)
                    .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                context.startActivity(intent)
            } catch (e: Exception) {
                // Some devices do not expose the usage access screen
            }
        }

        AsyncFunction("startTrackingService") { promise: Promise ->
            try {
                ContextCompat.startForegroundService(
                    context,
                    Intent(context, UsageTrackerService::class.java)
                )
                promise.resolve(true)
            } catch (e: Exception) {
                promise.resolve(false)
            }
        }

        AsyncFunction("stopTrackingService") { promise: Promise ->
            try {
                context.stopService(Intent(context, UsageTrackerService::class.java))
                promise.resolve(true)
            } catch (e: Exception) {
                promise.resolve(false)
            }
        }

        AsyncFunction("isTrackingRunning") { promise: Promise ->
            promise.resolve(UsageTrackerService.isRunning())
        }

        AsyncFunction("getTodayStats") { promise: Promise ->
            promise.resolve(WidgetDataStore.getTodayStats(context))
        }

        AsyncFunction("resetAllData") { promise: Promise ->
            WidgetDataStore.resetAll(context)
            promise.resolve(true)
        }

        AsyncFunction("updateWidget") { promise: Promise ->
            WidgetDataStore.updateWidgets(context)
            promise.resolve(true)
        }
    }

    private fun hasUsageAccess(): Boolean {
        return try {
            val appOps = context.getSystemService(Context.APP_OPS_SERVICE) as AppOpsManager
            val mode = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                appOps.unsafeCheckOpNoThrow(
                    AppOpsManager.OPSTR_GET_USAGE_STATS,
                    Process.myUid(),
                    context.packageName
                )
            } else {
                @Suppress("DEPRECATION")
                appOps.checkOpNoThrow(
                    AppOpsManager.OPSTR_GET_USAGE_STATS,
                    Process.myUid(),
                    context.packageName
                )
            }
            mode == AppOpsManager.MODE_ALLOWED
        } catch (e: Exception) {
            false
        }
    }
}
