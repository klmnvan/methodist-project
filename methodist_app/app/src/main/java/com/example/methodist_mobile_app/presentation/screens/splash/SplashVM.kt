package com.example.methodist_mobile_app.presentation.screens.splash

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import androidx.navigation.NavHostController
import com.example.methodist_mobile_app.domain.repository.UserRepository
import com.example.methodist_mobile_app.presentation.navigation.NavRoutes
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class SplashVM @Inject constructor(): ViewModel() {

    fun launch(controller: NavHostController) {
        viewModelScope.launch {
            delay(3000L)
            when(UserRepository.act) {
                1 -> {
                    controller.navigate(NavRoutes.LOGIN) {
                        popUpTo(NavRoutes.SPLASH) {
                            inclusive = true
                        }
                    }
                }
                2 -> {
                    controller.navigate(NavRoutes.HOME) {
                        popUpTo(NavRoutes.SPLASH) {
                            inclusive = true
                        }
                    }
                }
            }

        }
    }

}

