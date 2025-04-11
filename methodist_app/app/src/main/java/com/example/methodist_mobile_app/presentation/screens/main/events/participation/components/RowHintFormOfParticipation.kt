package com.example.methodist_mobile_app.presentation.screens.main.events.participation.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.spring
import androidx.compose.animation.expandVertically
import androidx.compose.animation.shrinkVertically
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.size
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.res.vectorResource
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import com.example.methodist_mobile_app.R
import com.example.methodist_mobile_app.presentation.ui.theme.MethodistTheme
import com.example.methodist_mobile_app.presentation.ui.theme.color
import com.example.methodist_mobile_app.presentation.ui.theme.typography

@Composable
fun RowHintFormOfParticipation(expandedValue: Boolean, onClick: () -> Unit) {
    Row(
        modifier = Modifier.clickable(
            interactionSource = remember { MutableInteractionSource() },
            indication = null
        ) {
            onClick()
        },
        verticalAlignment = Alignment.CenterVertically
    ) {
        Box(modifier = Modifier.weight(1f)) {
            Text(
                "Пояснение формы участия",
                style = typography.titleMain.color(MethodistTheme.colors.title)
            )
        }
        Icon(
            modifier = Modifier
                .size(15.dp),
            imageVector = if (expandedValue) ImageVector.vectorResource(R.drawable.button_collapse_text)
            else ImageVector.vectorResource(R.drawable.button_expand_text),
            contentDescription = if (expandedValue) "Свернуть" else "Развернуть",
            tint = Color.Unspecified
        )
    }
    AnimatedVisibility(
        visible = expandedValue,
        enter = expandVertically(animationSpec = spring(stiffness = Spring.StiffnessHigh)),
        exit = shrinkVertically(animationSpec = spring(stiffness = Spring.StiffnessHigh))
    ) {
        Column {
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                buildAnnotatedString {
                    withStyle(style = SpanStyle(fontWeight = FontWeight.Bold)) {
                        append("Очное")
                    }
                    append(" - преподаватель непосредственно принимал участие в мероприятии и находился на площадке проведения мероприятия.\n")
                    withStyle(style = SpanStyle(fontWeight = FontWeight.Bold)) {
                        append("Заочное")
                    }
                    append("  - преподаватель отправил свои материалы организаторам мероприятия.\n")
                    withStyle(style = SpanStyle(fontWeight = FontWeight.Bold)) {
                        append("Дистанционное")
                    }
                    append(" - преподаватель непосредственно принимал участие в мероприятии, но не находился на площадке проведения мероприятия, а использовал дистанционные технологии.")
                },
                style = typography.descriptionAuth.color(MethodistTheme.colors.description)
            )
        }
    }
}