package com.example.methodist_mobile_app.presentation.screens.main.profile.components

import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
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
import com.example.methodist_mobile_app.presentation.ui.theme.Blue80
import com.example.methodist_mobile_app.presentation.ui.theme.White
import com.example.methodist_mobile_app.presentation.ui.theme.color
import com.example.methodist_mobile_app.presentation.ui.theme.typography

@Composable
fun ButtonChangeProfile(title: String, onClick: () -> Unit) {
    Button(
        modifier = Modifier
            .fillMaxWidth(1f),
        shape = RoundedCornerShape(15.dp),
        colors = ButtonDefaults.buttonColors(
            containerColor = Color(Blue80.value)
        ),
        onClick = {
            onClick()
        }) {
        Row(
            modifier = Modifier.padding(vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                modifier = Modifier
                    .padding()
                    .size(25.dp),
                imageVector = ImageVector.vectorResource(R.drawable.icon_profile),
                contentDescription = "",
                tint = White
            )
            SpacerWidth(12.dp)
            Text(text = title, style = typography.textButton.color(White))
        }
    }
}