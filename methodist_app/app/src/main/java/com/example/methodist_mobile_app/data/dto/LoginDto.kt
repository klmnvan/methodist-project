package com.example.methodist_mobile_app.data.dto

import kotlinx.serialization.Serializable

@Serializable
data class LoginDto(
    val device: String,
    val email: String,
    val password: String
)
