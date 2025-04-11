package com.example.methodist_mobile_app.data.dto

import kotlinx.serialization.Serializable

@Serializable
data class CreateEventDto(
    var dateOfEvent: String = "",
    var endDateOfEvent: String = "",
    var formOfEvent: String = "",
    var formOfParticipation: String = "",
    var isApproved: Boolean = false,
    var isChecked: Boolean = false,
    var location: String = "",
    var name: String = "",
    var quantityOfHours: String = "",
    var result: String = "",
    var status: String = "",
    var typeId: String = "",
    var type: String = "",
)