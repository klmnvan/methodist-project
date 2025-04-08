package com.example.methodist_mobile_app.data.room.dao

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import com.example.methodist_mobile_app.data.models.EventModel
import kotlinx.coroutines.flow.Flow

@Dao
interface EventDao {

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    fun insert(items: List<EventModel>)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    fun insert(item: EventModel)

    @Delete
    fun delete(item: EventModel)

    @Query("DELETE FROM events")
    fun deleteAll()

    @Query("SELECT * FROM events")
    fun getAll(): Flow<List<EventModel>>

    @Update(onConflict = OnConflictStrategy.REPLACE)
    fun update(item: EventModel)

}


