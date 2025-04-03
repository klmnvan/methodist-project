package com.example.methodist_mobile_app.presentation.screens

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.vectorResource
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavHostController
import com.example.methodist_mobile_app.R
import com.example.methodist_mobile_app.presentation.common.spacers.SpacerHeight
import com.example.methodist_mobile_app.presentation.ui.theme.MethodistTheme.colors
import com.example.methodist_mobile_app.presentation.ui.theme.MethodistTheme.typography
import com.example.methodist_mobile_app.presentation.ui.theme.color

@Composable
fun Splash(controller: NavHostController, vm: SplashVM = hiltViewModel()) {

    LaunchedEffect(Unit) {
        vm.launch(controller)
    }

    Box(
        Modifier
            .fillMaxSize().background(colors.background)
            .padding(horizontal = 30.dp), contentAlignment = Alignment.Center) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {

            Image(
                imageVector = ImageVector.vectorResource(R.drawable.splash_logo),
                contentDescription = "",
                Modifier.fillMaxWidth(),
                contentScale = ContentScale.FillWidth
            )
            SpacerHeight(12.dp)
            Text("Beta version", style = typography.splashHint.color(colors.primary))
        }

    }

}

