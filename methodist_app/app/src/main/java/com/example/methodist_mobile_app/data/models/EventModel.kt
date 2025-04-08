package com.example.methodist_mobile_app.data.models

import androidx.room.Entity
import androidx.room.PrimaryKey
import kotlinx.serialization.Serializable

@Entity(tableName = "events")
@Serializable
data class EventModel(
    @PrimaryKey
    var id: String,
    var dateOfEvent: String,
    var endDateOfEvent: String,
    var formOfEvent: String,
    var formOfParticipation: String,
    var isApproved: Boolean,
    var isChecked: Boolean,
    var location: String,
    var name: String,
    var profileId: String,
    var quantityOfHours: String,
    var result: String,
    var status: String,
    var typeOfEvent: TypeOfEventModel,
    var type: String
)

