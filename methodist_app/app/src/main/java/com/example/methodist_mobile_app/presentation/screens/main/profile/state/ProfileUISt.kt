package com.example.methodist_mobile_app.presentation.screens.main.profile.state

sealed class ProfileUISt(title: String) {
    data object Show : ProfileUISt("Show")
    data object Edit : ProfileUISt("Edit")
}