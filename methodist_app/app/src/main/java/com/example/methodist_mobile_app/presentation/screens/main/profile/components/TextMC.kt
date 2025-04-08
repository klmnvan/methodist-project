package com.example.methodist_mobile_app.presentation.screens.main.profile.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.res.vectorResource
import androidx.compose.ui.unit.dp
import com.example.methodist_mobile_app.R
import com.example.methodist_mobile_app.presentation.common.spacers.SpacerWidth
import com.example.methodist_mobile_app.presentation.ui.theme.Blue20
import com.example.methodist_mobile_app.presentation.ui.theme.MethodistTheme
import com.example.methodist_mobile_app.presentation.ui.theme.color
import com.example.methodist_mobile_app.presentation.ui.theme.typography

@Composable
fun TextMC(name: String) {
    Row(
        modifier = Modifier.fillMaxWidth().clip(RoundedCornerShape(15.dp)).background(Blue20)
            .padding(vertical = 18.dp, horizontal = 16.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(name, style = typography.textInFiled.color(MethodistTheme.colors.primary))
        SpacerWidth(8.dp)
        Spacer(modifier = Modifier.weight(1f))
        Icon(
            imageVector = ImageVector.vectorResource(R.drawable.icon_tick),
            contentDescription = "",
            tint = MethodistTheme.colors.primary,
            modifier = Modifier.size(14.dp)
        )
    }
}