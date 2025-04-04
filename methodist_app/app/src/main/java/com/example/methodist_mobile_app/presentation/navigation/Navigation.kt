package com.example.methodist_mobile_app.presentation.navigation

import androidx.compose.runtime.Composable
import androidx.compose.runtime.MutableState
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.example.methodist_mobile_app.presentation.screens.auth.login.Login
import com.example.methodist_mobile_app.presentation.screens.auth.register.Register
import com.example.methodist_mobile_app.presentation.screens.splash.Splash
import com.example.methodist_mobile_app.presentation.ui.theme.ThemeMode

@Composable
fun Navigation(currentThemeMode: MutableState<ThemeMode>) {
    val controller = rememberNavController()
    NavHost(
        startDestination = NavRoutes.LOGIN,
        navController = controller
    ) {
        composable(NavRoutes.SPLASH) {
            Splash(controller)
        }
        composable(NavRoutes.LOGIN) {
            Login(controller)
        }
        composable(NavRoutes.REGISTER) {
            Register(controller)
        }
        composable(NavRoutes.HOME) {
            //Home(controller)
        }
    }
}

