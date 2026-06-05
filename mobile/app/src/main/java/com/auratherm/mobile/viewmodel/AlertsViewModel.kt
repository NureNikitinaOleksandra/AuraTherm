package com.auratherm.mobile.viewmodel

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.auratherm.mobile.model.Alert
import com.auratherm.mobile.network.RetrofitClient
import kotlinx.coroutines.launch

class AlertsViewModel : ViewModel() {

    private val _alertsList = MutableLiveData<List<Alert>>()
    val alertsList: LiveData<List<Alert>> = _alertsList

    private val _isLoading = MutableLiveData<Boolean>()
    val isLoading: LiveData<Boolean> = _isLoading

    private val _errorMessage = MutableLiveData<String?>()
    val errorMessage: LiveData<String?> = _errorMessage

    // Функція завантаження тривог
    fun fetchAlerts(token: String) {
        _isLoading.value = true
        viewModelScope.launch {
            try {
                val formattedToken = if (token.startsWith("Bearer ")) token else "Bearer $token"

                // Робимо два запити паралельно/послідовно
                val alertsResponse = RetrofitClient.apiService.getAllAlerts(formattedToken)
                val sensorsResponse = RetrofitClient.apiService.getAssignedSensors(formattedToken)

                if (alertsResponse.isSuccessful && sensorsResponse.isSuccessful) {
                    val allAlerts = alertsResponse.body() ?: emptyList()
                    val assignedSensors = sensorsResponse.body() ?: emptyList()

                    // 1. Створюємо список ID датчиків, які закріплені за цим працівником
                    val mySensorIds = assignedSensors.map { it.sensor_id }

                    // 2. Фільтруємо тривоги:
                    // Відкидаємо вирішені (RESOLVED) І залишаємо тільки ті, що належать моїм датчикам
                    val myActiveAlerts = allAlerts.filter { alert ->
                        alert.status != "RESOLVED" && mySensorIds.contains(alert.sensor_id)
                    }

                    _alertsList.value = myActiveAlerts
                    _errorMessage.value = null
                } else {
                    _errorMessage.value = "Не вдалося завантажити дані"
                }
            } catch (e: Exception) {
                _errorMessage.value = "Помилка мережі: ${e.localizedMessage}"
            } finally {
                _isLoading.value = false
            }
        }
    }

    // Функція обробки кліку по кнопці (зміна статусу)
    fun processAlertAction(token: String, alert: Alert) {
        viewModelScope.launch {
            try {
                val formattedToken = if (token.startsWith("Bearer ")) token else "Bearer $token"

                val response = if (alert.status == "NEW") {
                    // Якщо була нова — переводимо в роботу
                    RetrofitClient.apiService.acknowledgeAlert(formattedToken, alert.id)
                } else {
                    // Якщо була в роботі — закриваємо
                    RetrofitClient.apiService.resolveAlert(formattedToken, alert.id)
                }

                if (response.isSuccessful) {
                    // Після успішної зміни статусу на бекенді, просто оновлюємо список заново
                    fetchAlerts(token)
                } else {
                    _errorMessage.value = "Помилка оновлення статусу"
                }
            } catch (e: Exception) {
                _errorMessage.value = "Помилка: ${e.localizedMessage}"
            }
        }
    }
}