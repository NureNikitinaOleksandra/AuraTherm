package com.auratherm.mobile.model

import com.google.gson.annotations.SerializedName

data class Zone(
    val id: String,
    val name: String,

    // Залишаємо назви min_temp та max_temp, щоб вони збігалися з кодом Activity
    @SerializedName("min_temp")
    val min_temp: Double,

    @SerializedName("max_temp")
    val max_temp: Double,

    @SerializedName("store_id")
    val storeId: String
)