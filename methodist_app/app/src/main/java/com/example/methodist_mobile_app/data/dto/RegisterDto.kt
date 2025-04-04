package com.example.methodist_mobile_app.data.dto

import kotlinx.serialization.Serializable

@Serializable
data class RegisterDto(
    val confirmPassword: String,
    val email: String,
    val firstName: String,
    val lastName: String,
    val password: String,
    val patronymic: String
)