package com.example.methodist_mobile_app.presentation.screens.main.events.holding

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
class HoldingVM @Inject constructor(
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

    init {
        viewModelScope.launch {
            val response = service.getDefaultValue()
            if(response.error.isEmpty()) {
                updData(
                    dataSt.value.copy(
                        listStatus = response.listStatuses,
                        listResult = response.listResults,
                        listFormOfEvent = response.listEventsForms
                    )
                )
            }
        }
    }

    fun createEvent(controller: NavHostController) {
        viewModelScope.launch {
            with(dataSt.value.event) {
                if(name.trim().isNotEmpty() && formOfEvent.trim().isNotEmpty() && location.trim().isNotEmpty()
                    && status.trim().isNotEmpty() && result.trim().isNotEmpty()
                    && dateOfEvent.trim().isNotEmpty()) {
                    val dto = CreateEventDto(
                        name = name,
                        formOfEvent = formOfEvent,
                        location = location,
                        status = status,
                        result = result,
                        dateOfEvent = dateOfEvent,
                        endDateOfEvent = endDateOfEvent,
                        typeId = "ec2d1d7b-4cb7-41e1-aa80-74f695fea627"
                    )
                    var response = service.createEvent(dto)
                    if (response.error.isNotEmpty()) showError("Ошибка при создании мероприятия", response.error)
                    else {
                        response = service.uploadFiles(dataSt.value.uploadedFiles, response.event!!.id)
                        if(response.error.isNotEmpty()) showError("Ошибка при создании мероприятия", response.error)
                        else {
                            controller.navigate(NavRoutes.HOME) {
                                popUpTo(NavRoutes.INTERNSHIP) {
                                    inclusive = true
                                }
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