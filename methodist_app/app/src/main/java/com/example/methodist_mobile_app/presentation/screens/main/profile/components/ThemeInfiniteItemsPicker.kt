package com.example.methodist_mobile_app.presentation.screens.main.profile.components

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.example.methodist_mobile_app.domain.repository.UserRepository
import com.example.methodist_mobile_app.presentation.common.spacers.SpacerHeight
import com.example.methodist_mobile_app.presentation.ui.theme.MethodistTheme
import com.example.methodist_mobile_app.presentation.ui.theme.color
import com.example.methodist_mobile_app.presentation.ui.theme.typography

@Composable
fun ThemeInfiniteItemsPicker(
    items: List<String>,
    firstIndex: Int,
    onItemSelected: (String) -> Unit,
) {

    val listState = rememberLazyListState(firstIndex)
    var currentValue = UserRepository.theme

    LaunchedEffect(key1 = !listState.isScrollInProgress) {
        onItemSelected(currentValue)
        listState.animateScrollToItem(index = listState.firstVisibleItemIndex)
    }

    Column(
        modifier = Modifier
            .height(106.dp)
            .fillMaxWidth(), horizontalAlignment = Alignment.CenterHorizontally
    ) {
        LazyColumn(
            modifier = Modifier
                .weight(1f),
            horizontalAlignment = Alignment.CenterHorizontally,
            state = listState,
            content = {
                items(count = Int.MAX_VALUE, itemContent = {
                    val index = it % items.size
                    if (it == listState.firstVisibleItemIndex + 1) {
                        currentValue = items[index]
                    }
                    SpacerHeight(6.dp)
                    Text(
                        text = items[index],
                        modifier = Modifier
                            .alpha(if (it == listState.firstVisibleItemIndex + 1) 1f else 0.3f)
                            .weight(1f),
                        style = typography.hintScreen.color(MethodistTheme.colors.hint),
                        textAlign = TextAlign.Center
                    )
                    SpacerHeight(6.dp)
                })
            }
        )
    }
}