package com.auratherm.mobile.ui.alerts

import android.content.Intent
import android.graphics.Color
import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.Toolbar
import com.auratherm.mobile.R
import com.auratherm.mobile.model.Alert
import androidx.activity.OnBackPressedCallback
import com.auratherm.mobile.ui.main.MainActivity
import com.auratherm.mobile.utils.PrefManager
import com.auratherm.mobile.viewmodel.AlertDetailViewModel

class AlertDetailActivity : AppCompatActivity() {

    private val viewModel: AlertDetailViewModel by viewModels()
    private lateinit var token: String
    private lateinit var alertId: String

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_alert_detail)

        token = PrefManager.getToken(this) ?: ""
        alertId = intent.getStringExtra("ALERT_ID") ?: ""

        val toolbar = findViewById<Toolbar>(R.id.toolbar)
        setSupportActionBar(toolbar)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)

        // 1. Оновлюємо поведінку стрілочки в Toolbar
        toolbar.setNavigationOnClickListener {
            handleBackNavigation()
        }

        // 2. Оновлюємо системний жест "Назад" / системну кнопку
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                handleBackNavigation()
            }
        })

        val tvSensor = findViewById<TextView>(R.id.tvDetailSensor)
        val tvZone = findViewById<TextView>(R.id.tvDetailZone)
        val tvStatus = findViewById<TextView>(R.id.tvDetailStatus)
        val tvTime = findViewById<TextView>(R.id.tvDetailTime)
        val btnAction = findViewById<Button>(R.id.btnDetailAction)

        // Знаходимо наші нові TextView
        val tvTemperature = findViewById<TextView>(R.id.tvDetailTemperature)
        val tvZoneNorm = findViewById<TextView>(R.id.tvDetailZoneNorm)

        viewModel.alertData.observe(this) { alert ->
            // Передаємо нові поля у функцію setupUI
            alert?.let { setupUI(it, tvSensor, tvZone, tvStatus, tvTime, btnAction, tvTemperature, tvZoneNorm) }
        }

        viewModel.actionSuccess.observe(this) { newStatus ->
            when (newStatus) {
                "RESOLVED" -> {
                    Toast.makeText(this, "Тривогу вирішено!", Toast.LENGTH_SHORT).show()
                    finish() // Закриваємо екран, повертаємось до списку
                }
                "ACKNOWLEDGED" -> {
                    Toast.makeText(this, "Статус оновлено: В обробці", Toast.LENGTH_SHORT).show()
                    viewModel.loadAlertDetails(token, alertId) // Оновлюємо інтерфейс локально
                }
                "ERROR" -> {
                    Toast.makeText(this, "Помилка виконання дії", Toast.LENGTH_SHORT).show()
                }
            }
        }

        viewModel.loadAlertDetails(token, alertId)
    }

    // --- ФУНКЦІЯ ДЛЯ НАВІГАЦІЇ ---
    private fun handleBackNavigation() {
        if (isTaskRoot) {
            // Якщо це єдина сторінка (відкрита з пуш-сповіщення),
            // примусово запускаємо MainActivity замість виходу з додатку
            val intent = Intent(this, MainActivity::class.java)
            startActivity(intent)
        }
        finish() // Закриваємо поточну сторінку деталей
    }

    private fun setupUI(
        alert: Alert,
        tvSensor: TextView,
        tvZone: TextView,
        tvStatus: TextView,
        tvTime: TextView,
        btnAction: Button,
        tvTemperature: TextView,
        tvZoneNorm: TextView
    ) {
        tvSensor.text = alert.sensor.name
        tvZone.text = "Зона: ${alert.sensor.zone.name}"

        // Безпечно форматуємо дату (якщо формат раптом відрізняється, не буде крашу)
        val timeString = alert.created_at.replace("T", " ")
        tvTime.text = "Час виникнення: ${if (timeString.length >= 16) timeString.substring(0, 16) else timeString}"

        // --- ЛОГІКА ТЕМПЕРАТУРИ ТА НОРМ ---
        // Якщо у тебе в Zone поля називаються minTemp і maxTemp (через @SerializedName), використовуй їх
        val minTemp = alert.sensor.zone.min_temp
        val maxTemp = alert.sensor.zone.max_temp
        tvZoneNorm.text = "Норма зони: від $minTemp°C до $maxTemp°C"

        val currentTemp = alert.sensor.currentTemperature // Наша зручна властивість з моделі Sensor

        if (currentTemp != null) {
            val violationReason = when {
                currentTemp > maxTemp -> "Перевищення ліміту!"
                currentTemp < minTemp -> "Занизька температура!"
                else -> "В межах норми (Можливий ризик конденсату)"
            }
            tvTemperature.text = "Температура: $currentTemp°C\n($violationReason)"
        } else {
            tvTemperature.text = "Температура: Немає даних"
        }

        // --- ЛОГІКА КНОПКИ ---
        when (alert.status) {
            "NEW" -> {
                tvStatus.text = "Статус: Нова"
                tvStatus.setTextColor(Color.parseColor("#F44336"))

                btnAction.text = "Прийняти в роботу"
                btnAction.setBackgroundColor(Color.parseColor("#FF9800"))
                btnAction.visibility = View.VISIBLE
            }
            "ACKNOWLEDGED" -> {
                tvStatus.text = "Статус: В обробці"
                tvStatus.setTextColor(Color.parseColor("#FF9800"))

                btnAction.text = "Проблему вирішено"
                btnAction.setBackgroundColor(Color.parseColor("#4CAF50"))
                btnAction.visibility = View.VISIBLE
            }
            "RESOLVED" -> {
                tvStatus.text = "Статус: Вирішена"
                tvStatus.setTextColor(Color.parseColor("#4CAF50"))
                btnAction.visibility = View.GONE
            }
        }

        btnAction.setOnClickListener {
            viewModel.executeNextAction(token, alert.id, alert.status)
        }
    }
}