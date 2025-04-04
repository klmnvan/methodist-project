package com.example.methodist_mobile_app.presentation.common.textfields

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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.res.vectorResource
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.methodist_mobile_app.R
import com.example.methodist_mobile_app.presentation.ui.theme.Black
import com.example.methodist_mobile_app.presentation.ui.theme.MethodistTheme.colors
import com.example.methodist_mobile_app.presentation.ui.theme.MethodistTheme.typography
import com.example.methodist_mobile_app.presentation.ui.theme.color

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TextFieldAuth(value: String, placeholder: String, input: (String) -> Unit) {
    OutlinedTextField(
        value = value,
        onValueChange = {input(it) },
        textStyle = typography.textInFiled.color(colors.title),
        modifier = Modifier
            .fillMaxWidth()
            .shadow(
                elevation = 4.dp, shape = RoundedCornerShape(30), spotColor = Color(
                    Black.value
                )
            ),
        placeholder = { Text(text = placeholder, style = typography.textInFiled.color(colors.hint)) },
        singleLine = true,
        shape = RoundedCornerShape(15.dp),
        colors = TextFieldDefaults.outlinedTextFieldColors(
            unfocusedBorderColor = Color.Transparent,
            focusedBorderColor = Color.Transparent,
            containerColor = colors.container,
            cursorColor = colors.primary
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
                tint = colors.vector
            )
        },
    )
}