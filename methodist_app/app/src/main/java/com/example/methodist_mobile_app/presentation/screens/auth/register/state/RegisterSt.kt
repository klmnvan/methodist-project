package com.example.methodist_mobile_app.presentation.screens.auth.register.state

import kotlinx.serialization.Serializable

@Serializable
data class RegisterSt(
    var confirmPassword: String = "12345678",
    var email: String = "user@mail.ru",
    var firstName: String = "1",
    var lastName: String = "1",
    var patronymic: String = "1",
    var password: String = "12345678",
)