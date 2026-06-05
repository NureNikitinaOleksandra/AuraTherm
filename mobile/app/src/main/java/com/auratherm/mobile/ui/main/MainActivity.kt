package com.auratherm.mobile.ui.main

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.TextView
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.fragment.app.Fragment
import com.auratherm.mobile.R
import com.auratherm.mobile.ui.alerts.AlertDetailActivity
import com.auratherm.mobile.ui.alerts.AlertsFragment
import com.auratherm.mobile.ui.zones.ZonesFragment
import com.auratherm.mobile.ui.auth.LoginActivity
import com.auratherm.mobile.utils.PrefManager
import com.google.android.material.bottomnavigation.BottomNavigationView

class MainActivity : AppCompatActivity() {

    // Створюємо обробник результату запиту дозволу
    private val requestPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { isGranted: Boolean ->
        if (isGranted) {
            Log.d("FCM", "Дозвіл на сповіщення надано!")
        } else {
            Log.d("FCM", "Дозвіл на сповіщення відхилено користувачем")
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Перевірка токена: якщо працівник не залогінений, відправляємо на LoginActivity
        if (PrefManager.getToken(this) == null) {
            startActivity(Intent(this, LoginActivity::class.java))
            finish()
            return
        }

        setContentView(R.layout.activity_main)

        // Запитуємо дозвіл при запуску екрану
        askNotificationPermission()

        val tvWelcome = findViewById<TextView>(R.id.tvWelcome)
        val tvSubtitle = findViewById<TextView>(R.id.tvSubtitle)
        val btnLogout = findViewById<Button>(R.id.btnLogout)

        // Встановлюємо ім'я
        tvWelcome.text = "Привіт, ${PrefManager.getUserName(this)}!"

        // Логіка виходу
        btnLogout.setOnClickListener {
            PrefManager.clearAuthData(this)
            startActivity(Intent(this, LoginActivity::class.java))
            finish()
        }

        val bottomNavigation = findViewById<BottomNavigationView>(R.id.bottomNavigation)

        // За замовчуванням при запуску відкриваємо перший фрагмент (Тривоги)
        if (savedInstanceState == null) {
            replaceFragment(AlertsFragment())
        }

        // Обробка натискань на вкладки знизу
        bottomNavigation.setOnItemSelectedListener { item ->
            when (item.itemId) {
                R.id.nav_alerts -> {
                    tvSubtitle.text = "Панель моніторингу тривог"
                    replaceFragment(AlertsFragment())
                    true
                }
                R.id.nav_zones -> {
                    tvSubtitle.text = "Ваші закріплені зони"
                    replaceFragment(ZonesFragment())
                    true
                }
                else -> false
            }
        }

        checkIntentForPushNotification(intent)
    }

    // Якщо MainActivity вже жива у фоні (наприклад, згорнута),
    // Android не буде викликати onCreate вдруге. Він викличе onNewIntent.
    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        setIntent(intent) // Оновлюємо поточний Intent
        checkIntentForPushNotification(intent)
    }

    private fun checkIntentForPushNotification(intent: Intent?) {
        // Шукаємо ключ "alertId", який ми передали з бекенду (з notification.service.ts)
        val alertId = intent?.extras?.getString("alertId")

        if (alertId != null) {
            Log.d("FCM", "Перехоплено фоновий пуш! Перехід до тривоги: $alertId")

            // Створюємо Intent для переходу на сторінку деталей тривоги
            val detailIntent = Intent(this, AlertDetailActivity::class.java).apply {
                putExtra("ALERT_ID", alertId)
            }
            startActivity(detailIntent)
        }
    }

    private fun askNotificationPermission() {
        // Запит потрібен лише для Android 13 (API 33) і вище
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS) ==
                PackageManager.PERMISSION_GRANTED
            ) {
                // Дозвіл вже є, нічого не робимо
            } else {
                // Показуємо системне діалогове вікно з питанням
                requestPermissionLauncher.launch(Manifest.permission.POST_NOTIFICATIONS)
            }
        }
    }

    // Зручна функція для заміни фрагментів у контейнері
    private fun replaceFragment(fragment: Fragment) {
        supportFragmentManager.beginTransaction()
            .replace(R.id.fragmentContainer, fragment)
            .commit()
    }
}