package com.example.methodist_mobile_app.presentation.screens.main.home.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.example.methodist_mobile_app.data.models.TypeOfEventModel
import com.example.methodist_mobile_app.presentation.ui.theme.Blue
import com.example.methodist_mobile_app.presentation.ui.theme.Blue20
import com.example.methodist_mobile_app.presentation.ui.theme.MethodistTheme
import com.example.methodist_mobile_app.presentation.ui.theme.White
import com.example.methodist_mobile_app.presentation.ui.theme.color

@Composable
fun ItemCategory(category: TypeOfEventModel, selected: Boolean, onClick: () -> Unit) {
    val backgroundColor = if (selected) Blue else Blue20
    val textColor = if (selected) White else Blue
    Text(
        modifier = Modifier
            .background(backgroundColor, RoundedCornerShape(15.dp))
            .padding(vertical = 14.dp, horizontal = 20.dp)
            .clickable(
                interactionSource = remember { MutableInteractionSource() },
                indication = null
            ) {
                onClick()
            },
        text = category.name,
        style = MethodistTheme.typography.menuCategory.color(textColor)
    )

}