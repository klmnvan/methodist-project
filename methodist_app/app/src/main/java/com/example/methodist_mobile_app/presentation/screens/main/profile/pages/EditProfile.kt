package com.example.methodist_mobile_app.presentation.screens.main.profile.pages

import android.graphics.Bitmap
import android.graphics.ImageDecoder
import android.net.Uri
import android.os.Build
import android.provider.MediaStore
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.MutableState
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.navigation.NavHostController
import com.example.methodist_mobile_app.data.network.HttpRoutes
import com.example.methodist_mobile_app.presentation.common.spacers.SpacerHeight
import com.example.methodist_mobile_app.presentation.common.textfields.TextFieldAuth
import com.example.methodist_mobile_app.presentation.navigation.NavRoutes
import com.example.methodist_mobile_app.presentation.screens.main.profile.ProfileVM
import com.example.methodist_mobile_app.presentation.screens.main.profile.components.ImageProfile
import com.example.methodist_mobile_app.presentation.screens.main.profile.components.TextMC
import com.example.methodist_mobile_app.presentation.screens.main.profile.state.ProfileSt
import com.example.methodist_mobile_app.presentation.screens.main.profile.state.ProfileUISt
import com.example.methodist_mobile_app.presentation.ui.theme.MethodistTheme
import com.example.methodist_mobile_app.presentation.ui.theme.color
import com.example.methodist_mobile_app.presentation.ui.theme.typography

@Composable
fun EditProfile(controller: NavHostController, vm: ProfileVM, stateData: ProfileSt) {

    val context = LocalContext.current
    val imageData: MutableState<Uri?> = remember { mutableStateOf(null) }
    val bitmap: MutableState<Bitmap?> = remember { mutableStateOf(null) }
    val launcher = rememberLauncherForActivityResult(ActivityResultContracts.GetContent()) { imageData.value = it }

    with(stateData) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(MethodistTheme.colors.background)
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 20.dp, vertical = 40.dp)
        ) {
            Box(modifier = Modifier.fillMaxWidth()) {
                Text(
                    "Сохранить",
                    style = typography.textButton.color(MethodistTheme.colors.primary),
                    modifier = Modifier
                        .align(Alignment.CenterEnd)
                        .clickable(
                            interactionSource = remember { MutableInteractionSource() },
                            indication = null
                        ) {
                            vm.saveProfile(imageData.value)
                        }
                )
                Text(
                    "Назад",
                    style = typography.textButton.color(MethodistTheme.colors.primary),
                    modifier = Modifier
                        .align(Alignment.CenterStart)
                        .clickable(
                            interactionSource = remember { MutableInteractionSource() },
                            indication = null
                        ) {
                            vm.updUi(ProfileUISt.Show)
                        }
                )
                Text(
                    "Профиль",
                    style = typography.titleProfile.color(MethodistTheme.colors.title),
                    modifier = Modifier.align(Alignment.Center)
                )
            }
            SpacerHeight(24.dp)
            Column(
                modifier = Modifier.fillMaxWidth(),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {

                imageData.let {
                    val uri = it.value
                    if (uri != null) {
                        if (Build.VERSION.SDK_INT < 28) {
                            bitmap.value = MediaStore.Images
                                .Media.getBitmap(context.contentResolver, uri)

                        } else {
                            val source = ImageDecoder
                                .createSource(context.contentResolver, uri)
                            bitmap.value = ImageDecoder.decodeBitmap(source)
                        }
                    }
                }

                if(bitmap.value != null) {
                    Image(
                        modifier = Modifier
                            .clip(CircleShape)
                            .size(120.dp),
                        bitmap = bitmap.value!!.asImageBitmap(),
                        contentDescription = "",
                        contentScale = ContentScale.Crop
                    )
                }
                else {
                    ImageProfile("${HttpRoutes.BASE_URL_IMAGE}/${profile.imageUrl}")
                }

                SpacerHeight(12.dp)
                Text(
                    "Изменить фотографию",
                    style = typography.textInFiled.color(MethodistTheme.colors.primary)
                        .copy(fontWeight = FontWeight.SemiBold, textAlign = TextAlign.Center),
                    modifier = Modifier.clickable(
                        interactionSource = remember { MutableInteractionSource() },
                        indication = null
                    ) {
                        launcher.launch(
                            "image/*"
                        )
                    }
                )
            }
            SpacerHeight(20.dp)
            Text(text = "Фамилия", style = typography.titleMain.color(MethodistTheme.colors.title))
            SpacerHeight(12.dp)
            TextFieldAuth(newProfile.lastName, "Иванов") {
                vm.updData(copy(newProfile = newProfile.copy(lastName = it)))
            }
            SpacerHeight(16.dp)
            Text(text = "Имя", style = typography.titleMain.color(MethodistTheme.colors.title))
            SpacerHeight(12.dp)
            TextFieldAuth(newProfile.firstName, "Иван") {
                vm.updData(copy(newProfile = newProfile.copy(firstName = it)))
            }
            SpacerHeight(16.dp)
            Text(text = "Отчество", style = typography.titleMain.color(MethodistTheme.colors.title))
            SpacerHeight(12.dp)
            TextFieldAuth(newProfile.patronymic, "Иванович") {
                vm.updData(copy(newProfile = newProfile.copy(patronymic = it)))
            }
            SpacerHeight(16.dp)
            Text(
                text = "Методическая комиссия",
                style = typography.titleMain.color(MethodistTheme.colors.title)
            )
            SpacerHeight(12.dp)
            TextMC(newProfile.mc?.name ?: "Не указано")
        }
    }
}