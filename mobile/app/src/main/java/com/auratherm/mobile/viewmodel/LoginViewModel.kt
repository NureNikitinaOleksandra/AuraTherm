package com.auratherm.mobile.viewmodel

import android.app.Application
import android.util.Log
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.auratherm.mobile.model.FcmTokenRequest
import com.auratherm.mobile.model.LoginRequest
import com.auratherm.mobile.model.LoginResponse
import com.auratherm.mobile.network.RetrofitClient
import com.auratherm.mobile.utils.PrefManager
import com.google.firebase.messaging.FirebaseMessaging
import kotlinx.coroutines.launch
import kotlinx.coroutines.tasks.await

class LoginViewModel(application: Application) : AndroidViewModel(application) {
    // LiveData для спостереження за результатом входу в Activity
    private val _loginResult = MutableLiveData<Result<LoginResponse>>()
    val loginResult: LiveData<Result<LoginResponse>> = _loginResult

    // LiveData для стану завантаження (показувати ProgressBar чи ні)
    private val _isLoading = MutableLiveData<Boolean>()
    val isLoading: LiveData<Boolean> = _isLoading

    fun performLogin(email: String, password: String) {
        // Проста валідація на порожні поля перед відправкою
        if (email.isEmpty() || password.isEmpty()) {
            _loginResult.value = Result.failure(Exception("Заповніть всі поля!"))
            return
        }

        _isLoading.value = true

        // Запускаємо асинхронний запит у корутині
        viewModelScope.launch {
            try {
                val request = LoginRequest(email, password)
                val response = RetrofitClient.apiService.login(request)

                if (response.isSuccessful && response.body() != null) {
                    val loginResponse = response.body()!!

                    // Жорстка перевірка на роль працівника
                    if (loginResponse.user.role == "WORKER") {
                        // 1. Формуємо ім'я та зберігаємо дані через твій PrefManager
                        val userName = "${loginResponse.user.first_name} ${loginResponse.user.last_name}"
                        PrefManager.saveAuthData(getApplication(), loginResponse.token, userName)

                        // 2. Відправляємо FCM токен на бекенд
                        sendFcmTokenToBackend(loginResponse.token)

                        _loginResult.value = Result.success(loginResponse)
                    } else {
                        // Якщо заходить менеджер чи адмін — відшиваємо їх
                        _loginResult.value = Result.failure(Exception("Доступ заборонено. Мобільний клієнт створено виключно для лінійного персоналу!"))
                    }
                } else {
                    // Якщо сервер повернув помилку (наприклад 401 Unauthorized)
                    _loginResult.value = Result.failure(Exception("Неправильний email або пароль"))
                }
            } catch (e: Exception) {
                // Якщо взагалі немає зв'язку з сервером (наприклад, сервер вимкнений)
                _loginResult.value = Result.failure(Exception("Помилка підключення: ${e.localizedMessage}"))
            } finally {
                _isLoading.value = false
            }
        }
    }

    // Функція для відправки токена
    private suspend fun sendFcmTokenToBackend(jwtToken: String) {
        try {
            val fcmToken = FirebaseMessaging.getInstance().token.await()

            // Формуємо правильний заголовок (зазвичай це "Bearer <токен>")
            val authHeader = "Bearer $jwtToken"

            // Відправляємо на бекенд і JWT-токен, і FCM-токен
            val response = RetrofitClient.apiService.updateFcmToken(authHeader, FcmTokenRequest(fcmToken))

            if (response.isSuccessful) {
                Log.d("FCM", "FCM токен успішно прив'язано до акаунту")
            } else {
                Log.e("FCM", "Не вдалося прив'язати FCM токен: ${response.code()}")
            }
        } catch (e: Exception) {
            Log.e("FCM", "Помилка при отриманні/відправці FCM токена", e)
        }
    }
}