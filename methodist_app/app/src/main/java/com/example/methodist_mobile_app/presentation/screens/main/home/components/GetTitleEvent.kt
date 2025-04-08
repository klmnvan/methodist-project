package com.example.methodist_mobile_app.presentation.screens.main.home.components

import com.example.methodist_mobile_app.data.models.EventModel

fun getTitleEvent(event: EventModel): String {
    return when(event.typeOfEvent.name) {
        "Участие" -> event.name
        "Проведение" -> event.name
        "Стажировка" -> event.location
        "Публикация" -> event.name
        else -> ""
    }
}