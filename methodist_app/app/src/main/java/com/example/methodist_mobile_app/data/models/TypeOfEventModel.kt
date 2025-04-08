package com.example.methodist_mobile_app.data.models

import androidx.room.Entity
import androidx.room.PrimaryKey
import kotlinx.serialization.Serializable

@Entity(tableName = "typeOfEvents")
@Serializable
data class TypeOfEventModel(
    @PrimaryKey
    var id: String,
    var name: String
)