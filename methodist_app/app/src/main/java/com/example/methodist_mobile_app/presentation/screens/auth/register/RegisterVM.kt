package com.example.methodist_mobile_app.presentation.screens.auth.register

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import androidx.navigation.NavController
import com.example.methodist_mobile_app.data.dto.RegisterDto
import com.example.methodist_mobile_app.data.network.ApiServiceImpl
import com.example.methodist_mobile_app.presentation.navigation.NavRoutes
import com.example.methodist_mobile_app.presentation.screens.DialogSt
import com.example.methodist_mobile_app.presentation.screens.auth.register.state.RegisterSt
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject


@HiltViewModel
class RegisterVM @Inject constructor(
    private val service: ApiServiceImpl
): ViewModel() {

    //состояние данных на экране
    private val _dataSt = MutableStateFlow(RegisterSt())
    val dataSt: StateFlow<RegisterSt> = _dataSt.asStateFlow()

    fun updData(value: RegisterSt) {
        _dataSt.value = value
    }

    //состояние диалогового окна ошибки
    private val _dialogSt = MutableStateFlow(DialogSt())
    val dialogSt: StateFlow<DialogSt> = _dialogSt.asStateFlow()

    fun updDialog(value: DialogSt) {
        _dialogSt.value = value
    }

    fun signUp(navController: NavController) {
        viewModelScope.launch {
            if(dataSt.value.lastName.isNotEmpty() && dataSt.value.firstName.isNotEmpty() &&
                dataSt.value.patronymic.isNotEmpty() && dataSt.value.email.isNotEmpty() &&
                dataSt.value.password.isNotEmpty() && dataSt.value.confirmPassword.isNotEmpty()) {
                if(dataSt.value.password == dataSt.value.confirmPassword) {
                    val dto = RegisterDto(
                        email = dataSt.value.email,
                        firstName = dataSt.value.firstName,
                        lastName = dataSt.value.lastName,
                        patronymic = dataSt.value.patronymic,
                        password = dataSt.value.password,
                        confirmPassword = dataSt.value.confirmPassword,
                    )
                    val response = service.signUp(dto)
                    if(response.profileDto != null) {
                        navController.navigate(NavRoutes.LOGIN) {
                            popUpTo(NavRoutes.REGISTER) {
                                inclusive = true
                            }
                        }
                    }
                    if (response.error.isNotEmpty()) showError("Ошибка при регистрации", response.error)
                } else showError("Ошибка заполнения данных", "Пароли не совпадают")
            } else showError("Ошибка заполнения данных", "Не все поля заполнены")
        }
    }

    private fun showError(title: String, desc: String) {
        updDialog(dialogSt.value.copy(
            dialogIsOpen = true,
            title = title,
            description = desc)
        )
    }

}