package com.example.methodist_mobile_app.presentation.screens.main.events.components

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import com.example.methodist_mobile_app.presentation.common.spacers.SpacerHeight
import com.example.methodist_mobile_app.presentation.ui.theme.MethodistTheme
import com.example.methodist_mobile_app.presentation.ui.theme.typography

@Composable
fun CustomDatePickerDialog(
    label: String,
    onDismissRequest: (Int, Int, Int) -> Unit,
) {
    var chosenYear: Int = currentYear
    var chosenMonth: Int = currentMonth
    var chosenDay: Int = currentDay
    Dialog(onDismissRequest = { onDismissRequest(chosenYear, chosenMonth, chosenDay) }) {
        Card(
            shape = RoundedCornerShape(15.dp),
            elevation = CardDefaults.cardElevation(10.dp),
            colors = CardDefaults.cardColors(
                containerColor = MethodistTheme.colors.container,
            ),
        ) {
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 10.dp, horizontal = 5.dp)
            ) {
                Text(
                    text = label,
                    style = typography.titleMain.copy(color = MethodistTheme.colors.title),
                    modifier = Modifier.fillMaxWidth(),
                    textAlign = TextAlign.Center
                )
                SpacerHeight(30.dp)
                DateSelectionSection(
                    onYearChosen = { chosenYear = it.toInt() },
                    onMonthChosen = { chosenMonth = monthsNames.indexOf(it) + 1 },
                    onDayChosen = { chosenDay = it.toInt() },
                )
                SpacerHeight(30.dp)
                Button(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 10.dp),
                    shape = RoundedCornerShape(15.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = MethodistTheme.colors.primary
                    ),
                    onClick = {
                        onDismissRequest(chosenYear, chosenMonth, chosenDay)
                    }
                ) {
                    Text(
                        text = "Готово",
                        fontWeight = FontWeight.Bold,
                        fontSize = 20.sp,
                        color = Color.White,
                        modifier = Modifier.padding(vertical = 8.dp)
                    )
                }
            }
        }
    }
}