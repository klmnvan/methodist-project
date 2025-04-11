package com.example.methodist_mobile_app.presentation.navigation

import androidx.compose.runtime.Composable
import androidx.compose.runtime.MutableState
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import com.example.methodist_mobile_app.presentation.screens.auth.login.Login
import com.example.methodist_mobile_app.presentation.screens.auth.register.Register
import com.example.methodist_mobile_app.presentation.screens.main.events.createevent.CreateEvent
import com.example.methodist_mobile_app.presentation.screens.main.events.holding.Holding
import com.example.methodist_mobile_app.presentation.screens.main.events.internship.Internship
import com.example.methodist_mobile_app.presentation.screens.main.events.participation.Participation
import com.example.methodist_mobile_app.presentation.screens.main.events.publication.Publication
import com.example.methodist_mobile_app.presentation.screens.main.home.Home
import com.example.methodist_mobile_app.presentation.screens.main.profile.Profile
import com.example.methodist_mobile_app.presentation.screens.splash.Splash
import com.example.methodist_mobile_app.presentation.ui.theme.ThemeMode

@Composable
fun Navigation(controller: NavHostController, currentThemeMode: MutableState<ThemeMode>, bottomBarIsVisible: MutableState<Boolean>) {
    NavHost(
        startDestination = NavRoutes.SPLASH,
        navController = controller
    ) {
        composable(NavRoutes.SPLASH) {
            Splash(controller)
        }
        composable(NavRoutes.LOGIN) {
            bottomBarIsVisible.value = false
            Login(controller)
        }
        composable(NavRoutes.REGISTER) {
            Register(controller)
        }
        composable(NavRoutes.HOME) {
            bottomBarIsVisible.value = true
            Home(controller)
        }
        composable(NavRoutes.PROFILE) {
            Profile(controller, currentThemeMode)
        }
        composable(NavRoutes.CREATE_EVENT) {
            CreateEvent(controller)
        }
        composable(NavRoutes.INTERNSHIP) {
            Internship(controller)
        }
        composable(NavRoutes.PUBLICATION) {
            Publication(controller)
        }
        composable(NavRoutes.HOLDING) {
            Holding(controller)
        }
        composable(NavRoutes.PARTICIPATION) {
            Participation(controller)
        }
    }
}

