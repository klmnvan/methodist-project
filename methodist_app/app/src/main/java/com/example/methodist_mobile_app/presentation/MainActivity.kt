package com.example.methodist_mobile_app.presentation

import android.Manifest
import android.annotation.SuppressLint
import android.content.Context
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Bundle
import android.provider.OpenableColumns
import androidx.activity.ComponentActivity
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Build
import androidx.compose.material.icons.filled.Clear
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Divider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.MutableState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.vectorResource
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.core.content.ContextCompat
import androidx.navigation.compose.rememberNavController
import androidx.room.Delete
import com.example.methodist_mobile_app.R
import com.example.methodist_mobile_app.domain.repository.UserRepository
import com.example.methodist_mobile_app.presentation.navigation.Navigation
import com.example.methodist_mobile_app.presentation.navigation.bottombar.BottomBar
import com.example.methodist_mobile_app.presentation.ui.theme.MethodistTheme
import com.example.methodist_mobile_app.presentation.ui.theme.MethodistTheme.colors
import com.example.methodist_mobile_app.presentation.ui.theme.MethodistTheme.typography
import com.example.methodist_mobile_app.presentation.ui.theme.ThemeMode
import com.example.methodist_mobile_app.presentation.ui.theme.color
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    @SuppressLint("UnusedMaterial3ScaffoldPaddingParameter")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            UserRepository.init(LocalContext.current)
            UserRepository.checkToken()
            val controller = rememberNavController()
            val currentThemeMode: MutableState<ThemeMode> = remember { mutableStateOf(UserRepository.themes.first { it.title == UserRepository.theme }) }
            val isBottomBarVisible = remember { mutableStateOf(false) }
            MethodistTheme (themeMode = currentThemeMode.value) {
                Scaffold(
                    bottomBar = {
                        if (isBottomBarVisible.value) {
                            BottomBar(
                                navController = controller,
                            )
                        }
                    }
                ) {
                    Navigation(controller, currentThemeMode, isBottomBarVisible)
                }
            }
            //FileUploadScreen()
        }
    }
}
//
//@Composable
//fun FileUploadScreen() {
//    var uploadedFiles by remember { mutableStateOf<List<UiFile>>(emptyList()) }
//    val context = LocalContext.current
//
//    val fileLauncher = rememberLauncherForActivityResult(
//        contract = ActivityResultContracts.GetMultipleContents(),
//        onResult = { uris ->
//            val newFiles = uris.map { uri ->
//                UiFile(
//                    uri = uri,
//                    name = uri.getFileName(context),
//                    size = uri.getFileSize(context)
//                )
//            }
//            uploadedFiles = (uploadedFiles + newFiles)
//                .distinctBy { it.uri }
//        }
//    )
//
//    Column(modifier = Modifier.padding(vertical = 160.dp, horizontal = 20.dp)) {
//        Button(
//            onClick = { fileLauncher.launch("*/*") },
//            modifier = Modifier.fillMaxWidth()
//        ) {
//            Text("Выбрать файлы")
//        }
//
//        Spacer(modifier = Modifier.height(16.dp))
//
//        Text(
//            "Загруженные файлы (${uploadedFiles.size})",
//            style = typography.titleMain
//        )
//
//        Spacer(modifier = Modifier.height(8.dp))
//
//        UploadedFilesList(
//            files = uploadedFiles,
//            onRemove = { file ->
//                uploadedFiles = uploadedFiles - file
//            }
//        )
//
//        Button(
//            onClick = { /* Отправка */ },
//            modifier = Modifier
//                .fillMaxWidth()
//                .padding(top = 24.dp),
//            enabled = uploadedFiles.isNotEmpty()
//        ) {
//            Text("Сохранить на сервере")
//        }
//    }
//}
//
//// Расширение для получения имени файла из Uri
//


