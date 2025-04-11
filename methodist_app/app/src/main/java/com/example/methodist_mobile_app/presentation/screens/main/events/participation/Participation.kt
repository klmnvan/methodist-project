package com.example.methodist_mobile_app.presentation.screens.main.events.participation

import android.util.Log
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalFocusManager
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavHostController
import com.example.methodist_mobile_app.presentation.common.buttons.ButtonNext
import com.example.methodist_mobile_app.presentation.common.dialogs.DialogError
import com.example.methodist_mobile_app.presentation.common.spacers.SpacerHeight
import com.example.methodist_mobile_app.presentation.common.textfields.TextFieldForm
import com.example.methodist_mobile_app.presentation.common.textfields.TextFieldFormOtherValue
import com.example.methodist_mobile_app.presentation.screens.main.events.components.CustomDatePickerDialog
import com.example.methodist_mobile_app.presentation.screens.main.events.components.DatePickerRow
import com.example.methodist_mobile_app.presentation.screens.main.events.holding.OptionsChooseFrom
import com.example.methodist_mobile_app.presentation.screens.main.events.participation.components.RowHintFormOfParticipation
import com.example.methodist_mobile_app.presentation.ui.theme.MethodistTheme.colors
import com.example.methodist_mobile_app.presentation.ui.theme.color
import com.example.methodist_mobile_app.presentation.ui.theme.convertDateToTimestamptz
import com.example.methodist_mobile_app.presentation.ui.theme.typography

@Composable
fun Participation(controller: NavHostController, vm: ParticipationVM = hiltViewModel()) {

    val stateData = vm.dataSt.collectAsState().value
    val stateDialog = vm.dialogSt.collectAsState().value
    val focusManager = LocalFocusManager.current
    var expanded by remember { mutableStateOf(false) }

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
            Text("Сведения", style = typography.titleAuth.color(colors.title))
            SpacerHeight(12.dp)
            RowHintFormOfParticipation(expanded) {
                expanded = !expanded
            }
            Spacer(modifier = Modifier.height(12.dp))
            Text("Форма участия", style = typography.titleMain.color(colors.title))
            SpacerHeight(12.dp)
            OptionsChooseFrom(listFormOfParticipation, event.formOfParticipation) {
                vm.updData(copy(event = event.copy(formOfParticipation = it)))
                focusManager.clearFocus()
            }
            SpacerHeight(20.dp)
            Text("Название мероприятия", style = typography.titleMain.color(colors.title))
            SpacerHeight(12.dp)
            TextFieldForm(event.name, "Название мероприятия") {
                vm.updData(copy(event = event.copy(name = it)))
            }
            SpacerHeight(20.dp)
            Text("Форма мероприятия", style = typography.titleMain.color(colors.title))
            SpacerHeight(12.dp)
            OptionsChooseFrom(listFormOfEvent, event.formOfEvent) {
                vm.updData(copy(event = event.copy(formOfEvent = it)))
                focusManager.clearFocus()
            }
            SpacerHeight(12.dp)
            Text("Если ни один вариант в списке не подошёл, введите вручную", style = typography.descriptionAuth.color(
                colors.description))
            SpacerHeight(12.dp)
            TextFieldFormOtherValue(event.formOfEvent, "Другая форма мероприятия", otherFormOfEvent == event.formOfEvent, {
                if (otherFormOfEvent == "") {
                    vm.updData(copy(event = event.copy(formOfEvent = "")))
                } else {
                    vm.updData(copy(event = event.copy(formOfEvent = otherFormOfEvent)))
                }
            }) {
                vm.updData(copy(event = event.copy(formOfEvent = it), otherFormOfEvent = it))
            }
            SpacerHeight(20.dp)
            Text("Cтатус мероприятия", style = typography.titleMain.color(colors.title))
            SpacerHeight(12.dp)
            OptionsChooseFrom(listStatus, event.status) {
                vm.updData(copy(event = event.copy(status = it)))
                focusManager.clearFocus()
            }
            SpacerHeight(12.dp)
            Text("Если ни один вариант в списке не подошёл, введите вручную", style = typography.descriptionAuth.color(
                colors.description))
            SpacerHeight(12.dp)
            TextFieldFormOtherValue(otherStatus, "Другая форма мероприятия", otherStatus == event.status, {
                if (otherStatus == "") {
                    vm.updData(copy(event = event.copy(status = "")))
                } else {
                    vm.updData(copy(event = event.copy(status = otherStatus)))
                }
            }) {
                vm.updData(copy(event = event.copy(status = it), otherStatus = it))
            }
            SpacerHeight(20.dp)
            Text("Результат", style = typography.titleMain.color(colors.title))
            SpacerHeight(12.dp)
            OptionsChooseFrom(listResult, event.result) {
                vm.updData(copy(event = event.copy(result = it)))
                focusManager.clearFocus()
            }
            SpacerHeight(12.dp)
            Text("Если ни один вариант в списке не подошёл, введите вручную", style = typography.descriptionAuth.color(
                colors.description))
            SpacerHeight(12.dp)
            TextFieldFormOtherValue(otherResult, "Другая форма мероприятия", otherResult == event.result, {
                if (otherResult == "") {
                    vm.updData(copy(event = event.copy(result = "")))
                } else {
                    vm.updData(copy(event = event.copy(result = otherStatus)))
                }
            }) {
                vm.updData(copy(event = event.copy(result = it), otherResult = it))
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
            SpacerHeight(120.dp)
        }
    }

}

