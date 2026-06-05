package com.auratherm.mobile.model

data class LoginResponse(
    val token: String,
    val user: UserDto
)

data class UserDto(
    val id: String,
    val email: String,
    val first_name: String,
    val last_name: String,
    val role: String,
    val store_id: String
)