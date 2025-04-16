package com.example.methodist_mobile_app.data.models

import androidx.room.Entity
import androidx.room.PrimaryKey
import kotlinx.serialization.Serializable

@Entity(tableName = "profiles")
@Serializable
data class ProfileModel(
    @PrimaryKey
    var id: String = "",
    var firstName: String = "",
    var lastName: String = "",
    var patronymic: String = "",
    var mc: MKModel? = null,
    var imageUrl: String = "",
    var email: String = "",
    var roles: List<String>? = listOf(),
)