package com.auratherm.mobile.viewmodel

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.auratherm.mobile.model.MobileZone
import com.auratherm.mobile.network.RetrofitClient
import kotlinx.coroutines.launch

class ZonesViewModel : ViewModel() {

    private val _zonesList = MutableLiveData<List<MobileZone>>()
    val zonesList: LiveData<List<MobileZone>> = _zonesList

    private val _isLoading = MutableLiveData<Boolean>()
    val isLoading: LiveData<Boolean> = _isLoading

    fun fetchAssignedZones(token: String) {
        _isLoading.value = true
        viewModelScope.launch {
            try {
                val formattedToken = if (token.startsWith("Bearer ")) token else "Bearer $token"
                val response = RetrofitClient.apiService.getAssignedSensors(formattedToken)

                if (response.isSuccessful && response.body() != null) {
                    // Отримуємо датчики з бекенду і групуємо їх, щоб витягти унікальні Зони
                    val assignments = response.body()!!
                    val uniqueZones = assignments.map { it.sensor.zone }.distinctBy { it.id }
                    _zonesList.value = uniqueZones
                }
            } catch (e: Exception) {
                // обробка помилки
            } finally {
                _isLoading.value = false
            }
        }
    }
}