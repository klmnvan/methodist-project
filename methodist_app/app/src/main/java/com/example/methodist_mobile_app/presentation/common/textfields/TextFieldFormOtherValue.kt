package com.example.methodist_mobile_app.presentation.common.textfields

import android.util.Log
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextFieldDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.focus.onFocusChanged
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.res.vectorResource
import androidx.compose.ui.unit.dp
import com.example.methodist_mobile_app.R
import com.example.methodist_mobile_app.presentation.ui.theme.Black
import com.example.methodist_mobile_app.presentation.ui.theme.Blue
import com.example.methodist_mobile_app.presentation.ui.theme.Gray2
import com.example.methodist_mobile_app.presentation.ui.theme.MethodistTheme
import com.example.methodist_mobile_app.presentation.ui.theme.color

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TextFieldFormOtherValue(value: String, placeholder: String, textFieldIsSelect: Boolean, focusTextField: () -> Unit, input: (String) -> Unit) {
    var colorBorder = Gray2
    if (textFieldIsSelect) colorBorder = Blue
    OutlinedTextField(
        value = value,
        onValueChange = { input(it) },
        textStyle = MethodistTheme.typography.textInFiled.color(MethodistTheme.colors.title),
        modifier = Modifier
            .fillMaxWidth()
            .shadow(
                elevation = 4.dp, shape = RoundedCornerShape(15), spotColor = Color(
                    Black.value
                )
            )
            .onFocusChanged { focus ->
                Log.d("focus", focus.isFocused.toString())
                if (focus.isFocused) {
                    Log.d("focus", "Я зашёл в фокус")
                    focusTextField()
                }
            },
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
            unfocusedBorderColor = colorBorder,
            focusedBorderColor = MethodistTheme.colors.primary,
            containerColor = MethodistTheme.colors.container,
            cursorColor = MethodistTheme.colors.primary,
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