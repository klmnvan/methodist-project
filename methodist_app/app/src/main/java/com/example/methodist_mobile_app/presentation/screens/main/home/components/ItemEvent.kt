package com.example.methodist_mobile_app.presentation.screens.main.home.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Divider
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.res.vectorResource
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.methodist_mobile_app.R
import com.example.methodist_mobile_app.data.models.EventModel
import com.example.methodist_mobile_app.presentation.common.spacers.SpacerHeight
import com.example.methodist_mobile_app.presentation.ui.theme.Black
import com.example.methodist_mobile_app.presentation.ui.theme.MethodistTheme
import com.example.methodist_mobile_app.presentation.ui.theme.convertDate
import com.example.methodist_mobile_app.presentation.ui.theme.firstCharUp

@Composable
fun ItemEvent(event: EventModel, onClick: () -> Unit) {

    val title = getTitleEvent(event)
    val description = getDescriptionEvent(event)

    Column(modifier = Modifier
        .shadow(
            elevation = 4.dp,
            shape = RoundedCornerShape(15),
            spotColor = Color(Black.value)
        )
        .clickable {
            onClick()
        }
        .background(
            color = MethodistTheme.colors.container,
            shape = RoundedCornerShape(15)
        )
        .padding(vertical = 16.dp, horizontal = 18.dp)
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Icon(
                imageVector = ImageVector.vectorResource(R.drawable.icon_event),
                contentDescription = "",
                modifier = Modifier
                    .size(40.dp)
                    .fillMaxWidth(),
                tint = getColorIconEvent(category = event.typeOfEvent.name)
            )
            Spacer(modifier = Modifier.width(8.dp))
            Column(
                modifier = Modifier
                    .weight(1f)
                    .align(Alignment.CenterVertically)
            ) {
                Text(
                    text = title.firstCharUp(),
                    modifier = Modifier.padding(bottom = 2.dp),
                    style = MethodistTheme.typography.titleMain.copy(
                        color = MethodistTheme.colors.title,
                        fontSize = 16.sp
                    ),
                    overflow = TextOverflow.Ellipsis,
                    maxLines = 1
                )
                Text(
                    text = event.typeOfEvent.name.firstCharUp(),
                    style = MethodistTheme.typography.hintEventItem.copy(color = MethodistTheme.colors.vector)
                )
            }
            Spacer(modifier = Modifier.width(8.dp))
            Text(
                text = event.dateOfEvent.convertDate(),
                modifier = Modifier
                    .align(Alignment.CenterVertically)
                    .padding(top = 3.dp),
                style = MethodistTheme.typography.dateInItemEvent.copy(color = MethodistTheme.colors.title)
            )
        }
        Divider(
            modifier = Modifier.padding(vertical = 10.dp),
            color = MethodistTheme.colors.primary,
            thickness = 0.5.dp
        )
        Text(
            text = description.firstCharUp(),
            style = MethodistTheme.typography.descriptionAuth.copy(color = MethodistTheme.colors.title)
        )
    }
    SpacerHeight(8.dp)
}