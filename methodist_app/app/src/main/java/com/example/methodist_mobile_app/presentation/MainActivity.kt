package com.example.methodist_mobile_app.presentation

import android.annotation.SuppressLint
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.MutableState
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.platform.LocalContext
import androidx.navigation.compose.rememberNavController
import com.example.methodist_mobile_app.domain.repository.UserRepository
import com.example.methodist_mobile_app.presentation.navigation.Navigation
import com.example.methodist_mobile_app.presentation.navigation.bottombar.BottomBar
import com.example.methodist_mobile_app.presentation.ui.theme.MethodistTheme
import com.example.methodist_mobile_app.presentation.ui.theme.ThemeMode
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
                    //ImageTest()
                }
            }
        }
    }
}

/*
@Composable
fun ImageTest() {
//картинка
    Column(modifier = Modifier.fillMaxSize(), verticalArrangement = Arrangement.Center, horizontalAlignment = Alignment.CenterHorizontally) {
        val imgState = rememberAsyncImagePainter(
            model = ImageRequest.Builder(LocalContext.current)
                .data("http://10.0.2.2:80/Profile/Uploads/01960023-d405-7f7b-99c5-664f258d74ba_photo_2025-02-23_20-04-49.jpg")
                .size(Size.ORIGINAL).build()
        ).state
        if (imgState is AsyncImagePainter.State.Success) {
            Image(
                modifier = Modifier
                    .fillMaxWidth(1f)
                    .clip(RoundedCornerShape(15.dp)),
                painter = imgState.painter,
                contentDescription = "",
                contentScale = ContentScale.Crop
            )
        }
        else {
            Box(modifier = Modifier.fillMaxWidth(), contentAlignment = Alignment.Center) {
                CircularProgressIndicator()
            }
        }
    }
}*/
