package com.example.methodist_mobile_app.presentation.screens.main.profile.components

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Dialog
import com.example.methodist_mobile_app.domain.repository.UserRepository
import com.example.methodist_mobile_app.presentation.common.spacers.SpacerHeight
import com.example.methodist_mobile_app.presentation.ui.theme.MethodistTheme
import com.example.methodist_mobile_app.presentation.ui.theme.White
import com.example.methodist_mobile_app.presentation.ui.theme.color
import com.example.methodist_mobile_app.presentation.ui.theme.typography

@Composable
fun ApplicationThemePickerDialog(chosenTheme: (String) -> Unit, onDismissRequest: () -> Unit){
    var onThemeChosenValue = UserRepository.theme
    Dialog(onDismissRequest = { onDismissRequest() }) {
        Card(
            shape = RoundedCornerShape(15.dp),
            elevation = CardDefaults.cardElevation(10.dp),
            colors = CardDefaults.cardColors(
                containerColor = MethodistTheme.colors.container,
            ),
        ) {
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 10.dp, horizontal = 5.dp)
            ) {
                Text(
                    text = "Список тем",
                    style = typography.titleMain.color(MethodistTheme.colors.title),
                    modifier = Modifier.fillMaxWidth(),
                    textAlign = TextAlign.Center
                )
                SpacerHeight(30.dp)
                ThemeSelectionSection(
                    onThemeChosen = { onThemeChosenValue = it }
                )
                SpacerHeight(20.dp)
                Button(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 10.dp),
                    shape = RoundedCornerShape(15.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = MethodistTheme.colors.primary
                    ),
                    onClick = {
                        chosenTheme(onThemeChosenValue)
                        onDismissRequest()
                    }
                ) {
                    Text(
                        text = "Выбрать",
                        style = typography.textButton.color(White),
                        modifier = Modifier.padding(vertical = 8.dp)
                    )
                }
            }
        }
    }
}