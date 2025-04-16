package com.example.methodist_mobile_app.presentation.screens.main.home.state

import com.example.methodist_mobile_app.data.models.EventModel
import com.example.methodist_mobile_app.data.models.TypeOfEventModel

data class HomeSt(
    var categorySelectAll: TypeOfEventModel = TypeOfEventModel("", "Всё"),
    var search: String = "",
    var events: MutableList<EventModel> = mutableListOf(),
    var eventsShow: MutableList<EventModel> = mutableListOf(),
    var categories: MutableList<TypeOfEventModel> = mutableListOf(categorySelectAll),
    var selectedCategory: TypeOfEventModel = categorySelectAll,
    var sortedType: Int = 0,
    var listSortedType: List<String> = listOf("без сортировки","дата: по убыванию", "дата: по возрастанию"),
    var filtersIsOpen: Boolean = false,
    var showEvent: EventModel? = null
)