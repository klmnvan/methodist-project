package com.example.methodist_mobile_app.presentation.screens.main.home

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.IntrinsicSize
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Divider
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.res.vectorResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Dialog
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavHostController
import com.example.methodist_mobile_app.R
import com.example.methodist_mobile_app.data.models.EventModel
import com.example.methodist_mobile_app.presentation.common.dialogs.DialogError
import com.example.methodist_mobile_app.presentation.common.spacers.SpacerHeight
import com.example.methodist_mobile_app.presentation.common.spacers.SpacerWidth
import com.example.methodist_mobile_app.presentation.screens.main.home.components.ButtonFilter
import com.example.methodist_mobile_app.presentation.screens.main.home.components.Filters
import com.example.methodist_mobile_app.presentation.screens.main.home.components.GradientDivider
import com.example.methodist_mobile_app.presentation.screens.main.home.components.ItemCategory
import com.example.methodist_mobile_app.presentation.screens.main.home.components.ItemEvent
import com.example.methodist_mobile_app.presentation.screens.main.home.components.SearchTextField
import com.example.methodist_mobile_app.presentation.screens.main.home.components.getColorIconEvent
import com.example.methodist_mobile_app.presentation.screens.main.home.components.getTitleEvent
import com.example.methodist_mobile_app.presentation.ui.theme.MethodistTheme.colors
import com.example.methodist_mobile_app.presentation.ui.theme.MethodistTheme.typography
import com.example.methodist_mobile_app.presentation.ui.theme.color
import com.example.methodist_mobile_app.presentation.ui.theme.convertTimestamptzToCalendarDate

@Composable
fun Home(controller: NavHostController, vm: HomeVM = hiltViewModel()) {

    val stateData = vm.dataSt.collectAsState().value
    val stateDialog = vm.dialogSt.collectAsState().value

    if(stateDialog.dialogIsOpen) {
        DialogError(stateDialog.title, stateDialog.description) {
            vm.updDialog(stateDialog.copy(dialogIsOpen = false))
        }
    }

    with(stateData) {

        if(showEvent != null) {
            ShowEvent(showEvent!!) {
                vm.updData(copy(showEvent = null))
            }
        }

        //Отслеживаем строку поиска и выбранную категорию
        LaunchedEffect(selectedCategory, search, events, sortedType) {
            vm.filterList()
        }

        Column (
            modifier = Modifier
                .fillMaxSize()
                .background(colors.background)
                .padding(horizontal = 20.dp, vertical = 40.dp)
        ) {
            Spacer(modifier = Modifier.height(24.dp))
            Row(
                modifier = Modifier.fillMaxWidth().height(IntrinsicSize.Min)
            ) {
                SearchTextField(search, "Поиск") {
                    vm.updData(copy(search = it))
                }
                SpacerWidth(8.dp)
                ButtonFilter(filtersIsOpen) {
                    vm.updData(copy(filtersIsOpen = !filtersIsOpen))
                }
            }
            if(filtersIsOpen) {
                Spacer(modifier = Modifier.height(16.dp))
                Filters(listSortedType, sortedType) {
                    vm.updData(copy(sortedType = it))
                }
                Spacer(modifier = Modifier.height(12.dp))
                Divider(thickness = 0.5.dp, color = colors.primary)
                Spacer(modifier = Modifier.height(12.dp))
                Text(text = "Категории", style = typography.titleMain.color(colors.title))
                Spacer(modifier = Modifier.height(8.dp))
                LazyRow(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    items(categories) { category ->
                        ItemCategory(category, category == selectedCategory) {
                            vm.updData(copy(selectedCategory = category))
                        }
                    }
                }
            }
            Spacer(modifier = Modifier.height(20.dp))
            Text(text = "Пройденные мероприятия", style = typography.titleMain.color(colors.title))
            Spacer(modifier = Modifier.height(12.dp))
            LazyColumn(modifier = Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                items(eventsShow) { event ->
                    ItemEvent(event) {
                        vm.updData(copy(showEvent = event))
                    }
                }
                item {
                    SpacerHeight(100.dp)
                }
            }
        }
    }

}

@Composable
fun ShowEvent(event: EventModel, onDismissRequest: () -> Unit) {
    Dialog(onDismissRequest = { onDismissRequest() }) {
        Card(
            modifier = Modifier.padding(vertical = 20.dp).verticalScroll(rememberScrollState()),
            shape = RoundedCornerShape(15.dp),
            elevation = CardDefaults.cardElevation(10.dp),
            colors = CardDefaults.cardColors(containerColor = colors.container),
        ) {
            Column(modifier = Modifier.padding(20.dp)) {
                Row (verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = ImageVector.vectorResource(R.drawable.icon_event),
                        contentDescription = "",
                        modifier = Modifier
                            .size(40.dp)
                            .fillMaxWidth(),
                        tint = getColorIconEvent(category = event.typeOfEvent.name)
                    )
                    SpacerWidth(12.dp)
                    Column(
                        modifier = Modifier.weight(1f),
                        verticalArrangement = Arrangement.Center) {
                        Text(text = getTitleEvent(event), style = typography.titleDialog.color(colors.title))
                        SpacerHeight(4.dp)
                        Text(text = event.typeOfEvent.name, style = typography.typeOfEventDialog.color(getColorIconEvent(event.typeOfEvent.name)))
                    }
                    SpacerWidth(12.dp)
                    Icon(
                        imageVector = ImageVector.vectorResource(R.drawable.icon_clear),
                        contentDescription = "",
                        modifier = Modifier
                            .align(Alignment.Top)
                            .size(24.dp)
                            .clickable(
                                interactionSource = remember { MutableInteractionSource() },
                                indication = null
                            ) {
                                onDismissRequest()
                            },
                        tint = colors.vector
                    )
                }
                GradientDivider(modifier = Modifier.padding(top = 16.dp), thickness = 2.dp,
                    gradient = Brush.horizontalGradient(
                        colors = listOf(Color(0xFF1977FF), Color(0xFF53B9F5))
                    )
                )
                SpacerHeight(12.dp)
                if (event.name.isNotEmpty()) {
                    SpacerHeight(12.dp)
                    EventDialogSection("Название", event.name)
                }
                if (event.dateOfEvent.isNotEmpty()) {
                    SpacerHeight(12.dp)
                    EventDialogSection("Дата прохождения", event.dateOfEvent.convertTimestamptzToCalendarDate())
                }
                if (event.location.isNotEmpty()) {
                    SpacerHeight(12.dp)
                    EventDialogSection("Место прохождения", event.location)
                }
                if (event.quantityOfHours.isNotEmpty() && event.quantityOfHours != "0") {
                    SpacerHeight(12.dp)
                    EventDialogSection("Количество часов", event.quantityOfHours)
                }
                if (event.formOfParticipation.isNotEmpty()) {
                    SpacerHeight(12.dp)
                    EventDialogSection("Форма участия", event.formOfParticipation)
                }
                if (event.formOfEvent.isNotEmpty()) {
                    SpacerHeight(12.dp)
                    EventDialogSection("Форма мероприятия", event.formOfEvent)
                }
                if (event.result.isNotEmpty()) {
                    SpacerHeight(12.dp)
                    EventDialogSection("Результат", event.result)
                }
                if (event.status.isNotEmpty()) {
                    SpacerHeight(12.dp)
                    EventDialogSection("Статус", event.status)
                }
                if (event.type.isNotEmpty()) {
                    SpacerHeight(12.dp)
                    EventDialogSection("Вид", event.type)
                }
            }
        }
    }
}

@Composable
fun EventDialogSection(title: String, desc: String) {
    Text("$title:",
        style = typography.titleDialog.color(colors.title).copy(fontWeight = FontWeight.SemiBold)
    )
    SpacerHeight(4.dp)
    Text(desc,
        style = typography.descDialog.color(colors.hint).copy(textAlign = TextAlign.Left)
    )
}

