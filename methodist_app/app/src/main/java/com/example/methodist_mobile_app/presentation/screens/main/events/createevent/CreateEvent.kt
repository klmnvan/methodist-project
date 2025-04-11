package com.example.methodist_mobile_app.presentation.screens.main.events.createevent

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.navigation.NavHostController
import com.example.methodist_mobile_app.R
import com.example.methodist_mobile_app.presentation.common.spacers.SpacerHeight
import com.example.methodist_mobile_app.presentation.navigation.NavRoutes
import com.example.methodist_mobile_app.presentation.screens.main.events.components.ItemCategory
import com.example.methodist_mobile_app.presentation.ui.theme.MethodistTheme.colors
import com.example.methodist_mobile_app.presentation.ui.theme.color
import com.example.methodist_mobile_app.presentation.ui.theme.typography

@Composable
fun CreateEvent(controller: NavHostController) {

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(colors.background)
            .verticalScroll(rememberScrollState())
            .padding(vertical = 40.dp, horizontal = 20.dp)
    ) {
        Text("Создание формы мероприятия", style = typography.titleAuth.color(colors.title))
        SpacerHeight(20.dp)
        Text(
            text = "Одно заполнение формы отражает одно мероприятие.\n" +
                "Если Вы проводили/принимали участие в нескольких мероприятиях, то необходимо отправить данные несколько раз.",
            style = typography.descriptionAuth.color(colors.description)
        )
        SpacerHeight(20.dp)
        Text("Форма работы", style = typography.titleMain.color(colors.title))
        SpacerHeight(12.dp)
        Row(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
            ItemCategory(R.drawable.icon_typework1, "ПРОВЕДЕНИЕ МЕРОПРИЯТИЯ") {
                controller.navigate(NavRoutes.HOLDING)
            }
            ItemCategory(R.drawable.icon_typework2, "УЧАСТИЕ В МЕРОПРИЯТИИ") {
                controller.navigate(NavRoutes.PARTICIPATION)
            }
        }
        SpacerHeight(16.dp)
        Row(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
            ItemCategory(R.drawable.icon_typework3, "ПУБЛИКАЦИЯ") {
                controller.navigate(NavRoutes.PUBLICATION)
            }
            ItemCategory(R.drawable.icon_typework4, "СТАЖИРОВКА") {
                controller.navigate(NavRoutes.INTERNSHIP)
            }
        }
    }

}

