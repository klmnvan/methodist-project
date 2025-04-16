package com.example.methodist_mobile_app.presentation.screens.main.events.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.RadioButton
import androidx.compose.material3.RadioButtonDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.example.methodist_mobile_app.presentation.ui.theme.Blue
import com.example.methodist_mobile_app.presentation.ui.theme.MethodistTheme
import com.example.methodist_mobile_app.presentation.ui.theme.color
import com.example.methodist_mobile_app.presentation.ui.theme.typography

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
            var colorBorder = MethodistTheme.colors.outline
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
                    .background(MethodistTheme.colors.container, shape = RoundedCornerShape(15.dp))
                    .clickable(
                        interactionSource = remember { MutableInteractionSource() },
                        indication = null
                    ) {
                        onClick(el)
                    },
                verticalAlignment = Alignment.CenterVertically
            ) {
                RadioButton(
                    selected = (el == selected),
                    onClick = {
                        onClick(el)
                    },
                    colors = RadioButtonDefaults.colors(
                        selectedColor = Color(Blue.value),
                        unselectedColor = MethodistTheme.colors.outline
                    )
                )
                Text(
                    modifier = Modifier
                        .padding(end = 24.dp)
                        .padding(vertical = 8.dp),
                    text = el,
                    style = typography.textInFiled.color(MethodistTheme.colors.title)
                )
            }
        }
    }
}