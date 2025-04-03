package com.example.methodist_mobile_app.presentation.navigation

import androidx.compose.runtime.Composable
import androidx.compose.runtime.MutableState
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.example.methodist_mobile_app.presentation.ui.theme.ThemeMode

@Composable
fun Navigation(currentThemeMode: MutableState<ThemeMode>) {
    val controller = rememberNavController()
    NavHost(
        startDestination = NavRoutes.SPLASH,
        navController = controller
    ) {
        composable(NavRoutes.SPLASH) {

        }
        composable(NavRoutes.LOGIN) {

        }
        composable(NavRoutes.REGISTER) {

        }
    }
}

