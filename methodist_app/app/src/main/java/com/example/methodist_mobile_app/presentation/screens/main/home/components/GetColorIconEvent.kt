package com.example.methodist_mobile_app.presentation.screens.main.home.components

import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import com.example.methodist_mobile_app.presentation.ui.theme.Blue
import com.example.methodist_mobile_app.presentation.ui.theme.Blue80
import com.example.methodist_mobile_app.presentation.ui.theme.Green
import com.example.methodist_mobile_app.presentation.ui.theme.Orange
import com.example.methodist_mobile_app.presentation.ui.theme.Purple

@Composable
fun getColorIconEvent(category: String): Color {
    return when(category){
        ("Участие") -> Green
        ("Проведение") -> Blue
        ("Стажировка") -> Purple
        ("Публикация") -> Orange
        else -> Blue80
    }
}