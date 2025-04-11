package com.example.methodist_mobile_app.presentation.screens.main.events.publication

import android.util.Log
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import androidx.navigation.NavHostController
import com.example.methodist_mobile_app.data.dto.CreateEventDto
import com.example.methodist_mobile_app.data.network.ApiServiceImpl
import com.example.methodist_mobile_app.presentation.navigation.NavRoutes
import com.example.methodist_mobile_app.presentation.screens.DialogSt
import com.example.methodist_mobile_app.presentation.screens.main.events.state.CreateEventSt
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class PublicationVM @Inject constructor(
    private val service: ApiServiceImpl
) : ViewModel() {

    //состояние данных на экране
    private val _dataSt = MutableStateFlow(CreateEventSt())
    val dataSt: StateFlow<CreateEventSt> = _dataSt.asStateFlow()

    fun updData(value: CreateEventSt) {
        _dataSt.value = value
    }

    //состояние диалогового окна ошибки
    private val _dialogSt = MutableStateFlow(DialogSt())
    val dialogSt: StateFlow<DialogSt> = _dialogSt.asStateFlow()

    fun updDialog(value: DialogSt) {
        _dialogSt.value = value
    }

    fun createEvent(controller: NavHostController) {
        viewModelScope.launch {
            with(dataSt.value.event) {
                if(location.trim().isNotEmpty() && dateOfEvent.trim().isNotEmpty() && name.trim().isNotEmpty() && type.trim().isNotEmpty()) {
                    val dto = CreateEventDto(
                        location = location,
                        name = name,
                        type = type,
                        dateOfEvent = dateOfEvent,
                        endDateOfEvent = endDateOfEvent,
                        typeId = "5ce9f584-6fea-41e9-9a64-4ab4d9d09e84"
                    )
                    val response = service.createEvent(dto)
                    if (response.error.isNotEmpty()) showError("Ошибка при создании мероприятия", response.error)
                    else {
                        controller.navigate(NavRoutes.HOME) {
                            popUpTo(NavRoutes.PUBLICATION) {
                                inclusive = true
                            }
                        }
                    }
                }
                else showError("Ошибка заполнения полей", "Не все поля заполнены")
            }
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

}