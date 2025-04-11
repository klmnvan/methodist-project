package com.example.methodist_mobile_app.data.dto

import kotlinx.serialization.Serializable

@Serializable
data class UpdateProfileDto(
    val firstName: String,
    val lastName: String,
    val patronymic: String,
)

