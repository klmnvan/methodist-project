package com.example.methodist_mobile_app.presentation.common.buttons

import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.example.methodist_mobile_app.presentation.ui.theme.MethodistTheme.colors
import com.example.methodist_mobile_app.presentation.ui.theme.White
import com.example.methodist_mobile_app.presentation.ui.theme.color
import com.example.methodist_mobile_app.presentation.ui.theme.typography

@Composable
fun ButtonMaxWidth(text: String, enabled: Boolean = true, containerColor: Color, onClick: () -> Unit) {
    Button(
        onClick = { onClick() },
        modifier = Modifier.fillMaxWidth(),
        colors = ButtonDefaults.buttonColors(
            contentColor = Color(White.value),
            containerColor = containerColor,
            disabledContainerColor = colors.inversePrimary,
            disabledContentColor = Color(White.value)
        ),
        shape = RoundedCornerShape(15.dp),
        enabled = enabled
    ) {
        Text(
            text = text,
            modifier = Modifier
                .padding(vertical = 12.dp),
            style = typography.textButton.color(White)
        )
    }
}

