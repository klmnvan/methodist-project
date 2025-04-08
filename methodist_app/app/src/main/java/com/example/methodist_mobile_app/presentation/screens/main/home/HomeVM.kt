package com.example.methodist_mobile_app.presentation.screens.main.home

import android.util.Log
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.methodist_mobile_app.data.network.ApiServiceImpl
import com.example.methodist_mobile_app.data.models.EventModel
import com.example.methodist_mobile_app.data.room.database.MKDatabase
import com.example.methodist_mobile_app.domain.repository.UserRepository
import com.example.methodist_mobile_app.presentation.screens.DialogSt
import com.example.methodist_mobile_app.presentation.screens.main.home.state.HomeSt
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import javax.inject.Inject

@HiltViewModel
class HomeVM @Inject constructor(
    private val service: ApiServiceImpl,
    private val database: MKDatabase
): ViewModel() {

    //состояние данных на экране
    private val _dataSt = MutableStateFlow(HomeSt())
    val dataSt: StateFlow<HomeSt> = _dataSt.asStateFlow()

    fun updData(value: HomeSt) {
        _dataSt.value = value
    }

    //состояние диалогового окна ошибки
    private val _dialogSt = MutableStateFlow(DialogSt())
    val dialogSt: StateFlow<DialogSt> = _dialogSt.asStateFlow()

    fun updDialog(value: DialogSt) {
        _dialogSt.value = value
    }

    init {
        updateValues()
        fetch()
    }

    fun updateValues() {

        viewModelScope.launch(Dispatchers.IO) {
            database.eventDao.getAll().collect {
                updData(dataSt.value.copy(
                    events = it.toMutableList(),
                ))
                Log.e("мероприятия из БД", it.toString())
            }
        }

        viewModelScope.launch(Dispatchers.IO) {
            database.typeOfEventDao.getAll().collect {
                val listCategory = mutableListOf(dataSt.value.categorySelectAll)
                listCategory.addAll(it)
                updData(dataSt.value.copy(
                    categories = listCategory,
                ))
                Log.e("типы мероприятий из БД", it.toString())
            }
        }

    }

    fun fetch() {
        viewModelScope.launch {
            val response = service.getEvents(profileId = UserRepository.profileId)
            if(response.listEvent.isNotEmpty()) {
                if(!_dataSt.value.events.equals(response.listEvent)) {
                    updateValues()
                }
            }
            if (response.error.isNotEmpty()) showError("Ошибка синхронизации", response.error)
        }
    }

    private fun showError(title: String, desc: String) {
        Log.d("events", "$title $desc")
        updDialog(dialogSt.value.copy(
            dialogIsOpen = true,
            title = title,
            description = desc)
        )
    }

    fun filterList() {
        with(dataSt.value) {
            var listEvent = events
            if(selectedCategory != categorySelectAll)
                listEvent = listEvent.filter { it.typeOfEvent == selectedCategory }.toMutableList()
            if (search.isNotEmpty())
                listEvent = eventsShow.filter { it.name.contains(search, ignoreCase = true) }.toMutableList()
            when(sortedType) {
                0 -> {
                    listEvent = listEvent.sortedWith(Comparator.comparing<EventModel, LocalDate> { model ->
                        LocalDate.parse(model.dateOfEvent, DateTimeFormatter.ISO_OFFSET_DATE_TIME)
                    }.reversed()).toMutableList()
                }
                1 -> {
                    listEvent = listEvent.sortedWith(Comparator.comparing { model ->
                        LocalDate.parse(model.dateOfEvent, DateTimeFormatter.ISO_OFFSET_DATE_TIME)
                    }).toMutableList()
                }
            }
            updData(copy(
                eventsShow = listEvent
            ))
        }
    }

}