package com.example.methodist_mobile_app.data.network

import android.net.Uri
import com.example.methodist_mobile_app.data.dto.CreateEventDto
import com.example.methodist_mobile_app.data.dto.RegisterDto
import com.example.methodist_mobile_app.data.dto.UpdateProfileDto
import com.example.methodist_mobile_app.data.responses.GeneralResponse
import com.example.methodist_mobile_app.presentation.screens.main.events.participation.UiFile

/** Интерфейс, в котором описаны все методы для запросов к API и создаётся объект ApiServiceImpl */
interface ApiService {

    suspend fun signIn(email: String, password: String): GeneralResponse
    suspend fun signUp(dto: RegisterDto): GeneralResponse
    suspend fun getEvents(profileId: String): GeneralResponse
    suspend fun createEvent(event: CreateEventDto): GeneralResponse
    suspend fun getProfile(profileId: String): GeneralResponse
    suspend fun updateProfile(dto: UpdateProfileDto): GeneralResponse
    suspend fun getDefaultValue(): GeneralResponse
    suspend fun loadImg(imageBytes: ByteArray): GeneralResponse
    suspend fun uploadFiles(files: List<UiFile>, idEvent: String): GeneralResponse

}

