package com.example.methodist_mobile_app.data.network

import com.example.methodist_mobile_app.data.dto.ProfileDto
import com.example.methodist_mobile_app.data.dto.RegisterDto
import com.example.methodist_mobile_app.data.dto.UpdateProfileDto
import com.example.methodist_mobile_app.data.responses.GeneralResponse

/** Интерфейс, в котором описаны все методы для запросов к API и создаётся объект ApiServiceImpl */
interface ApiService {

    suspend fun signIn(email: String, password: String): GeneralResponse
    suspend fun signUp(dto: RegisterDto): GeneralResponse
    suspend fun getEvents(profileId: String): GeneralResponse
    suspend fun getProfile(profileId: String): GeneralResponse
    suspend fun updateProfile(dto: UpdateProfileDto): GeneralResponse

}

