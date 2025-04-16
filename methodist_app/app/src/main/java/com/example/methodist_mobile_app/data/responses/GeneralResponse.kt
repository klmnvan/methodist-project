package com.example.methodist_mobile_app.data.responses

import com.example.methodist_mobile_app.data.dto.ProfileDto
import com.example.methodist_mobile_app.data.models.EventModel
import com.example.methodist_mobile_app.data.models.ProfileModel

data class GeneralResponse(
    val profileDto: ProfileDto? = null,
    val error: String = "",
    val listEvent: List<EventModel> = listOf(),
    val event: EventModel? = null,
    val profile: ProfileModel? = null,
    val listStatuses: List<String> = listOf(),
    val listResults: List<String> = listOf(),
    val listEventsForms: List<String> = listOf(),
    val listPartForms: List<String> = listOf(),
)