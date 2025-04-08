package com.example.methodist_mobile_app.presentation.ui.theme

import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.sp
import com.example.methodist_mobile_app.R
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.time.format.DateTimeParseException

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
    val titleAuth: TextStyle = TextStyle(),
    val descriptionAuth: TextStyle = TextStyle(),
    val textButton: TextStyle = TextStyle(),
    val hintScreen: TextStyle = TextStyle(),
    val textInFiled: TextStyle = TextStyle(),
    val titleField: TextStyle = TextStyle(),
    val titleDialog: TextStyle = TextStyle(),
    val descDialog: TextStyle = TextStyle(),
    val menuCategory: TextStyle = TextStyle(),
    val titleMain: TextStyle = TextStyle(),
    val hintEventItem: TextStyle = TextStyle(),
    val dateInItemEvent: TextStyle = TextStyle(),
    val titleProfile: TextStyle = TextStyle(),
)

val typography = Typography(

    textInFiled = TextStyle(
        fontFamily = raleway,
        fontWeight = FontWeight.Normal,
        fontSize = 16.sp,
        lineHeight = 20.sp
    ),
    titleAuth = TextStyle(
        fontFamily = raleway,
        fontWeight = FontWeight.Bold,
        fontSize = 32.sp,
        lineHeight = 20.sp
    ),
    descriptionAuth = TextStyle(
        fontFamily = raleway,
        fontWeight = FontWeight.Normal,
        fontSize = 14.sp,
        lineHeight = 20.sp
    ),
    titleDialog = TextStyle(
        fontFamily = raleway,
        fontWeight = FontWeight.Bold,
        fontSize = 16.sp,
        lineHeight = 20.sp
    ),
    descDialog = TextStyle(
        fontFamily = raleway,
        fontWeight = FontWeight.Normal,
        fontSize = 16.sp,
        textAlign = TextAlign.Center
    ),
    menuCategory = TextStyle(
        fontFamily = raleway,
        fontWeight = FontWeight.SemiBold,
        fontSize = 12.sp,
        textAlign = TextAlign.Center
    ),
    titleMain = TextStyle(
        fontFamily = poppins,
        fontWeight = FontWeight.SemiBold,
        fontSize = 18.sp,
    ),
    hintEventItem = TextStyle(
        fontFamily = raleway,
        fontWeight = FontWeight.Normal,
        fontSize = 12.sp,
        lineHeight = 20.sp,
    ),
    dateInItemEvent = TextStyle(
        fontFamily = poppins,
        fontWeight = FontWeight.Medium,
        fontSize = 12.sp,
        lineHeight = 20.sp,
    ),
    titleProfile = TextStyle(
        fontFamily = raleway,
        fontWeight = FontWeight.Bold,
        fontSize = 24.sp,
    ),
    textButton = TextStyle(
        fontFamily = raleway,
        fontWeight = FontWeight.SemiBold,
        fontSize = 16.sp,
    )
)

val LocalTypography = staticCompositionLocalOf { typography }

fun TextStyle.color(color: Color): TextStyle {
    return this.copy(color = color)
}

fun String.firstCharUp(): String {
    if (isEmpty()) return this
    return this.first().uppercase() + this.substring(1)
}

fun String.convertDate(): String {
    return if (this.isNotEmpty()) {
        try {
            val inputFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
            val outputFormatter = DateTimeFormatter.ofPattern("dd.MM.yyyy")
            val localDate = LocalDate.parse(this, inputFormatter)
            localDate.format(outputFormatter)
        } catch (e: DateTimeParseException) {
            this // Возвращаем исходную строку, если не удалось распарсить дату
        }
    } else {
        this
    }
}