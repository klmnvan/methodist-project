package com.example.methodist_mobile_app.presentation.screens.main.home

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.IntrinsicSize
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Divider
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavHostController
import com.example.methodist_mobile_app.presentation.common.dialogs.DialogError
import com.example.methodist_mobile_app.presentation.common.spacers.SpacerHeight
import com.example.methodist_mobile_app.presentation.common.spacers.SpacerWidth
import com.example.methodist_mobile_app.presentation.screens.main.home.components.ButtonFilter
import com.example.methodist_mobile_app.presentation.screens.main.home.components.Filters
import com.example.methodist_mobile_app.presentation.screens.main.home.components.ItemCategory
import com.example.methodist_mobile_app.presentation.screens.main.home.components.ItemEvent
import com.example.methodist_mobile_app.presentation.screens.main.home.components.SearchTextField
import com.example.methodist_mobile_app.presentation.ui.theme.MethodistTheme.colors
import com.example.methodist_mobile_app.presentation.ui.theme.MethodistTheme.typography
import com.example.methodist_mobile_app.presentation.ui.theme.color

@Composable
fun Home(controller: NavHostController, vm: HomeVM = hiltViewModel()) {

    val stateData = vm.dataSt.collectAsState().value
    val stateDialog = vm.dialogSt.collectAsState().value

    if(stateDialog.dialogIsOpen) {
        DialogError(stateDialog.title, stateDialog.description) {
            vm.updDialog(stateDialog.copy(dialogIsOpen = false))
        }
    }

    with(stateData) {

        //Отслеживаем строку поиска и выбранную категорию
        LaunchedEffect(selectedCategory, search, events, sortedType) {
            vm.filterList()
        }

        Column (
            modifier = Modifier
                .fillMaxSize()
                .background(colors.background)
                .padding(horizontal = 20.dp, vertical = 40.dp)
        ) {
            Spacer(modifier = Modifier.height(24.dp))
            Row(
                modifier = Modifier.fillMaxWidth().height(IntrinsicSize.Min)
            ) {
                SearchTextField(search, "Поиск") {
                    vm.updData(copy(search = it))
                }
                SpacerWidth(8.dp)
                ButtonFilter(filtersIsOpen) {
                    vm.updData(copy(filtersIsOpen = !filtersIsOpen))
                }
            }
            if(filtersIsOpen) {
                Spacer(modifier = Modifier.height(16.dp))
                Filters(listSortedType, sortedType) {
                    vm.updData(copy(sortedType = it))
                }
                Spacer(modifier = Modifier.height(12.dp))
                Divider(thickness = 0.5.dp, color = colors.primary)
                Spacer(modifier = Modifier.height(12.dp))
                Text(text = "Категории", style = typography.titleMain.color(colors.title))
                Spacer(modifier = Modifier.height(8.dp))
                LazyRow(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    items(categories) { category ->
                        ItemCategory(category, category == selectedCategory) {
                            vm.updData(copy(selectedCategory = category))
                        }
                    }
                }
            }
            Spacer(modifier = Modifier.height(20.dp))
            Text(text = "Пройденные мероприятия", style = typography.titleMain.color(colors.title))
            Spacer(modifier = Modifier.height(12.dp))
            LazyColumn(modifier = Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                items(eventsShow) { event ->
                    ItemEvent(event) {
                        //showDialog = true
                    }
                }
                item {
                    SpacerHeight(100.dp)
                }
            }
        }
    }

}

