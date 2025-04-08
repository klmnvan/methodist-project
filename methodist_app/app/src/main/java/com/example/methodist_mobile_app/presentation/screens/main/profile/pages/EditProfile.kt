package com.example.methodist_mobile_app.presentation.screens.main.profile.pages

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.example.methodist_mobile_app.data.network.HttpRoutes
import com.example.methodist_mobile_app.presentation.common.spacers.SpacerHeight
import com.example.methodist_mobile_app.presentation.common.textfields.TextFieldAuth
import com.example.methodist_mobile_app.presentation.screens.main.profile.ProfileVM
import com.example.methodist_mobile_app.presentation.screens.main.profile.components.ImageProfile
import com.example.methodist_mobile_app.presentation.screens.main.profile.components.TextMC
import com.example.methodist_mobile_app.presentation.screens.main.profile.state.ProfileSt
import com.example.methodist_mobile_app.presentation.ui.theme.MethodistTheme
import com.example.methodist_mobile_app.presentation.ui.theme.color
import com.example.methodist_mobile_app.presentation.ui.theme.typography

@Composable
fun EditProfile(vm: ProfileVM, stateData: ProfileSt) {
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
                    modifier = Modifier.align(Alignment.CenterEnd).clickable(
                        interactionSource = remember { MutableInteractionSource() },
                        indication = null
                    ) {
                        vm.saveProfile()
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
                ImageProfile("${HttpRoutes.BASE_URL_IMAGE}/${profile.imageUrl}")
                SpacerHeight(12.dp)
                Text(
                    "Изменить фотографию",
                    style = typography.textInFiled.color(MethodistTheme.colors.primary)
                        .copy(fontWeight = FontWeight.SemiBold, textAlign = TextAlign.Center)
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