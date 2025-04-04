package com.example.methodist_mobile_app.data.dto

import kotlinx.serialization.Serializable

@Serializable
data class ProfileDto(
    val firstName: String = "",
    val lastName: String = "",
    val mC_id: String? = "",
    val patronymic: String = "",
    val token: String = "",
)