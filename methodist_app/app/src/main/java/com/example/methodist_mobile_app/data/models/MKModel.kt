package com.example.methodist_mobile_app.data.models

import androidx.room.Entity
import androidx.room.PrimaryKey
import kotlinx.serialization.Serializable

@Entity(tableName = "methodicalСommittees")
@Serializable
data class MKModel(
    @PrimaryKey
    var id: String,
    var name: String,
    var headId: String?,
)