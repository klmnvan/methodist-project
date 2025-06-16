package com.example.methodist_mobile_app.presentation.screens.main.events.state

import com.example.methodist_mobile_app.data.models.EventModel
import com.example.methodist_mobile_app.data.models.ProfileModel
import com.example.methodist_mobile_app.data.models.TypeOfEventModel
import com.example.methodist_mobile_app.presentation.screens.main.events.components.currentDay
import com.example.methodist_mobile_app.presentation.screens.main.events.components.currentMonth
import com.example.methodist_mobile_app.presentation.screens.main.events.components.currentYear
import com.example.methodist_mobile_app.presentation.screens.main.events.participation.UiFile
import com.example.methodist_mobile_app.presentation.ui.theme.convertDateToTimestamptz

data class CreateEventSt(
    var event: EventModel = EventModel(
        id = "",
        createdAt = convertDateToTimestamptz(currentYear, currentMonth, currentDay),
        updatedAt = convertDateToTimestamptz(currentYear, currentMonth, currentDay),
        dateOfEvent = convertDateToTimestamptz(currentYear, currentMonth, currentDay),
        endDateOfEvent = convertDateToTimestamptz(currentYear, currentMonth, currentDay),
        typeOfEvent = TypeOfEventModel("", ""),
        isApproved = false,
        type= "",
        name = "",
        formOfParticipation = "",
        formOfEvent = "",
        status = "",
        location = "",
        quantityOfHours = "",
        result = "",
        profile = ProfileModel()
    ),
    var chosenYear: Int = currentYear,
    var chosenMonth: Int = currentMonth,
    var chosenDay: Int = currentDay,
    var showDatePicker: Boolean = false,
    var otherStatus: String = "",
    var otherFormOfEvent : String = "",
    var otherResult: String = "",
    var listFormOfEvent: List<String> = listOf("Тест", "Тест2"),
    var listResult: List<String> = listOf("Тест", "Тест2"),
    var listStatus: List<String> = listOf("Тест", "Тест2"),
    var listFormOfParticipation: List<String> = listOf("Очное", "Заочное", "Проведение мероприятия"),
    var uploadedFiles: List<UiFile> = listOf()
)