package com.example.methodist_mobile_app.data.room.dao

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import com.example.methodist_mobile_app.data.models.MKModel
import kotlinx.coroutines.flow.Flow

@Dao
interface MKDao {

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    fun insert(items: List<MKModel>)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    fun insert(item: MKModel)

    @Delete
    fun delete(item: MKModel)

    @Query("DELETE FROM methodicalСommittees")
    fun deleteAll()

    @Query("SELECT * FROM methodicalСommittees")
    fun getAll(): Flow<List<MKModel>>

    @Query("SELECT * FROM methodicalСommittees WHERE id = :id")
    fun getById(id: String): MKModel

    @Update(onConflict = OnConflictStrategy.REPLACE)
    fun update(item: MKModel)

}