package com.example.methodist_mobile_app.presentation.screens.main.home.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Icon
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.res.vectorResource
import androidx.compose.ui.unit.dp
import com.example.methodist_mobile_app.R
import com.example.methodist_mobile_app.presentation.ui.theme.MethodistTheme

@Composable
fun ButtonFilter(visible: Boolean, onClick: () -> Unit) {
    Column(
        modifier = Modifier.fillMaxHeight()
            .background(MethodistTheme.colors.primary, RoundedCornerShape(15.dp)).aspectRatio(1f)
            .clickable(
                interactionSource = remember { MutableInteractionSource() },
                indication = null
            ) {
                onClick()
            },
        verticalArrangement = Arrangement.Center, horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Icon(
            imageVector = if (visible) ImageVector.vectorResource(R.drawable.icon_krest)
            else ImageVector.vectorResource(R.drawable.icon_sorted),
            contentDescription = null,
            tint = Color.White
        )
    }
}