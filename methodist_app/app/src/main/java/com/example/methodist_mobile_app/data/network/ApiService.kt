package com.example.methodist_mobile_app.data.network

import com.example.methodist_mobile_app.data.dto.LoginDto
import com.example.methodist_mobile_app.data.dto.RegisterDto
import com.example.methodist_mobile_app.data.responses.GeneralResponse
import com.example.methodist_mobile_app.presentation.screens.auth.register.RegisterSt

/** Интерфейс, в котором описаны все методы для запросов к API и создаётся объект ApiServiceImpl */
interface ApiService {

    suspend fun signIn(email: String, password: String): GeneralResponse
    suspend fun signUp(dto: RegisterDto): GeneralResponse

}

