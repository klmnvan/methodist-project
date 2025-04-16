package com.example.methodist_mobile_app.presentation.screens.main.events.participation

import android.annotation.SuppressLint
import android.content.Context
import android.net.Uri
import android.provider.OpenableColumns
import android.util.Log
import android.widget.Toast
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalFocusManager
import androidx.compose.ui.res.vectorResource
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavHostController
import com.example.methodist_mobile_app.R
import com.example.methodist_mobile_app.presentation.common.buttons.ButtonMaxWidth
import com.example.methodist_mobile_app.presentation.common.buttons.ButtonNext
import com.example.methodist_mobile_app.presentation.common.dialogs.DialogError
import com.example.methodist_mobile_app.presentation.common.spacers.SpacerHeight
import com.example.methodist_mobile_app.presentation.common.textfields.TextFieldForm
import com.example.methodist_mobile_app.presentation.common.textfields.TextFieldFormOtherValue
import com.example.methodist_mobile_app.presentation.screens.main.events.components.CustomDatePickerDialog
import com.example.methodist_mobile_app.presentation.screens.main.events.components.DatePickerRow
import com.example.methodist_mobile_app.presentation.screens.main.events.components.OptionsChooseFrom
import com.example.methodist_mobile_app.presentation.screens.main.events.participation.components.RowHintFormOfParticipation
import com.example.methodist_mobile_app.presentation.screens.main.home.components.getColorIconEvent
import com.example.methodist_mobile_app.presentation.screens.main.home.components.getTitleEvent
import com.example.methodist_mobile_app.presentation.ui.theme.MethodistTheme
import com.example.methodist_mobile_app.presentation.ui.theme.MethodistTheme.colors
import com.example.methodist_mobile_app.presentation.ui.theme.color
import com.example.methodist_mobile_app.presentation.ui.theme.convertDateToTimestamptz
import com.example.methodist_mobile_app.presentation.ui.theme.typography

@Composable
fun Participation(controller: NavHostController, vm: ParticipationVM = hiltViewModel()) {

    val stateData = vm.dataSt.collectAsState().value
    val stateDialog = vm.dialogSt.collectAsState().value
    val focusManager = LocalFocusManager.current
    var expanded by remember { mutableStateOf(false) }
    val context = LocalContext.current

    val fileLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.GetMultipleContents(),
        onResult = { uris ->
            val maxSizeMb = 10
            val maxSizeBytes = maxSizeMb * 1024 * 1024
            val maxCount = 3
            val validFiles = uris.mapNotNull { uri ->
                val size = uri.getFileSize(context)
                when {
                    size == null -> {
                        Toast.makeText(context, "Не удалось определить размер файла", Toast.LENGTH_SHORT).show()
                        null
                    }
                    size > maxSizeBytes -> {
                        val sizeMB = String.format("%.1f", size.toDouble() / (1024 * 1024))
                        Toast.makeText(
                            context,
                            "Файл ${uri.getFileName(context)} ($sizeMB МБ) превышает лимит $maxSizeMb МБ",
                            Toast.LENGTH_LONG
                        ).show()
                        null
                    }
                    else -> UiFile(
                        uri = uri,
                        name = uri.getFileName(context),
                        size = size
                    )
                }
            }.take(maxCount)
            val currentCount = stateData.uploadedFiles.size
            val remainingSlots = maxCount - currentCount
            val filesToAdd = validFiles.take(remainingSlots)
            vm.updData(stateData.copy(uploadedFiles = (stateData.uploadedFiles + filesToAdd).distinctBy { it.uri }))
        }
    )

    if(stateDialog.dialogIsOpen) {
        DialogError(stateDialog.title, stateDialog.description) {
            vm.updDialog(stateDialog.copy(dialogIsOpen = false))
        }
    }

    with(stateData) {

        if (showDatePicker) {
            CustomDatePickerDialog("Выбор даты") { chosenYear, chosenMonth, chosenDay ->
                Log.d("date", convertDateToTimestamptz(chosenYear, chosenMonth, chosenDay))
                vm.updData(copy(
                    event = event.copy(
                        dateOfEvent = convertDateToTimestamptz(chosenYear, chosenMonth, chosenDay),
                        endDateOfEvent = convertDateToTimestamptz(chosenYear, chosenMonth, chosenDay)
                    ),
                    chosenDay = chosenDay,
                    chosenYear = chosenYear,
                    chosenMonth = chosenMonth,
                    showDatePicker = false
                ))
            }
        }

        Column(modifier = Modifier
            .fillMaxSize()
            .background(colors.background)
            .verticalScroll(rememberScrollState())
            .padding(horizontal = 20.dp, vertical = 40.dp)
        ) {
            Text("Участие в мероприятии", style = typography.titleAuth.color(colors.title))
            SpacerHeight(12.dp)
            RowHintFormOfParticipation(expanded) {
                expanded = !expanded
            }
            Spacer(modifier = Modifier.height(12.dp))
            Text("Форма участия", style = typography.titleMain.color(colors.title))
            SpacerHeight(12.dp)
            OptionsChooseFrom(listFormOfParticipation, event.formOfParticipation) {
                vm.updData(copy(event = event.copy(formOfParticipation = it)))
                focusManager.clearFocus()
            }
            SpacerHeight(20.dp)
            Text("Название мероприятия", style = typography.titleMain.color(colors.title))
            SpacerHeight(12.dp)
            TextFieldForm(event.name, "Название мероприятия") {
                vm.updData(copy(event = event.copy(name = it)))
            }
            SpacerHeight(20.dp)
            Text("Форма мероприятия", style = typography.titleMain.color(colors.title))
            SpacerHeight(12.dp)
            OptionsChooseFrom(listFormOfEvent, event.formOfEvent) {
                vm.updData(copy(event = event.copy(formOfEvent = it)))
                focusManager.clearFocus()
            }
            SpacerHeight(12.dp)
            Text("Если ни один вариант в списке не подошёл, введите вручную", style = typography.descriptionAuth.color(
                colors.description))
            SpacerHeight(12.dp)
            TextFieldFormOtherValue(otherFormOfEvent, "Другая форма мероприятия", otherFormOfEvent == event.formOfEvent, {
                if (otherFormOfEvent == "") {
                    vm.updData(copy(event = event.copy(formOfEvent = "")))
                } else {
                    vm.updData(copy(event = event.copy(formOfEvent = otherFormOfEvent)))
                }
            }) {
                vm.updData(copy(event = event.copy(formOfEvent = it), otherFormOfEvent = it))
            }
            SpacerHeight(20.dp)
            Text("Cтатус мероприятия", style = typography.titleMain.color(colors.title))
            SpacerHeight(12.dp)
            OptionsChooseFrom(listStatus, event.status) {
                vm.updData(copy(event = event.copy(status = it)))
                focusManager.clearFocus()
            }
            SpacerHeight(12.dp)
            Text("Если ни один вариант в списке не подошёл, введите вручную", style = typography.descriptionAuth.color(
                colors.description))
            SpacerHeight(12.dp)
            TextFieldFormOtherValue(otherStatus, "Другая форма мероприятия", otherStatus == event.status, {
                if (otherStatus == "") {
                    vm.updData(copy(event = event.copy(status = "")))
                } else {
                    vm.updData(copy(event = event.copy(status = otherStatus)))
                }
            }) {
                vm.updData(copy(event = event.copy(status = it), otherStatus = it))
            }
            SpacerHeight(20.dp)
            Text("Результат", style = typography.titleMain.color(colors.title))
            SpacerHeight(12.dp)
            OptionsChooseFrom(listResult, event.result) {
                vm.updData(copy(event = event.copy(result = it)))
                focusManager.clearFocus()
            }
            SpacerHeight(12.dp)
            Text("Если ни один вариант в списке не подошёл, введите вручную", style = typography.descriptionAuth.color(
                colors.description))
            SpacerHeight(12.dp)
            TextFieldFormOtherValue(otherResult, "Другая форма мероприятия", otherResult == event.result, {
                if (otherResult == "") {
                    vm.updData(copy(event = event.copy(result = "")))
                } else {
                    vm.updData(copy(event = event.copy(result = otherStatus)))
                }
            }) {
                vm.updData(copy(event = event.copy(result = it), otherResult = it))
            }
            SpacerHeight(20.dp)
            Text("Дата", style = typography.titleMain.color(colors.title))
            SpacerHeight(12.dp)
            DatePickerRow(chosenDay, chosenMonth, chosenYear) {
                vm.updData(copy(showDatePicker = true))
            }
            SpacerHeight(20.dp)
            Text("Подтверждение документа (при наличии)", style = typography.titleMain.color(colors.title))
            SpacerHeight(12.dp)
            Text("Загрузите файлы поддерживаемого типа.\nРазмер файла – не более 200 MB.", style = typography.descriptionAuth.color(colors.description))
            SpacerHeight(12.dp)
            ButtonMaxWidth ("Выбрать файлы", true, colors.primary) {
                fileLauncher.launch("*/*")
            }
            SpacerHeight(20.dp)
            if(uploadedFiles.isNotEmpty()) {
                Text(
                    "Загруженные файлы (${uploadedFiles.size})",
                    style = MethodistTheme.typography.titleMain.color(colors.title)
                )
                Spacer(modifier = Modifier.height(8.dp))
                UploadedFilesList(
                    files = uploadedFiles,
                    onRemove = { file ->
                        vm.updData(stateData.copy(uploadedFiles = uploadedFiles - file))
                    }
                )
                SpacerHeight(12.dp)
            }
            ButtonNext {
                vm.createEvent(controller)
            }
            SpacerHeight(120.dp)
        }
    }
}


@Composable
fun UploadedFilesList(
    files: List<UiFile>,
    onRemove: (UiFile) -> Unit
) {
    if (files.isEmpty()) {
        Text(
            text = "Нет загруженных файлов",
            style = MethodistTheme.typography.descriptionAuth.color(colors.description)
        )
        return
    }

    files.forEach { file ->
        UploadedFileItem(file, onRemove)
    }
}

@Composable
fun UploadedFileItem(
    file: UiFile,
    onRemove: (UiFile) -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(4.dp),
        border = BorderStroke(1.dp, colors.primary),
        colors = CardDefaults.cardColors(
            containerColor = colors.container
        )
    ) {
        Row(
            modifier = Modifier.padding(8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Иконка файла (в зависимости от типа)
            FileIcon(file.name)

            Spacer(modifier = Modifier.width(12.dp))

            // Название и размер
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = file.name,
                    style = MethodistTheme.typography.textButton.color(colors.title),
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
                file.size?.let {
                    Text(
                        text = formatFileSize(it),
                        style = MethodistTheme.typography.textInFiled,
                        color = colors.primary
                    )
                }
            }

            // Кнопка удаления
            IconButton(onClick = { onRemove(file) }) {
                Icon(
                    imageVector = Icons.Default.Delete,
                    contentDescription = "Удалить",
                    tint = colors.error
                )
            }
        }
    }
}

@Composable
fun FileIcon(fileName: String) {
    val icon: ImageVector = when {
        fileName.contains(".pdf") -> ImageVector.vectorResource(R.drawable.icon_png)
        fileName.contains(".doc") -> ImageVector.vectorResource(R.drawable.icon_png)
        fileName.contains(".jpeg", ignoreCase = true) -> ImageVector.vectorResource(R.drawable.icon_jpeg)
        fileName.contains(".png", ignoreCase = true) -> ImageVector.vectorResource(R.drawable.icon_png)
        else -> ImageVector.vectorResource(R.drawable.icon_vopros)
    }

    Icon(
        imageVector = icon,
        contentDescription = null,
        modifier = Modifier.size(32.dp),
        tint = Color.Unspecified
    )
}

fun formatFileSize(size: Long): String {
    return when {
        size < 1024 -> "$size B"
        size < 1024 * 1024 -> "${size / 1024} KB"
        else -> "${size / (1024 * 1024)} MB"
    }
}

@SuppressLint("Range")
fun Uri.getFileSize(context: Context): Long? {
    return context.contentResolver.query(this, null, null, null, null)?.use { cursor ->
        cursor.moveToFirst()
        cursor.getLong(cursor.getColumnIndex(OpenableColumns.SIZE))
    }
}

data class UiFile(
    val uri: Uri,
    val name: String,
    val size: Long? = null,
    val icon: ImageVector? = null
)


/** URI (Uniform Resource Identifier) — это строка, которая идентифицирует какой-либо ресурс (файл, изображение, документ, веб-страницу и т. д.).
 * А этот метод, это расширение функции (extension function) для класса Uri, которое получает имя файла из URI (Uniform Resource Identifier)
 * */
@SuppressLint("Range")
fun Uri.getFileName(context: Context): String {
    var name: String? = null
    val cursor = context.contentResolver.query(this, null, null, null, null)
    cursor?.use {
        it.moveToFirst()
        name = it.getString(it.getColumnIndex(OpenableColumns.DISPLAY_NAME))
    }
    cursor?.close()
    return name ?: this.path?.substringAfterLast('/') ?: "Неизвестный файл"
}

