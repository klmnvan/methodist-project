package com.example.methodist_mobile_app.presentation.ui.theme

import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp
import com.example.methodist_mobile_app.R

val poppins = FontFamily(
    Font(R.font.poppins_black, FontWeight.Black),
    Font(R.font.poppins_bold, FontWeight.Bold),
    Font(R.font.poppins_exstra_bold, FontWeight.ExtraBold),
    Font(R.font.poppins_extra_light, FontWeight.ExtraLight),
    Font(R.font.poppins_light, FontWeight.Light),
    Font(R.font.poppins_medium, FontWeight.Medium),
    Font(R.font.poppins_regular, FontWeight.Normal),
    Font(R.font.poppins_semi_bold, FontWeight.SemiBold),
    Font(R.font.poppins_thin, FontWeight.Thin)
)

val raleway = FontFamily(
    Font(R.font.raleway_black, FontWeight.Black),
    Font(R.font.raleway_bold, FontWeight.Bold),
    Font(R.font.raleway_extra_bold, FontWeight.ExtraBold),
    Font(R.font.raleway_extra_light, FontWeight.ExtraLight),
    Font(R.font.raleway_light, FontWeight.Light),
    Font(R.font.raleway_medium, FontWeight.Medium),
    Font(R.font.raleway_regular, FontWeight.Normal),
    Font(R.font.raleway_semi_bold, FontWeight.SemiBold),
    Font(R.font.raleway_thin, FontWeight.Thin)
)

data class Typography(
    val titleScreen: TextStyle = TextStyle(),
    val descriptionScreen: TextStyle = TextStyle(),
    val textButton: TextStyle = TextStyle(),
    val hintScreen: TextStyle = TextStyle(),
    val splashHint: TextStyle = TextStyle(),
)

val typography = Typography(

    //splash
    splashHint = TextStyle(
        fontFamily = raleway,
        fontWeight = FontWeight.Normal,
        fontSize = 14.sp,
        color = Color(Gray1.value)
    ),

    titleScreen = TextStyle(
        fontWeight = FontWeight.W500,
        fontSize = 22.sp,
        lineHeight = 28.sp,
        letterSpacing = 0.01.sp
    ),
    descriptionScreen = TextStyle(
        fontWeight = FontWeight.W400,
        fontSize = 18.sp,
        lineHeight = 28.sp,
        letterSpacing = 0.01.sp
    ),
    textButton = TextStyle(
        fontWeight = FontWeight.W600,
        fontSize = 18.sp,
    )
)

val LocalTypography = staticCompositionLocalOf { typography }

fun TextStyle.color(color: Color): TextStyle {
    return this.copy(color = color)
}