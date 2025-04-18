package com.example.methodist_mobile_app.presentation.screens.main.events.publication

import android.util.Log
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavHostController
import com.example.methodist_mobile_app.presentation.common.buttons.ButtonNext
import com.example.methodist_mobile_app.presentation.common.dialogs.DialogError
import com.example.methodist_mobile_app.presentation.common.spacers.SpacerHeight
import com.example.methodist_mobile_app.presentation.common.textfields.TextFieldForm
import com.example.methodist_mobile_app.presentation.screens.main.events.components.CustomDatePickerDialog
import com.example.methodist_mobile_app.presentation.screens.main.events.components.DatePickerRow
import com.example.methodist_mobile_app.presentation.ui.theme.MethodistTheme.colors
import com.example.methodist_mobile_app.presentation.ui.theme.color
import com.example.methodist_mobile_app.presentation.ui.theme.convertDateToTimestamptz
import com.example.methodist_mobile_app.presentation.ui.theme.typography

@Composable
fun Publication(controller: NavHostController, vm: PublicationVM = hiltViewModel()) {

    val stateData = vm.dataSt.collectAsState().value
    val stateDialog = vm.dialogSt.collectAsState().value

    if(stateDialog.dialogIsOpen) {
        DialogError(stateDialog.title, stateDialog.description) {
            vm.updDialog(stateDialog.copy(dialogIsOpen = false))
        }
    }

    with(stateData) {

        if (showDatePicker) {
            CustomDatePickerDialog("Выбор даты") { chosenYear, chosenMonth, chosenDay ->
                Log.d("date", convertDateToTimestamptz(chosenYear, chosenMonth, chosenDay))
                vm.updData(copy(
                    event = event.copy(
                        dateOfEvent = convertDateToTimestamptz(chosenYear, chosenMonth, chosenDay),
                        endDateOfEvent = convertDateToTimestamptz(chosenYear, chosenMonth, chosenDay)
                    ),
                    chosenDay = chosenDay,
                    chosenYear = chosenYear,
                    chosenMonth = chosenMonth,
                    showDatePicker = false
                ))
            }
        }

        Column(modifier = Modifier
            .fillMaxSize()
            .background(colors.background)
            .verticalScroll(rememberScrollState())
            .padding(horizontal = 20.dp, vertical = 40.dp)
        ) {
            Text("Публикация", style = typography.titleAuth.color(colors.title))
            SpacerHeight(12.dp)
            Text("Название", style = typography.titleMain.color(colors.title))
            SpacerHeight(12.dp)
            TextFieldForm(event.name, "Название") {
                vm.updData(copy(event = event.copy(name = it)))
            }
            SpacerHeight(20.dp)
            Text("Вид", style = typography.titleMain.color(colors.title))
            SpacerHeight(12.dp)
            TextFieldForm(event.type, "Вид") {
                vm.updData(copy(event = event.copy(type = it)))
            }
            SpacerHeight(20.dp)
            Text("Место публикации (сайт/ название сборника)", style = typography.titleMain.color(colors.title))
            SpacerHeight(12.dp)
            TextFieldForm(event.location, "Место публикации") {
                vm.updData(copy(event = event.copy(location = it)))
            }
            SpacerHeight(20.dp)
            Text("Дата", style = typography.titleMain.color(colors.title))
            SpacerHeight(12.dp)
            DatePickerRow(chosenDay, chosenMonth, chosenYear) {
                vm.updData(copy(showDatePicker = true))
            }
            SpacerHeight(12.dp)
            ButtonNext {
                vm.createEvent(controller)
            }
        }
    }

}

