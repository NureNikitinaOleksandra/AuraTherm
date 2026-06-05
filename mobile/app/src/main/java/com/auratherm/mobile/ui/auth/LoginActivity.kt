package com.auratherm.mobile.ui.auth

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.EditText
import android.widget.ProgressBar
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import com.auratherm.mobile.R
import com.auratherm.mobile.ui.main.MainActivity
import com.auratherm.mobile.utils.PrefManager
import com.auratherm.mobile.viewmodel.LoginViewModel

class LoginActivity : AppCompatActivity() {

    // Ініціалізуємо ViewModel за допомогою ktx делегата
    private val viewModel: LoginViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val existingToken = PrefManager.getToken(this)
        if (!existingToken.isNullOrEmpty()) {
            // Якщо токен є, одразу відкриваємо головну сторінку
            val intent = Intent(this, MainActivity::class.java)
            startActivity(intent)
            finish() // Закриваємо LoginActivity, щоб не повернутися сюди кнопкою "Назад"
            return   // Зупиняємо подальше виконання коду (щоб не вантажився дизайн логіну)
        }

        enableEdgeToEdge()
        setContentView(R.layout.activity_login)

        val etEmail = findViewById<EditText>(R.id.etEmail)
        val etPassword = findViewById<EditText>(R.id.etPassword)
        val btnLogin = findViewById<Button>(R.id.btnLogin)
        val progressBar = findViewById<ProgressBar>(R.id.progressBar)

        // Слухаємо кнопку
        btnLogin.setOnClickListener {
            val email = etEmail.text.toString().trim()
            val password = etPassword.text.toString().trim()
            viewModel.performLogin(email, password)
        }

        // Підписуємося на стан завантаження
        viewModel.isLoading.observe(this) { isLoading ->
            if (isLoading) {
                progressBar.visibility = View.VISIBLE
                btnLogin.isEnabled = false
            } else {
                progressBar.visibility = View.GONE
                btnLogin.isEnabled = true
            }
        }

        // Підписуємося на результат авторизації
        viewModel.loginResult.observe(this) { result ->
            result.onSuccess { loginResponse ->
                val token = loginResponse.token
                val userName = loginResponse.user.first_name

                // Зберігаємо токен локально на пристрої через SharedPreferences
                PrefManager.saveAuthData(this, token, userName)

                Toast.makeText(this, "Вітаємо, $userName! Вхід успішний.", Toast.LENGTH_LONG).show()

                // Перехід на наступну сторінку
                 val intent = Intent(this, MainActivity::class.java)
                 startActivity(intent)
                 finish() // Закриваємо екран логіну, щоб не можна було повернутися назад кнопкою "Back"
            }
            result.onFailure { exception ->
                // ПОМИЛКА (неправильний пароль або вимкнений сервер)
                Toast.makeText(this, exception.message, Toast.LENGTH_LONG).show()
            }
        }
    }
}