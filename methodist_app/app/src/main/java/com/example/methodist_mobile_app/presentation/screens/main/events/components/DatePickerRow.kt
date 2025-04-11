package com.example.methodist_mobile_app.presentation.screens.main.events.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.IntrinsicSize
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.res.vectorResource
import androidx.compose.ui.unit.dp
import com.example.methodist_mobile_app.R
import com.example.methodist_mobile_app.presentation.common.spacers.SpacerWidth
import com.example.methodist_mobile_app.presentation.ui.theme.Blue20
import com.example.methodist_mobile_app.presentation.ui.theme.MethodistTheme
import com.example.methodist_mobile_app.presentation.ui.theme.White
import com.example.methodist_mobile_app.presentation.ui.theme.color
import com.example.methodist_mobile_app.presentation.ui.theme.typography

@Composable
fun DatePickerRow(chosenDay: Int, chosenMonth: Int, chosenYear: Int, onClick: () -> Unit) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .height(IntrinsicSize.Min),
        horizontalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Text(
            text = "$chosenDay ${monthsNames[chosenMonth - 1]} $chosenYear",
            modifier = Modifier
                .background(Color(Blue20.value), RoundedCornerShape(15.dp))
                .weight(1f)
                .align(Alignment.CenterVertically)
                .padding(horizontal = 16.dp, vertical = 18.dp),
            style = typography.textInFiled.color(MethodistTheme.colors.primary),
        )
        Button(
            modifier = Modifier
                .weight(1f)
                .fillMaxHeight(1f),
            shape = RoundedCornerShape(15.dp),
            colors = ButtonDefaults.buttonColors(
                containerColor = MethodistTheme.colors.primary
            ),
            onClick = {
                onClick()
            }) {
            Icon(
                modifier = Modifier.padding(),
                imageVector = ImageVector.vectorResource(R.drawable.icon_calendar),
                contentDescription = "",
                tint = Color.Unspecified
            )
            SpacerWidth(12.dp)
            Text(text = "Изменить", style = typography.textButton.color(White))
        }
    }
}