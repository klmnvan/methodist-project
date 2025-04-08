package com.example.methodist_mobile_app.data.room.dao

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import com.example.methodist_mobile_app.data.models.TypeOfEventModel
import kotlinx.coroutines.flow.Flow

@Dao
interface TypeOfEventDao {

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    fun insert(items: List<TypeOfEventModel>)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    fun insert(item: TypeOfEventModel)

    @Delete
    fun delete(item: TypeOfEventModel)

    @Query("DELETE FROM typeOfEvents")
    fun deleteAll()

    @Query("SELECT * FROM typeOfEvents")
    fun getAll(): Flow<List<TypeOfEventModel>>

    @Query("SELECT * FROM typeOfEvents WHERE id = :id")
    fun selectById(id: String): TypeOfEventModel?

    @Update(onConflict = OnConflictStrategy.REPLACE)
    fun update(item: TypeOfEventModel)

}