package com.example.methodist_mobile_app.presentation.screens.auth.login

import android.util.Log
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import androidx.navigation.NavController
import com.example.methodist_mobile_app.data.network.ApiServiceImpl
import com.example.methodist_mobile_app.presentation.navigation.NavRoutes
import com.example.methodist_mobile_app.presentation.screens.DialogSt
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class LoginVM @Inject constructor(
    private val service: ApiServiceImpl
): ViewModel() {

    //состояние данных на экране
    private val _dataSt = MutableStateFlow(LoginSt())
    val dataSt: StateFlow<LoginSt> = _dataSt.asStateFlow()

    fun updData(value: LoginSt) {
        _dataSt.value = value
    }

    //состояние диалогового окна ошибки
    private val _dialogSt = MutableStateFlow(DialogSt())
    val dialogSt: StateFlow<DialogSt> = _dialogSt.asStateFlow()

    fun updDialog(value: DialogSt) {
        _dialogSt.value = value
    }

    fun signIn(navController: NavController) {
        viewModelScope.launch {
            if(dataSt.value.email.isNotEmpty() && dataSt.value.password.isNotEmpty()) {
                Log.d("test", "${dataSt.value.email} ${dataSt.value.password}")
                val response = service.signIn(dataSt.value.email, dataSt.value.password)
                if(response.profileDto != null) {
                    /*PrefManager.act = 1
                    PrefManager.token = response.token
                    CurrentUser.token = response.token
                    Log.d("token", CurrentUser.token)*/
                    navController.navigate(NavRoutes.HOME){
                        popUpTo(NavRoutes.LOGIN) {
                            inclusive = true
                        }
                    }
                }
                if (response.error.isNotEmpty()) showError("Ошибка авторизации", response.error)
            }
            else showError("Ошибка заполнения данных", "Не все поля заполнены")
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

