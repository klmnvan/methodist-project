package com.example.methodist_mobile_app.presentation.common.textfields

import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextFieldDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.res.vectorResource
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import com.example.methodist_mobile_app.R
import com.example.methodist_mobile_app.presentation.ui.theme.Black
import com.example.methodist_mobile_app.presentation.ui.theme.MethodistTheme
import com.example.methodist_mobile_app.presentation.ui.theme.color

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TextFieldFormOnlyNumbers(value: String, placeholder: String, input: (String) -> Unit) {
    OutlinedTextField(
        value = value,
        onValueChange =
        {
            val regex = Regex("^(0|[1-9][0-9]*)?$")
            if (regex.matches(it) && it.length < 10) {
                input(it)
            }
        },
        textStyle = MethodistTheme.typography.textInFiled.color(MethodistTheme.colors.title),
        modifier = Modifier
            .fillMaxWidth()
            .shadow(
                elevation = 4.dp, shape = RoundedCornerShape(15), spotColor = Color(
                    Black.value
                )
            ),
        placeholder = {
            Text(
                text = placeholder,
                style = MethodistTheme.typography.textInFiled.color(MethodistTheme.colors.hint)
            )
        },
        singleLine = true,
        maxLines = 1,
        shape = RoundedCornerShape(15.dp),
        colors = TextFieldDefaults.outlinedTextFieldColors(
            unfocusedBorderColor = MethodistTheme.colors.outline,
            focusedBorderColor = MethodistTheme.colors.primary,
            containerColor = MethodistTheme.colors.container,
            cursorColor = MethodistTheme.colors.primary,
        ),
        keyboardOptions = KeyboardOptions.Default.copy(
            keyboardType = KeyboardType.Number // Устанавливаем тип клавиатуры на "Числовой"
        ),
        trailingIcon = {
            Icon(
                imageVector = ImageVector.vectorResource(R.drawable.icon_clear),
                contentDescription = "",
                modifier = Modifier
                    .size(24.dp)
                    .clickable(
                        interactionSource = remember { MutableInteractionSource() },
                        indication = null
                    ) {
                        input("")
                    },
                tint = MethodistTheme.colors.vector
            )
        },
    )
}