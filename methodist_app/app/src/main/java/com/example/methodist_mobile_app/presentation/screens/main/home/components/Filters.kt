package com.example.methodist_mobile_app.presentation.screens.main.home.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.Icon
import androidx.compose.material3.MenuDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.res.vectorResource
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.DpOffset
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.methodist_mobile_app.R
import com.example.methodist_mobile_app.presentation.ui.theme.MethodistTheme

@Composable
fun Filters(listSortedType: List<String>, sortedType: Int, onClick: (Int) -> Unit) {
    var expanded by remember { mutableStateOf(false) }
    Column {
        Row(
            modifier = Modifier.fillMaxWidth().clickable(
                interactionSource = remember { MutableInteractionSource() },
                indication = null
            ) { expanded = !expanded },
            verticalAlignment = Alignment.CenterVertically
        )
        {
            Icon(
                imageVector = ImageVector.vectorResource(R.drawable.button_collapse_text),
                contentDescription = "",
                modifier = Modifier.size(16.dp),
                tint = MethodistTheme.colors.primary
            )
            Spacer(modifier = Modifier.width(12.dp))
            Text(
                text = buildAnnotatedString {
                    withStyle(SpanStyle(color = MethodistTheme.colors.title)) {
                        append("Сортировка: ")
                    }
                    withStyle(
                        SpanStyle(
                            color = MethodistTheme.colors.primary,
                            fontWeight = FontWeight.Bold
                        )
                    ) {
                        append(listSortedType[sortedType])
                    }
                },
                modifier = Modifier.fillMaxWidth(),
                fontSize = 14.sp,
                style = MethodistTheme.typography.textInFiled
            )
        }
        DropdownMenu(
            modifier = Modifier.background(MethodistTheme.colors.container),
            offset = DpOffset(0.dp, 8.dp),
            expanded = expanded,
            onDismissRequest = { expanded = false },
        ) {
            listSortedType.forEach { item ->
                DropdownMenuItem(
                    text = { Text(item) },
                    onClick = {
                        expanded = false
                        onClick(listSortedType.indexOf(item))
                    },
                    colors = MenuDefaults.itemColors(
                        textColor = MethodistTheme.colors.title,
                    )
                )
            }
        }
    }
}