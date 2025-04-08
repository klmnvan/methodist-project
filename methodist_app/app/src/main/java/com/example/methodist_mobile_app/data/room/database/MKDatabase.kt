package com.example.methodist_mobile_app.data.room.database

import androidx.room.Database
import androidx.room.RoomDatabase
import androidx.room.TypeConverters
import com.example.methodist_mobile_app.data.models.EventModel
import com.example.methodist_mobile_app.data.models.MKModel
import com.example.methodist_mobile_app.data.models.ProfileModel
import com.example.methodist_mobile_app.data.models.TypeOfEventModel
import com.example.methodist_mobile_app.data.room.converters.Converters
import com.example.methodist_mobile_app.data.room.dao.EventDao
import com.example.methodist_mobile_app.data.room.dao.MKDao
import com.example.methodist_mobile_app.data.room.dao.ProfileDao
import com.example.methodist_mobile_app.data.room.dao.TypeOfEventDao

@Database(
    entities = [EventModel::class, ProfileModel::class, MKModel::class, TypeOfEventModel::class],
    version = 1,
    exportSchema = false
)
@TypeConverters(Converters::class)
abstract class MKDatabase: RoomDatabase() {

    abstract val eventDao: EventDao
    abstract val typeOfEventDao: TypeOfEventDao
    abstract val profileDao: ProfileDao
    abstract val mkDao: MKDao

}