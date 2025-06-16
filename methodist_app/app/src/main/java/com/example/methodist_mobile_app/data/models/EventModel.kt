package com.example.methodist_mobile_app.data.models

import androidx.room.Entity
import androidx.room.PrimaryKey
import kotlinx.serialization.Serializable

@Entity(tableName = "events")
@Serializable
data class EventModel(
    @PrimaryKey
    var id: String,
    var createdAt: String,
    var updatedAt: String,
    var dateOfEvent: String,
    var endDateOfEvent: String,
    var typeOfEvent: TypeOfEventModel,
    var isApproved: Boolean,
    var type: String,
    var name: String,
    var formOfParticipation: String,
    var formOfEvent: String,
    var status: String,
    var location: String,
    var quantityOfHours: String,
    var result: String,
    var profile: ProfileModel,
)

