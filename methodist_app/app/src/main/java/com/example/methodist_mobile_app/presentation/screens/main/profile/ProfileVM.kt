package com.example.methodist_mobile_app.presentation.screens.main.profile

import android.content.Context
import android.content.Intent
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.net.Uri
import android.provider.MediaStore
import android.util.Base64
import android.util.Log
import androidx.compose.ui.graphics.ImageBitmap
import androidx.compose.ui.graphics.asAndroidBitmap
import androidx.compose.ui.graphics.asImageBitmap
import androidx.core.app.ActivityCompat.startActivityForResult
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import androidx.navigation.NavHostController
import com.example.methodist_mobile_app.data.dto.UpdateProfileDto
import com.example.methodist_mobile_app.data.network.ApiServiceImpl
import com.example.methodist_mobile_app.data.responses.GeneralResponse
import com.example.methodist_mobile_app.data.room.database.MKDatabase
import com.example.methodist_mobile_app.domain.repository.UserRepository
import com.example.methodist_mobile_app.presentation.navigation.NavRoutes
import com.example.methodist_mobile_app.presentation.screens.DialogSt
import com.example.methodist_mobile_app.presentation.screens.main.profile.state.ProfileSt
import com.example.methodist_mobile_app.presentation.screens.main.profile.state.ProfileUISt
import dagger.hilt.android.lifecycle.HiltViewModel
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import okhttp3.MediaType
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.RequestBody
import okhttp3.RequestBody.Companion.toRequestBody
import java.io.ByteArrayOutputStream
import javax.inject.Inject

@HiltViewModel
class ProfileVM @Inject constructor (
    private val service: ApiServiceImpl,
    private val database: MKDatabase,
    @ApplicationContext private val context: Context
) : ViewModel() {

    //состояние данных на экране
    private val _dataSt = MutableStateFlow(ProfileSt())
    val dataSt: StateFlow<ProfileSt> = _dataSt.asStateFlow()

    fun updData(value: ProfileSt) {
        _dataSt.value = value
    }

    //состояние диалогового окна ошибки
    private val _dialogSt = MutableStateFlow(DialogSt())
    val dialogSt: StateFlow<DialogSt> = _dialogSt.asStateFlow()

    fun updDialog(value: DialogSt) {
        _dialogSt.value = value
    }

    //состояние экрана (просмотр и редактирование)
    private val _uiSt: MutableStateFlow<ProfileUISt> = MutableStateFlow(ProfileUISt.Show)
    val uiSt: StateFlow<ProfileUISt> = _uiSt.asStateFlow()

    fun updUi(value: ProfileUISt) {
        _uiSt.value = value
    }

    init {
        updateValues()
        fetch()
    }

    fun updateValues() {
        viewModelScope.launch(Dispatchers.IO) {
            Log.e("id", UserRepository.profileId)
            database.profileDao.getById(UserRepository.profileId).collect {
                Log.e("Профиль в БД", it.toString())
                if(it.isNotEmpty())
                updData(
                    dataSt.value.copy(profile = it.last())
                )
            }
        }

    }

    fun fetch() {
        viewModelScope.launch {
            val response = service.getProfile(profileId = UserRepository.profileId)
            if(response.profile != null) {
                updData(
                    dataSt.value.copy(profile = dataSt.value.profile.copy(imageUrl = ""))
                )
                updData(
                    dataSt.value.copy(profile = response.profile)
                )
                updateValues()
            }
            if (response.error.isNotEmpty()) showError("Ошибка синхронизации", response.error)
        }
    }

    fun logOut(controller: NavHostController) {
        UserRepository.act = 1
        UserRepository.profileId = ""
        UserRepository.token = ""
        database.eventDao.deleteAll()
        database.mkDao.deleteAll()
        database.profileDao.deleteAll()
        database.typeOfEventDao.deleteAll()
        controller.navigate(NavRoutes.LOGIN) {
            popUpTo(NavRoutes.PROFILE) {
                inclusive = true
            }
        }
    }

    fun switchToEditState() {
        updUi(ProfileUISt.Edit)
        updData(
            dataSt.value.copy(newProfile = dataSt.value.profile)
        )
    }

    fun saveProfile(uri: Uri?) {
        viewModelScope.launch {
            with(dataSt.value.newProfile) {
                if(lastName.isNotEmpty() && firstName.isNotEmpty()) {
                    var response = service.updateProfile(
                        UpdateProfileDto(
                            lastName = lastName,
                            firstName = firstName,
                            patronymic = patronymic,
                        )
                    )
                    if (response.error.isNotEmpty()) showError("Ошибка изменения профиля", response.error)
                    else {
                        if(uri != null) {
                            val imageBytes: ByteArray? = uri.toByteArray(context)
                            if(imageBytes != null) {
                                response = service.loadImg(imageBytes)
                                if (response.error != "") showError("Ошибка загрузки фото", response.error)
                            }
                            else showError("Ошибка", "Ошибка преобразования Uri в массив байт")
                        }
                        fetch()
                        updUi(ProfileUISt.Show)
                    }
                }
                else showError("Ошибка заполнения полей", "Поля с фамилией и именем должны быть обязательно заполнены")
            }
        }
    }

    private fun showError(title: String, desc: String) {
        Log.d("events", "$title $desc")
        updDialog(dialogSt.value.copy(
            dialogIsOpen = true,
            title = title,
            description = desc)
        )
    }

    private fun Uri.toByteArray(context: Context): ByteArray? {
        return try {
            val inputStream = context.contentResolver.openInputStream(this)
            val byteArrayOutputStream = ByteArrayOutputStream()
            inputStream?.use { stream ->
                byteArrayOutputStream.use { output ->
                    stream.copyTo(output)
                }
            }
            byteArrayOutputStream.toByteArray()
        } catch (e: Exception) {
            e.printStackTrace()
            null
        }
    }

}

