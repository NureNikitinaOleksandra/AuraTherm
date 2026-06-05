package com.auratherm.mobile.network

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.media.RingtoneManager
import android.os.Build
import android.util.Log
import androidx.core.app.NotificationCompat
import com.auratherm.mobile.R
import com.auratherm.mobile.model.FcmTokenRequest
import com.auratherm.mobile.utils.PrefManager
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class AuraThermFirebaseMessagingService : FirebaseMessagingService() {

    // Викликається, коли пристрій отримує або оновлює свій FCM токен
    override fun onNewToken(token: String) {
        super.onNewToken(token)
        Log.d("FCM", "Новий токен: $token")

        // Використовуємо твій існуючий PrefManager
        val jwtToken = PrefManager.getToken(applicationContext)

        if (jwtToken != null) {
            CoroutineScope(Dispatchers.IO).launch {
                try {
                    val authHeader = "Bearer $jwtToken"
                    val request = FcmTokenRequest(token)

                    val response = RetrofitClient.apiService.updateFcmToken(authHeader, request)
                    if (response.isSuccessful) {
                        Log.d("FCM", "Токен успішно оновлено на сервері")
                    }
                } catch (e: Exception) {
                    Log.e("FCM", "Помилка відправки токена", e)
                }
            }
        } else {
            Log.d("FCM", "Користувач ще не увійшов у систему, токен буде відправлено при логіні")
        }
    }

    // Викликається, коли приходить пуш, а додаток ВІДКРИТИЙ
    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        super.onMessageReceived(remoteMessage)

        val title = remoteMessage.notification?.title ?: "AuraTherm: Тривога!"
        val body = remoteMessage.notification?.body ?: "Зафіксовано відхилення температури."

        // Дістаємо прихований alertId, який ми додали на бекенді
        val alertId = remoteMessage.data["alertId"]

        Log.d("FCM", "Отримано пуш у foreground: $title - $body, alertId: $alertId")

        sendNotification(title, body, alertId)

        // --- Повідомляємо додаток про нову тривогу ---
        CoroutineScope(Dispatchers.IO).launch {
            com.auratherm.mobile.utils.AlertEventBus.emitAlertEvent()
        }
    }


    private fun sendNotification(title: String, messageBody: String, alertId: String?) {

        val intent = Intent(this, com.auratherm.mobile.ui.alerts.AlertDetailActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
            // Кладемо ID тривоги, щоб Activity знала, що завантажувати
            if (alertId != null) {
                putExtra("ALERT_ID", alertId)
            }
        }

        val pendingIntent = PendingIntent.getActivity(
            this, 0, intent,
            PendingIntent.FLAG_ONE_SHOT or PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
        )

        val channelId = "auratherm_alerts_channel"
        val defaultSoundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION)

        val notificationBuilder = NotificationCompat.Builder(this, channelId)
            // Заміни на свою іконку:
            // .setSmallIcon(R.drawable.ic_alert)
            .setSmallIcon(android.R.drawable.ic_dialog_alert)
            .setContentTitle(title)
            .setContentText(messageBody)
            .setAutoCancel(true)
            .setSound(defaultSoundUri)
            .setPriority(NotificationCompat.PRIORITY_HIGH) // Високий пріоритет для появи поверх вікон
            .setContentIntent(pendingIntent)

        val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

        // Для Android 8.0+ (Oreo) обов'язково потрібен Notification Channel
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                channelId,
                "AuraTherm Критичні Сповіщення",
                NotificationManager.IMPORTANCE_HIGH
            )
            notificationManager.createNotificationChannel(channel)
        }

        // Показуємо сповіщення (генеруємо випадковий ID, щоб вони не перезаписували одне одного)
        notificationManager.notify(System.currentTimeMillis().toInt(), notificationBuilder.build())
    }
}