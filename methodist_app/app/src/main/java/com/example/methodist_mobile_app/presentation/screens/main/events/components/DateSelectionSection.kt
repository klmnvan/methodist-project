package com.example.methodist_mobile_app.presentation.screens.main.events.components

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun DateSelectionSection(
    onYearChosen: (String) -> Unit,
    onMonthChosen: (String) -> Unit,
    onDayChosen: (String) -> Unit,
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .height(120.dp)
    ) {
        Box(modifier = Modifier.weight(1f)) {
            InfiniteItemsPicker(
                items = days,
                firstIndex = Int.MAX_VALUE / 2 + (currentDay - 2),
                onItemSelected = onDayChosen
            )
        }
        Box(modifier = Modifier.weight(1f)) {
            InfiniteItemsPicker(
                items = monthsNames,
                firstIndex = Int.MAX_VALUE / 2 - 4 + currentMonth - 1,
                onItemSelected = onMonthChosen
            )
        }
        Box(modifier = Modifier.weight(1f)) {
            InfiniteItemsPicker(
                items = years,
                firstIndex = Int.MAX_VALUE / 2 + (currentYear - 1967),
                onItemSelected = onYearChosen
            )
        }
    }
}