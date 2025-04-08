package com.example.methodist_mobile_app.presentation.screens.main.profile.pages

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.MutableState
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavHostController
import com.example.methodist_mobile_app.data.network.HttpRoutes
import com.example.methodist_mobile_app.presentation.common.buttons.ButtonMaxWidth
import com.example.methodist_mobile_app.presentation.common.spacers.SpacerHeight
import com.example.methodist_mobile_app.presentation.screens.main.profile.ProfileVM
import com.example.methodist_mobile_app.presentation.screens.main.profile.components.ButtonChangeProfile
import com.example.methodist_mobile_app.presentation.screens.main.profile.components.ImageProfile
import com.example.methodist_mobile_app.presentation.screens.main.profile.components.RowChangeTheme
import com.example.methodist_mobile_app.presentation.screens.main.profile.state.ProfileSt
import com.example.methodist_mobile_app.presentation.ui.theme.MethodistTheme
import com.example.methodist_mobile_app.presentation.ui.theme.ThemeMode
import com.example.methodist_mobile_app.presentation.ui.theme.color
import com.example.methodist_mobile_app.presentation.ui.theme.typography

@Composable
fun ShowProfile(controller: NavHostController, currentThemeMode: MutableState<ThemeMode>, vm: ProfileVM, stateData: ProfileSt) {
    with(stateData) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(MethodistTheme.colors.background)
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 20.dp, vertical = 40.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                "Профиль",
                style = typography.titleProfile.color(
                    MethodistTheme.colors.title
                ).copy(textAlign = TextAlign.Center)
            )
            SpacerHeight(24.dp)
            ImageProfile("${HttpRoutes.BASE_URL_IMAGE}/${stateData.profile.imageUrl}")
            SpacerHeight(12.dp)
            Text(
                text = "${profile.lastName} ${profile.firstName} ${profile.patronymic}",
                style = typography.titleProfile.color(
                    MethodistTheme.colors.title
                ).copy(
                    fontSize = 20.sp,
                    textAlign = TextAlign.Center
                )
            )
            SpacerHeight(4.dp)
            Text(
                text = buildAnnotatedString {
                    append(profile.email)
                    if (profile.roles != null)
                        if (profile.roles!!.isNotEmpty())
                            append(" | " + profile.roles!!.first())
                },
                modifier = Modifier.fillMaxWidth(),
                textAlign = TextAlign.Center,
                style = typography.textInFiled.color(
                    MethodistTheme.colors.hint
                )
            )
            SpacerHeight(4.dp)
            Text(
                profile.mc?.name ?: "",
                style = typography.textInFiled.color(
                    MethodistTheme.colors.primary
                ).copy(
                    fontWeight = FontWeight.SemiBold,
                    textAlign = TextAlign.Center
                )
            )
            SpacerHeight(40.dp)
            ButtonChangeProfile("Изменить профиль") {
                vm.switchToEditState()
            }
            SpacerHeight(20.dp)
            Text(
                text = "Тема приложения",
                style = typography.titleMain.color(
                    MethodistTheme.colors.title
                ),
                modifier = Modifier.fillMaxWidth()
            )
            SpacerHeight(8.dp)
            RowChangeTheme(currentThemeMode)
            Spacer(modifier = Modifier.weight(1f))
            ButtonMaxWidth(
                "Выйти",
                true,
                MethodistTheme.colors.error
            ) {
                vm.logOut(controller)
            }
            SpacerHeight(120.dp)
        }
    }
}