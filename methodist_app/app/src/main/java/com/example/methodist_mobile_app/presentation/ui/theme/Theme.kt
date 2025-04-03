package com.example.methodist_mobile_app.presentation.ui.theme

import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.ReadOnlyComposable

object MethodistTheme {
    val typography: Typography
        @ReadOnlyComposable
        @Composable
        get() = LocalTypography.current
    val colors: ColorPalette
        @ReadOnlyComposable
        @Composable
        get() = LocalColors.current
}

@Composable
fun MethodistTheme(
    themeMode: ThemeMode = ThemeMode.Light,
    content: @Composable () -> Unit
) {
    val colors = when (themeMode) {
        ThemeMode.Dark -> darkColorPalette
        ThemeMode.Light -> lightColorPalette
    }
    CompositionLocalProvider(
        LocalTypography provides typography,
        LocalColors provides colors
    ){
        content()
    }
}

sealed class ThemeMode(val title: String) {
    data object Light: ThemeMode(title = "Light")
    data object Dark: ThemeMode(title = "Dark")
}