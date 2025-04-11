package com.example.methodist_mobile_app.presentation.screens.main.events.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.res.vectorResource
import androidx.compose.ui.unit.dp
import com.example.methodist_mobile_app.presentation.common.spacers.SpacerHeight
import com.example.methodist_mobile_app.presentation.ui.theme.Black
import com.example.methodist_mobile_app.presentation.ui.theme.MethodistTheme
import com.example.methodist_mobile_app.presentation.ui.theme.color
import com.example.methodist_mobile_app.presentation.ui.theme.typography

@Composable
fun RowScope.ItemCategory(idVector: Int, title: String, onClick: () -> Unit) {
    Column(
        modifier = Modifier
            .aspectRatio(1f)
            .weight(1f)
            .border(
                width = 2.dp,
                color = MethodistTheme.colors.outline,
                shape = RoundedCornerShape(15.dp)
            )
            .clickable {
                onClick()
            }
            .background(MethodistTheme.colors.container, shape = RoundedCornerShape(15.dp))
            .padding(vertical = 20.dp, horizontal = 16.dp)
            .fillMaxSize(),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Icon(
            imageVector = ImageVector.vectorResource(idVector),
            contentDescription = "",
            tint = Color.Unspecified
        )
        SpacerHeight(12.dp)
        Text(
            text = title.toUpperCase(),
            style = typography.createEventButton.color(MethodistTheme.colors.title)
        )
    }
}