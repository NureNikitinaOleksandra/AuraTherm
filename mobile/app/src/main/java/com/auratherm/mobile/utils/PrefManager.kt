package com.auratherm.mobile.utils

import android.content.Context
import android.content.SharedPreferences

object PrefManager {
    private const val PREF_NAME = "AuraThermPrefs"
    private const val KEY_TOKEN = "jwt_token"
    private const val KEY_USER_NAME = "user_name"

    private fun getPrefs(context: Context): SharedPreferences {
        return context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
    }

    // Зберегти токен та ім'я при успішному вході
    fun saveAuthData(context: Context, token: String, name: String) {
        getPrefs(context).edit().apply {
            putString(KEY_TOKEN, token)
            putString(KEY_USER_NAME, name)
            apply()
        }
    }

    // Отримати токен для подальших запитів до API
    fun getToken(context: Context): String? {
        return getPrefs(context).getString(KEY_TOKEN, null)
    }

    // Отримати ім'я користувача, щоб показати на головному екрані
    fun getUserName(context: Context): String {
        return getPrefs(context).getString(KEY_USER_NAME, "Працівник") ?: "Працівник"
    }

    // Видалити дані при виході з акаунту (Log Out)
    fun clearAuthData(context: Context) {
        getPrefs(context).edit().clear().apply()
    }
}