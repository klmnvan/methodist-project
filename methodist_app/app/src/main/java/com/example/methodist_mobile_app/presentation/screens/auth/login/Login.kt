package com.example.methodist_mobile_app.presentation.screens.auth.login

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavHostController
import com.example.methodist_mobile_app.presentation.common.buttons.ButtonMaxWidth
import com.example.methodist_mobile_app.presentation.common.dialogs.DialogError
import com.example.methodist_mobile_app.presentation.common.spacers.SpacerHeight
import com.example.methodist_mobile_app.presentation.common.textfields.TextFieldAuth
import com.example.methodist_mobile_app.presentation.navigation.NavRoutes
import com.example.methodist_mobile_app.presentation.ui.theme.MethodistTheme.colors
import com.example.methodist_mobile_app.presentation.ui.theme.color
import com.example.methodist_mobile_app.presentation.ui.theme.typography

@Composable
fun Login(controller: NavHostController, vm: LoginVM = hiltViewModel()) {

    val stateData = vm.dataSt.collectAsState().value
    val stateDialog = vm.dialogSt.collectAsState().value

    if(stateDialog.dialogIsOpen) {
        DialogError(stateDialog.title, stateDialog.description) {
            vm.updDialog(stateDialog.copy(dialogIsOpen = false))
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(colors.background)
            .verticalScroll(rememberScrollState())
            .padding(horizontal = 20.dp, vertical = 25.dp),
        verticalArrangement = Arrangement.Center
    ) {
        Text("Авторизация", style = typography.titleAuth.color(colors.title))
        SpacerHeight(8.dp)
        Text("Войдите, чтобы пользоваться функциями приложения", style = typography.descriptionAuth.color(colors.description))
        SpacerHeight(30.dp)
        Text("Адрес эл. почты", style = typography.descriptionAuth.color(colors.title))
        SpacerHeight(12.dp)
        TextFieldAuth(stateData.email, "user@mail.ru") {
            vm.updData(stateData.copy(email = it))
        }
        SpacerHeight(20.dp)
        Text("Пароль", style = typography.descriptionAuth.color(colors.title))
        SpacerHeight(12.dp)
        TextFieldAuth(stateData.password, "*********") {
            vm.updData(stateData.copy(password = it))
        }
        SpacerHeight(40.dp)
        ButtonMaxWidth("Далее", stateData.email.isNotEmpty() && stateData.password.isNotEmpty(), colors.primary) {
            vm.signIn(controller)
        }
        SpacerHeight(12.dp)
        Text(
            text = buildAnnotatedString {
                withStyle(SpanStyle(color = colors.description)) {
                    append("Ещё нет аккаута? ")
                }
                withStyle(SpanStyle(color = colors.primary, fontWeight = FontWeight.Bold)) {
                    append("Зарегистрируйтесь!")
                }
            },
            modifier = Modifier
                .fillMaxWidth()
                .clickable {
                    controller.navigate(NavRoutes.REGISTER)
                },
            textAlign = TextAlign.Center,
            style = typography.descriptionAuth
        )

    }

}