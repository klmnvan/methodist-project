package com.example.methodist_mobile_app.presentation.common.dialogs

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.res.vectorResource
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Dialog
import com.example.methodist_mobile_app.R
import com.example.methodist_mobile_app.presentation.common.spacers.SpacerHeight
import com.example.methodist_mobile_app.presentation.ui.theme.MethodistTheme.colors
import com.example.methodist_mobile_app.presentation.ui.theme.MethodistTheme.typography
import com.example.methodist_mobile_app.presentation.ui.theme.color

@Composable
fun DialogError(title: String, desc: String, onDismissRequest: () -> Unit) {
    Dialog(onDismissRequest = {
        onDismissRequest()
    }) {
        Column(
            modifier = Modifier.fillMaxWidth().clip(RoundedCornerShape(16.dp)).background(colors.container).padding(vertical = 30.dp, horizontal = 10.dp),
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Box(modifier = Modifier.clip(CircleShape).background(colors.error).padding(10.dp), contentAlignment = Alignment.Center) {
                Icon(imageVector = ImageVector.vectorResource(R.drawable.icon_error), contentDescription = "",
                    modifier = Modifier.size(24.dp), tint = Color.White)
            }
            SpacerHeight(24.dp)
            Text(title, style = typography.titleDialog.color(colors.title))
            SpacerHeight(8.dp)
            Text(desc, style = typography.descDialog.color(colors.description))
        }
    }
}