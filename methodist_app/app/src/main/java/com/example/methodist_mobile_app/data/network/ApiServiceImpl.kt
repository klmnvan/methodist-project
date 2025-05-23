package com.example.methodist_mobile_app.data.network

import android.content.Context
import android.net.Uri
import android.util.Log
import com.example.methodist_mobile_app.data.dto.CreateEventDto
import com.example.methodist_mobile_app.data.dto.LoginDto
import com.example.methodist_mobile_app.data.dto.ProfileDto
import com.example.methodist_mobile_app.data.dto.RegisterDto
import com.example.methodist_mobile_app.data.dto.UpdateProfileDto
import com.example.methodist_mobile_app.data.responses.GeneralResponse
import com.example.methodist_mobile_app.data.models.EventModel
import com.example.methodist_mobile_app.data.models.ProfileModel
import com.example.methodist_mobile_app.data.room.database.MKDatabase
import com.example.methodist_mobile_app.domain.repository.UserRepository
import com.example.methodist_mobile_app.presentation.screens.main.events.participation.UiFile
import dagger.hilt.android.qualifiers.ApplicationContext
import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.plugins.ClientRequestException
import io.ktor.client.plugins.RedirectResponseException
import io.ktor.client.plugins.ServerResponseException
import io.ktor.client.request.forms.MultiPartFormDataContent
import io.ktor.client.request.forms.formData
import io.ktor.client.request.get
import io.ktor.client.request.patch
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.client.request.url
import io.ktor.http.ContentType
import io.ktor.http.Headers
import io.ktor.http.HttpHeaders
import io.ktor.http.contentType
import io.ktor.util.InternalAPI
import okhttp3.RequestBody
import java.io.ByteArrayOutputStream
import java.io.IOException

class ApiServiceImpl (
    private val client: HttpClient,
    private val database: MKDatabase,
    @ApplicationContext private val context: Context
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

    override suspend fun createEvent(event: CreateEventDto): GeneralResponse {
        return try {
            val response = client.post {
                url(HttpRoutes.CREATE_EVENT)
                setBody(event)
                contentType(ContentType.Application.Json)
                headers.append(HttpHeaders.Authorization, "Bearer ${UserRepository.token}")
            }
            GeneralResponse(event = response.body<EventModel>())
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

    override suspend fun uploadFiles(files: List<UiFile>, idEvent: String): GeneralResponse {
        return try {
            client.post {
                url(HttpRoutes.UPLOAD_FILES)
                setBody(
                    MultiPartFormDataContent(
                        formData {
                            files.forEachIndexed { index, uiFile ->
                                val bytes = getByteArrayFromUri(uiFile.uri)
                                append(
                                    key = "files",
                                    value = bytes,
                                    headers = Headers.build {
                                        append(
                                            HttpHeaders.ContentDisposition,
                                            "filename=\"${uiFile.name}\""
                                        )
                                        append(HttpHeaders.ContentType, getMimeType(uiFile.name))
                                    }
                                )
                            }
                        }
                    )
                )
                headers.append(HttpHeaders.Authorization, "Bearer ${UserRepository.token}")
                headers.append("idEvent", idEvent)
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

    override suspend fun getDefaultValue(): GeneralResponse {
        return try {
            val eventForms = client.get {
                url(HttpRoutes.GET_EVENT_FORMS)
                contentType(ContentType.Application.Json)
                headers.append(HttpHeaders.Authorization, "Bearer ${UserRepository.token}")
            }.body<List<String>>()
            val eventStatuses = client.get {
                url(HttpRoutes.GET_EVENT_STATUSES)
                contentType(ContentType.Application.Json)
                headers.append(HttpHeaders.Authorization, "Bearer ${UserRepository.token}")
            }.body<List<String>>()
            val eventResults = client.get {
                url(HttpRoutes.GET_EVENT_RESULTS)
                contentType(ContentType.Application.Json)
                headers.append(HttpHeaders.Authorization, "Bearer ${UserRepository.token}")
            }.body<List<String>>()
            val participationForms = client.get {
                url(HttpRoutes.GET_PARTICIPATION_FORMS)
                contentType(ContentType.Application.Json)
                headers.append(HttpHeaders.Authorization, "Bearer ${UserRepository.token}")
            }.body<List<String>>()
            GeneralResponse(listStatuses = eventStatuses, listResults = eventResults, listEventsForms = eventForms, listPartForms = participationForms)
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

    override suspend fun loadImg(imageBytes: ByteArray): GeneralResponse {
        return try {
            client.patch {
                url(HttpRoutes.UPLOAD_IMAGE)
                setBody(
                    MultiPartFormDataContent(
                        formData {
                            append(
                                key = "image",
                                value = imageBytes,
                                headers = Headers.build {
                                    append(
                                        HttpHeaders.ContentDisposition,
                                        "filename=\"image.jpg\""
                                    )
                                }
                            )
                        }
                    )
                )
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

    private fun getByteArrayFromUri(uri: Uri): ByteArray {
        val inputStream = context.contentResolver.openInputStream(uri)
        return inputStream?.use { it.readBytes() } ?: throw IOException("Не удалось прочитать файл")
    }

    private fun getMimeType(fileName: String): String {
        return when {
            fileName.endsWith(".jpg", ignoreCase = true) -> "image/jpeg"
            fileName.endsWith(".png", ignoreCase = true) -> "image/png"
            fileName.endsWith(".pdf", ignoreCase = true) -> "application/pdf"
            // Добавьте другие MIME-типы по необходимости
            else -> "application/octet-stream"
        }
    }

}