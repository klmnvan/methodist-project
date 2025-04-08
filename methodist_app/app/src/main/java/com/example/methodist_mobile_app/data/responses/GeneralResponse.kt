package com.example.methodist_mobile_app.data.responses

import com.example.methodist_mobile_app.data.dto.ProfileDto
import com.example.methodist_mobile_app.data.models.EventModel
import com.example.methodist_mobile_app.data.models.ProfileModel
import com.example.methodist_mobile_app.presentation.screens.main.profile.Profile

data class GeneralResponse(
    val profileDto: ProfileDto? = null,
    val error: String = "",
    val listEvent: List<EventModel> = listOf(),
    val profile: ProfileModel? = null,
)