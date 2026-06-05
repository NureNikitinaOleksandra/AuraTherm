package com.auratherm.mobile.model

data class Alert(
    val id: String,
    val status: String,          // "NEW", "ACKNOWLEDGED", "RESOLVED"
    val created_at: String,      // залишаємо назву як у БД і твоєму UI
    val sensor_id: String,
    val store_id: String,
    val sensor: Sensor           // Використовуємо повну модель датчика
)