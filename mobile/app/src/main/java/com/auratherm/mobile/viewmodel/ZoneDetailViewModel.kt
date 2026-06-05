package com.auratherm.mobile.viewmodel

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.auratherm.mobile.model.Sensor
import com.auratherm.mobile.network.RetrofitClient
import kotlinx.coroutines.launch

class ZoneDetailViewModel : ViewModel() {

    private val _sensorsList = MutableLiveData<List<Sensor>>()
    val sensorsList: LiveData<List<Sensor>> = _sensorsList

    private val _isLoading = MutableLiveData<Boolean>()
    val isLoading: LiveData<Boolean> = _isLoading

    fun fetchSensorsForZone(token: String, zoneId: String) {
        _isLoading.value = true
        viewModelScope.launch {
            try {
                val formattedToken = if (token.startsWith("Bearer ")) token else "Bearer $token"
                // Викликаємо ендпоінт, який ми додали раніше в ApiService
                val response = RetrofitClient.apiService.getZoneSensors(formattedToken, zoneId)

                if (response.isSuccessful && response.body() != null) {
                    _sensorsList.value = response.body()!!
                } else {
                    _sensorsList.value = emptyList()
                }
            } catch (e: Exception) {
                _sensorsList.value = emptyList()
            } finally {
                _isLoading.value = false
            }
        }
    }
}