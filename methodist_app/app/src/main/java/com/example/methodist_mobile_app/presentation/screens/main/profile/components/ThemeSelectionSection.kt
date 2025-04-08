package com.example.methodist_mobile_app.presentation.screens.main.profile.components

import android.util.Log
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.example.methodist_mobile_app.domain.repository.UserRepository

@Composable
fun ThemeSelectionSection(
    onThemeChosen: (String) -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .height(120.dp)
    ) {
        Log.d("тема текущая", UserRepository.theme)
        Log.d("тема текущая", UserRepository.themes.toString())
        Log.d(
            "тема текущая",
            UserRepository.themes.map { it.title }.indexOf(UserRepository.theme).toString()
        )
        val firstIndex = UserRepository.themes.map { it.title }.indexOf(UserRepository.theme)
        Box(modifier = Modifier.weight(1f)) {
            ThemeInfiniteItemsPicker(
                items = UserRepository.themes.map { it.title },
                firstIndex = Int.MAX_VALUE / 2 + firstIndex - 1,
                onItemSelected = onThemeChosen
            )
        }
    }
}