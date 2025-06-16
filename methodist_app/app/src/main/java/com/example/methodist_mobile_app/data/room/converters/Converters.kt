package com.example.methodist_mobile_app.data.room.converters

import androidx.room.ProvidedTypeConverter
import androidx.room.TypeConverter
import com.example.methodist_mobile_app.data.models.MKModel
import com.example.methodist_mobile_app.data.models.ProfileModel
import com.example.methodist_mobile_app.data.models.TypeOfEventModel
import com.example.methodist_mobile_app.data.room.database.MKDatabase
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json

@ProvidedTypeConverter
class Converters {

    private var database: MKDatabase? = null

    fun setDatabase(database: MKDatabase) {
        this.database = database
    }

    @TypeConverter
    fun fromTypeOfEventModel(typeOfEvent: TypeOfEventModel): String {
        return typeOfEvent.id
    }

    @TypeConverter
    fun toTypeOfEventModel(typeOfEventId: String): TypeOfEventModel {
        val dao = database?.typeOfEventDao
        return dao?.selectById(typeOfEventId)
            ?: TypeOfEventModel(id = typeOfEventId, name = "Unknown")
    }

    @TypeConverter
    fun fromMKModel(mk: MKModel?): String? {
        return mk?.id
    }

    @TypeConverter
    fun fromProfile(p: ProfileModel?): String? {
        return p?.id
    }

    @TypeConverter
    fun toProfileModel(pId: String?): ProfileModel? {
        if(pId != null) {
            val dao = database?.profileDao
            return dao?.getByIdSingle(pId)
                ?: ProfileModel(id = pId)
        }
        return null
    }

    @TypeConverter
    fun toMKModel(mkId: String?): MKModel? {
        if(mkId != null) {
            val dao = database?.mkDao
            return dao?.getById(mkId)
                ?: MKModel(id = mkId, name = "Unknown", headId = "Unknown")
        }
        return null
    }

    private val json = Json { ignoreUnknownKeys = true } // Настройки JSON

    @TypeConverter
    fun fromRolesList(roles: List<String>?): String? {
        return roles?.let { json.encodeToString(it) }
    }

    @TypeConverter
    fun toRolesList(rolesString: String?): List<String>? {
        return rolesString?.let { json.decodeFromString(it) }
    }

}