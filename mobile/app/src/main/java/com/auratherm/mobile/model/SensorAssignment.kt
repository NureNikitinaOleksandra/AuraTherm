package com.auratherm.mobile.model

data class SensorAssignment(
    val user_id: String,
    val sensor_id: String,
    val sensor: MobileSensor
)

data class MobileSensor(
    val id: String,
    val name: String,
    val status: String,
    val zone_id: String,
    val store_id: String,
    val zone: MobileZone
)

data class MobileZone(
    val id: String,
    val name: String,
    val min_temp: Double,
    val max_temp: Double,
    val store_id: String
)