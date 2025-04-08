package com.example.methodist_mobile_app.presentation.screens.main.profile.components

import android.util.Log
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.IntrinsicSize
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.MutableState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.res.vectorResource
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.methodist_mobile_app.R
import com.example.methodist_mobile_app.domain.repository.UserRepository
import com.example.methodist_mobile_app.presentation.common.spacers.SpacerWidth
import com.example.methodist_mobile_app.presentation.ui.theme.Blue20
import com.example.methodist_mobile_app.presentation.ui.theme.Blue80
import com.example.methodist_mobile_app.presentation.ui.theme.MethodistTheme
import com.example.methodist_mobile_app.presentation.ui.theme.ThemeMode
import com.example.methodist_mobile_app.presentation.ui.theme.White
import com.example.methodist_mobile_app.presentation.ui.theme.color
import com.example.methodist_mobile_app.presentation.ui.theme.typography

@Composable
fun RowChangeTheme(currentThemeMode: MutableState<ThemeMode>) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .height(IntrinsicSize.Min),
        horizontalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Text(
            text = currentThemeMode.value.title,
            modifier = Modifier
                .background(Color(Blue20.value), RoundedCornerShape(15.dp))
                .weight(1f)
                .align(Alignment.CenterVertically)
                .padding(horizontal = 16.dp, vertical = 18.dp),
            style = typography.textButton.copy(
                color = MethodistTheme.colors.primary,
                fontSize = 16.sp
            )
        )
        var showDialog by remember { mutableStateOf(false) }
        Button(
            modifier = Modifier
                .weight(1f)
                .fillMaxHeight(1f),
            shape = RoundedCornerShape(15.dp),
            colors = ButtonDefaults.buttonColors(
                containerColor = Color(Blue80.value)
            ),
            onClick = {
                showDialog = true
            }) {
            Icon(
                modifier = Modifier
                    .padding()
                    .size(25.dp),
                imageVector = ImageVector.vectorResource(R.drawable.icon_brush),
                contentDescription = "",
                tint = Color.Unspecified
            )
            SpacerWidth(12.dp)
            Text(text = "Сменить", style = typography.textButton.color(White))
        }

        if (showDialog) {

            ApplicationThemePickerDialog({
                currentThemeMode.value = UserRepository.themes.find { theme -> theme.title == it }!!
                Log.d("currentThemeMode", currentThemeMode.value.toString())
            }
            ) {
                UserRepository.theme = currentThemeMode.value.title
                showDialog = false
            }
        }
    }
}