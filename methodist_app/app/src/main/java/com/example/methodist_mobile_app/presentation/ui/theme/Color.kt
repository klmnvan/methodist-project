package com.example.methodist_mobile_app.presentation.ui.theme

import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.graphics.Color

val Blue = Color(0xFF1977FF)
val Blue80 = Color(0xCC1977FF)
val Blue20 = Color(0x334792FF)
val Black = Color(0xFF000000)
val Gray1 = Color(0xFFAAADB2)
val Gray2 = Color(0xFFF0F0F3)
val Gray5 = Color(0xFFA7A7A7)
val Gray3 = Color(0xFF555B69)
val DescriptionText = Color(0xFF939396)
val Orange = Color(0xFFFF7C3B)
val Orange80 = Color(0xCCFF7C3B)
val Outline = Color(0xFFF0F0F3)
val Purple = Color(0xFFC184FF)
val White = Color(0xFFFFFFFF)
val LightBack = Color(0xFFF7F7F9)
val DarkBack = Color(0xFF18181B)
val DarkContainers = Color(0xFF26272B)
val Green = Color(0xFF22B07D)
val DarkBackground = Color(0xFF272A37)
val DarkBlueBackground = Color(0xFF24293E)
val DarkBlueContainer = Color(0xFF2F3855)
val DarkBlueTextTitle = Color(0xFFF4F4FC)
val DarkBlueTextDesc = Color(0xFF9FDCFF)
val DarkBlueOutline = Color(0xFF8FBAF7)
val DarkBluePrimaryInverse = Color(0xFF535A76)
val DarkBlueError = Color(0xFFFF3B3B)
val DarkBlueOnBackground = Color(0xFF8FBAF7)
val DarkBlueSurface = Color(0xFF8FBAF7)
val CustomTransparent = Color(0x00323644)

data class ColorPalette(
    val background: Color,
    val container: Color,
    val title: Color,
    val description: Color,
    val outline: Color,
    val primary: Color,
    val inversePrimary: Color,
    val error: Color,
    val category: Color,
    val vector: Color,
    val hint: Color,
)

val lightColorPalette = ColorPalette(
    background = Color(0xFFF7F7F9),
    container = Color(0xFFFFFFFF),
    title = Color(0xFF000000),
    description = Color(0xFF939396),
    outline = Color(0xFFF0F0F3),
    primary = Color(0xFF1977FF),
    inversePrimary = Color(0xFF555B69),
    error = Color(0xFFFF7C3B),
    category = Color(0xFF555B69),
    vector = Color(0xFFAAADB2),
    hint = Color(0xFFAAADB2),
)

val darkColorPalette = ColorPalette(
    background = Color(0xFF18181B),
    container = Color(0xFF26272B),
    title = Color(0xFFFFFFFF),
    description = Color(0xFF939396),
    outline = Color(0xFFAAADB2),
    primary = Color(0xFF1977FF),
    inversePrimary = Color(0xFF555B69),
    error = Color(0xFFFF7C3B),
    category = Color(0xFFAAADB2),
    vector = Color(0xFFAAADB2),
    hint = Color(0xFFAAADB2),
)

val LocalColors = staticCompositionLocalOf { lightColorPalette }