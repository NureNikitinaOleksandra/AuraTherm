package com.auratherm.mobile.network

import com.auratherm.mobile.model.Alert
import com.auratherm.mobile.model.FcmTokenRequest
import com.auratherm.mobile.model.LoginRequest
import com.auratherm.mobile.model.LoginResponse
import com.auratherm.mobile.model.Sensor
import com.auratherm.mobile.model.SensorAssignment
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.PATCH
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Path

interface ApiService {
    // Авторизація Працівника
    @POST("/api/auth/login")
    suspend fun login(@Body request: LoginRequest): Response<LoginResponse>

    // Отримати список усіх тривог
    @GET("/api/alerts")
    suspend fun getAllAlerts(
        @Header("Authorization") token: String
    ): Response<List<Alert>>

    // Взяти тривогу в роботу
    @PATCH("/api/alerts/{id}/acknowledge")
    suspend fun acknowledgeAlert(
        @Header("Authorization") token: String,
        @Path("id") alertId: String
    ): Response<Alert>

    // Завершити тривогу (проблема вирішена)
    @PATCH("/api/alerts/{id}/resolve")
    suspend fun resolveAlert(
        @Header("Authorization") token: String,
        @Path("id") alertId: String
    ): Response<Alert>

    // Отримати список датчиків, закріплених за працівником
    @GET("/api/sensors/assigned")
    suspend fun getAssignedSensors(
        @Header("Authorization") token: String
    ): Response<List<SensorAssignment>>

    @PUT("/api/users/fcm-token")
    suspend fun updateFcmToken(
        @Header("Authorization") token: String,
        @Body request: FcmTokenRequest
    ): Response<Unit>

    // Отримати детальну тривогу
    @GET("/api/alerts/{id}")
    suspend fun getAlertById(
        @Header("Authorization") token: String,
        @Path("id") alertId: String
    ): Response<Alert>

    // Отримати датчики для конкретної зони
    @GET("/api/zones/{id}/sensors")
    suspend fun getZoneSensors(
        @Header("Authorization") token: String,
        @Path("id") zoneId: String
    ): Response<List<Sensor>>
}