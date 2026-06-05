package com.auratherm.mobile.viewmodel

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.auratherm.mobile.model.Alert
import com.auratherm.mobile.network.RetrofitClient
import kotlinx.coroutines.launch

class AlertDetailViewModel : ViewModel() {

    private val _alertData = MutableLiveData<Alert?>()
    val alertData: LiveData<Alert?> = _alertData

    private val _actionSuccess = MutableLiveData<String>()
    val actionSuccess: LiveData<String> = _actionSuccess

    // Завантажуємо конкретну тривогу (для простоти беремо зі списку всіх тривог по ID)
    fun loadAlertDetails(token: String, alertId: String) {
        viewModelScope.launch {
            try {
                val formattedToken = if (token.startsWith("Bearer ")) token else "Bearer $token"
                val response = RetrofitClient.apiService.getAlertById(formattedToken, alertId)
                if (response.isSuccessful) {
                    _alertData.value = response.body()
                } else {
                    _alertData.value = null
                }
            } catch (e: Exception) {
                _alertData.value = null
            }
        }
    }

    // Логіка єдиної кнопки: залежно від поточного стану викликаємо потрібний PATCH
    fun executeNextAction(token: String, alertId: String, currentStatus: String) {
        viewModelScope.launch {
            try {
                val formattedToken = if (token.startsWith("Bearer ")) token else "Bearer $token"
                val response = when (currentStatus) {
                    "NEW" -> RetrofitClient.apiService.acknowledgeAlert(formattedToken, alertId)
                    "ACKNOWLEDGED" -> RetrofitClient.apiService.resolveAlert(formattedToken, alertId)
                    else -> return@launch
                }

                if (response.isSuccessful) {
                    // Визначаємо, який статус ми щойно встановили
                    val newStatus = if (currentStatus == "NEW") "ACKNOWLEDGED" else "RESOLVED"
                    _actionSuccess.value = newStatus
                } else {
                    _actionSuccess.value = "ERROR"
                }
            } catch (e: Exception) {
                _actionSuccess.value = "ERROR"
            }
        }
    }
}