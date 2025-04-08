package com.example.methodist_mobile_app.data.network

import android.util.Log
import com.example.methodist_mobile_app.data.dto.LoginDto
import com.example.methodist_mobile_app.data.dto.ProfileDto
import com.example.methodist_mobile_app.data.dto.RegisterDto
import com.example.methodist_mobile_app.data.dto.UpdateProfileDto
import com.example.methodist_mobile_app.data.responses.GeneralResponse
import com.example.methodist_mobile_app.data.models.EventModel
import com.example.methodist_mobile_app.data.models.ProfileModel
import com.example.methodist_mobile_app.data.room.database.MKDatabase
import com.example.methodist_mobile_app.domain.repository.UserRepository
import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.plugins.ClientRequestException
import io.ktor.client.plugins.RedirectResponseException
import io.ktor.client.plugins.ServerResponseException
import io.ktor.client.request.get
import io.ktor.client.request.patch
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.client.request.url
import io.ktor.http.ContentType
import io.ktor.http.HttpHeaders
import io.ktor.http.contentType

class ApiServiceImpl (
    private val client: HttpClient,
    private val database: MKDatabase
): ApiService {

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

    override suspend fun getEvents(profileId: String): GeneralResponse {
        return try {
            val response = client.get {
                url(HttpRoutes.GET_EVENTS)
                contentType(ContentType.Application.Json)
                headers.append(HttpHeaders.Authorization, "Bearer ${UserRepository.token}")
            }
            val body = response.body<List<EventModel>>()

            database.eventDao.deleteAll()
            database.eventDao.insert(body)

            val typeOfEvents = body.map { it.typeOfEvent }
            database.typeOfEventDao.deleteAll()
            database.typeOfEventDao.insert(typeOfEvents)

            GeneralResponse(listEvent = body)
        } catch (e: RedirectResponseException) {
            Log.d("Error ${e.response.status.value}", e.message)
            return GeneralResponse(error = "Ошибка ${e.response.status.value}")
        } catch (e: ClientRequestException) {
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

    override suspend fun getProfile(profileId: String): GeneralResponse {
        return try {
            val response = client.get {
                url(HttpRoutes.GET_PROFILE)
                contentType(ContentType.Application.Json)
                headers.append(HttpHeaders.Authorization, "Bearer ${UserRepository.token}")
            }
            val body = response.body<ProfileModel>()
            database.profileDao.deleteAll()
            database.profileDao.insert(body)
            if(body.mc != null) {
                database.mkDao.deleteAll()
                database.mkDao.insert(body.mc!!)
            }
            GeneralResponse(profile = body)
        } catch (e: RedirectResponseException) {
            Log.d("Error ${e.response.status.value}", e.message)
            return GeneralResponse(error = "Ошибка ${e.response.status.value}")
        } catch (e: ClientRequestException) {
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

    override suspend fun updateProfile(dto: UpdateProfileDto): GeneralResponse {
        return try {
            client.patch {
                url(HttpRoutes.UPDATE_PROFILE)
                contentType(ContentType.Application.Json)
                setBody(dto)
                headers.append(HttpHeaders.Authorization, "Bearer ${UserRepository.token}")
            }
            GeneralResponse()
        } catch (e: RedirectResponseException) {
            Log.d("Error ${e.response.status.value}", e.message)
            return GeneralResponse(error = "Ошибка ${e.response.status.value}")
        } catch (e: ClientRequestException) {
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