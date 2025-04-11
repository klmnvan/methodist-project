package com.example.methodist_mobile_app.presentation.screens.main.events.holding

import android.util.Log
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.RadioButton
import androidx.compose.material3.RadioButtonDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
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
import com.example.methodist_mobile_app.presentation.ui.theme.Blue
import com.example.methodist_mobile_app.presentation.ui.theme.MethodistTheme.colors
import com.example.methodist_mobile_app.presentation.ui.theme.color
import com.example.methodist_mobile_app.presentation.ui.theme.convertDateToTimestamptz
import com.example.methodist_mobile_app.presentation.ui.theme.typography

@Composable
fun Holding(controller: NavHostController, vm: HoldingVM = hiltViewModel()) {

    val stateData = vm.dataSt.collectAsState().value
    val stateDialog = vm.dialogSt.collectAsState().value
    val focusManager = LocalFocusManager.current

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
            Text("Название", style = typography.titleMain.color(colors.title))
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
            TextFieldFormOtherValue(otherFormOfEvent, "Другая форма мероприятия", otherFormOfEvent == event.formOfEvent, {
                if (otherFormOfEvent == "") {
                    vm.updData(copy(event = event.copy(formOfEvent = "")))
                } else {
                    vm.updData(copy(event = event.copy(formOfEvent = otherFormOfEvent)))
                }
            }) {
                vm.updData(copy(event = event.copy(formOfEvent = it), otherFormOfEvent = it))
            }
            SpacerHeight(20.dp)
            Text("Место проведения", style = typography.titleMain.color(colors.title))
            SpacerHeight(12.dp)
            TextFieldForm(event.location, "Место проведения") {
                vm.updData(copy(event = event.copy(location = it)))
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

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun OptionsChooseFrom (list: List<String>, selected: String, onClick: (String) -> Unit ){
    FlowRow(
        Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp),
        maxItemsInEachRow = Int.MAX_VALUE
    ) {
        list.forEach { el ->
            var colorBorder = colors.outline
            if (el == selected) {
                colorBorder = Blue
            }
            Row(
                modifier = Modifier
                    .border(
                        width = 1.dp,
                        color = colorBorder,
                        shape = RoundedCornerShape(15.dp)
                    )
                    .background(colors.container, shape = RoundedCornerShape(15.dp))
                    .clickable(interactionSource = remember { MutableInteractionSource() },
                        indication = null) {
                        onClick(el)
                    }
                ,
                verticalAlignment = Alignment.CenterVertically
            ) {
                RadioButton(
                    selected = (el == selected),
                    onClick = {
                        onClick(el)
                    },
                    colors = RadioButtonDefaults.colors(
                        selectedColor = Color(Blue.value),
                        unselectedColor = colors.outline
                    )
                )
                Text(
                    modifier = Modifier
                        .padding(end = 24.dp)
                        .padding(vertical = 8.dp),
                    text = el,
                    style = typography.textInFiled.color(colors.title)
                )
            }
        }
    }
}

