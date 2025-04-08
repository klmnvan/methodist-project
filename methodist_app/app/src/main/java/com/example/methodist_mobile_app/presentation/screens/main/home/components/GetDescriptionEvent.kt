package com.example.methodist_mobile_app.presentation.screens.main.home.components

import com.example.methodist_mobile_app.data.models.EventModel

fun getDescriptionEvent(event: EventModel): String {
    return when(event.typeOfEvent.name) {
        "Участие" -> event.formOfEvent
        "Проведение" -> event.location
        "Стажировка" -> "Количество часов: ${event.quantityOfHours}"
        "Публикация" -> event.location
        else -> ""
    }
}