package com.example.methodist_mobile_app.data.network

import android.util.Log
import com.example.methodist_mobile_app.data.dto.LoginDto
import com.example.methodist_mobile_app.data.dto.ProfileDto
import com.example.methodist_mobile_app.data.dto.RegisterDto
import com.example.methodist_mobile_app.data.responses.GeneralResponse
import com.example.methodist_mobile_app.presentation.screens.auth.register.RegisterSt
import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.plugins.ClientRequestException
import io.ktor.client.plugins.RedirectResponseException
import io.ktor.client.plugins.ServerResponseException
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.client.request.url
import io.ktor.http.ContentType
import io.ktor.http.contentType

class ApiServiceImpl (private val client: HttpClient): ApiService {

    override suspend fun signIn(email: String, password: String): GeneralResponse {
        return try {
            val response = client.post {
                url(HttpRoutes.LOGIN)
                setBody(LoginDto(email, email, password))
                contentType(ContentType.Application.Json)
            }
            val body = response.body<ProfileDto>()
            GeneralResponse(profileDto = body)
        } catch (e: RedirectResponseException) {
            Log.d("Error ${e.response.status.value}", e.message)
            return GeneralResponse(error = "Ошибка ${e.response.status.value}")
        } catch (e: ClientRequestException) {
            if(e.response.body<String>().contains("Неверный пароль")) {
                return GeneralResponse(error = "Неверный пароль")
            }
            if(e.response.body<String>().contains("Такого пользователя нет в базе")) {
                return GeneralResponse(error = "Неверная почта")
            }
            Log.d("Error ${e.response.status.value}", e.message)
            GeneralResponse(error = "Ошибка ${e.response.status.value}")
        } catch (e: ServerResponseException) {
            Log.d("Error ${e.response.status.value}", e.message)
            GeneralResponse(error = "Ошибка сервера")
        } catch (e: Exception) {
            println("Error: ${e.message}")
            GeneralResponse(error = e.message.toString())
        }
    }

    override suspend fun signUp(dto: RegisterDto): GeneralResponse {
        return try {
            val response = client.post {
                url(HttpRoutes.REGISTER)
                setBody(dto)
                contentType(ContentType.Application.Json)
            }
            val body = response.body<ProfileDto>()
            GeneralResponse(profileDto = body)
        } catch (e: RedirectResponseException) {
            Log.d("Error ${e.response.status.value}", e.message)
            return GeneralResponse(error = "Ошибка ${e.response.status.value}")
        } catch (e: ClientRequestException) {
            if(e.response.body<String>().contains("Такой пользователь уже есть")){
                return GeneralResponse(error = "Почта уже зарегистрирована")
            }
            Log.d("Error ${e.response.status.value}", e.message)
            GeneralResponse(error = "Ошибка ${e.response.status.value}")
        } catch (e: ServerResponseException) {
            Log.d("Error ${e.response.status.value}", e.message)
            GeneralResponse(error = "Ошибка сервера")
        } catch (e: Exception) {
            println("Error: ${e.message}")
            GeneralResponse(error = e.message.toString())
        }
    }

}