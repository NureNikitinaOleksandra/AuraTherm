package com.auratherm.mobile.model

import com.google.gson.annotations.SerializedName

data class SensorReading(
    val id: String,
    val temperature: Double,
    val humidity: Double?,
    // Використовуємо SerializedName, бо в БД поле називається dew_point (з нижнім підкресленням)
    @SerializedName("dew_point")
    val dewPoint: Double?,
    val timestamp: String // Час приходить у форматі ISO 8601 (рядок)
)