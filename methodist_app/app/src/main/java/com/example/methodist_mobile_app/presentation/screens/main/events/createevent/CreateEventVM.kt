package com.example.methodist_mobile_app.presentation.screens.main.events.createevent

import androidx.lifecycle.ViewModel
import com.example.methodist_mobile_app.data.network.ApiServiceImpl
import com.example.methodist_mobile_app.data.room.database.MKDatabase
import com.example.methodist_mobile_app.presentation.screens.DialogSt
import com.example.methodist_mobile_app.presentation.screens.main.home.state.HomeSt
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import javax.inject.Inject

@HiltViewModel
class CreateEventVM @Inject constructor(
    private val service: ApiServiceImpl,
    private val database: MKDatabase
) : ViewModel() {

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
}