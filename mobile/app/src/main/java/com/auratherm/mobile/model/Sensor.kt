package com.auratherm.mobile.model

import com.google.gson.annotations.SerializedName

data class Sensor(
    val id: String,
    val name: String,
    val location: String?,
    val status: String,

    @SerializedName("zone_id")
    val zoneId: String,

    @SerializedName("store_id")
    val storeId: String,

    val zone: Zone, // Вкладена інформація про зону

    // Бекенд завжди повертає список (навіть якщо там 1 елемент або порожньо)
    val readings: List<SensorReading>
) {
    // Зручна властивість для UI: одразу повертає останню температуру або null, якщо вимірювань ще не було
    val currentTemperature: Double?
        get() = readings.firstOrNull()?.temperature

    val currentHumidity: Double?
        get() = readings.firstOrNull()?.humidity
}