package com.example.methodist_mobile_app.presentation.navigation.bottombar

import com.example.methodist_mobile_app.R
import com.example.methodist_mobile_app.presentation.navigation.NavRoutes

sealed class DestinationsBottomBar(
    val route: String,
    val title: String,
    val resourceId: Int? = null
) {
    object HomeScreen : DestinationsBottomBar(
        route = NavRoutes.HOME,
        title = "Мероприятия",
        resourceId = R.drawable.icon_form
    )

    object CreateEventScreen : DestinationsBottomBar(
        route = NavRoutes.CREATE_EVENT,
        title = "",
        resourceId = R.drawable.button_create_event
    )

    object ProfileScreen : DestinationsBottomBar(
        route = NavRoutes.PROFILE,
        title = "Профиль",
        resourceId = R.drawable.icon_profile
    )


}

