package com.example.methodist_mobile_app.data.responses

import com.example.methodist_mobile_app.data.dto.ProfileDto

data class GeneralResponse(
    val profileDto: ProfileDto? = null,
    val error: String = "",
)