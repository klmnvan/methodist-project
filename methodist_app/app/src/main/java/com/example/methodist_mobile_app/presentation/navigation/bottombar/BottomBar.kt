package com.example.methodist_mobile_app.presentation.navigation.bottombar

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.res.vectorResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.NavHostController
import androidx.navigation.compose.currentBackStackEntryAsState
import com.example.methodist_mobile_app.presentation.ui.theme.Black
import com.example.methodist_mobile_app.presentation.ui.theme.MethodistTheme.colors
import com.example.methodist_mobile_app.presentation.ui.theme.color
import com.example.methodist_mobile_app.presentation.ui.theme.typography

@Composable
fun BottomBar(
    navController: NavHostController, modifier: Modifier = Modifier
) {
    val screens = listOf(
        DestinationsBottomBar.HomeScreen,
        DestinationsBottomBar.CreateEventScreen,
        DestinationsBottomBar.ProfileScreen
    )
    Box(modifier = Modifier) {
        NavigationBar(
            modifier = modifier,
            containerColor = colors.container,
        ) {
            val navBackStackEntry by navController.currentBackStackEntryAsState()
            val currentRoute = navBackStackEntry?.destination?.route

            screens.forEach { screen ->
                if (screen.route == "event_screen") {

                } else {
                    Column(modifier = Modifier
                        .weight(1f)
                        .clickable(
                            interactionSource = remember { MutableInteractionSource() },
                            indication = null
                        ) {
                            navController.navigate(screen.route) {
                                popUpTo(navController.graph.findStartDestination().id) {
                                    saveState = true
                                }
                                launchSingleTop = true
                                restoreState = true
                            }
                        }, horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        var selectedColor = colors.category
                        if (currentRoute == screen.route) {
                            selectedColor = colors.primary
                        }
                        Spacer(modifier = Modifier.height(12.dp))
                        Icon(
                            imageVector = ImageVector.vectorResource(id = screen.resourceId!!),
                            modifier = Modifier.size(30.dp),
                            contentDescription = "", tint = selectedColor
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(text = screen.title, style = typography.menuCategory.color(selectedColor))
                    }
                }
            }
        }
        Icon(imageVector = ImageVector.vectorResource(id = screens[1].resourceId!!),
            tint = Color.Unspecified,
            modifier = Modifier.align(Alignment.TopCenter)
                .size(70.dp)
                .offset(y = (-16).dp)
                .background(Color.Transparent).shadow(
                    elevation = 5.dp, shape = RoundedCornerShape(100), spotColor = Color(
                        Black.value
                    ), ambientColor = Color(Black.value)
                )
                .clickable(
                    interactionSource = remember { MutableInteractionSource() },
                    indication = null
                ) {
                    navController.navigate(screens[1].route) {
                        popUpTo(navController.graph.findStartDestination().id) {
                            saveState = true
                        }
                        launchSingleTop = true
                        restoreState = true
                    }
                },
            contentDescription = ""
        )

    }

}