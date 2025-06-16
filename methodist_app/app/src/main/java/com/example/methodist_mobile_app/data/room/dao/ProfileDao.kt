package com.example.methodist_mobile_app.data.room.dao

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import com.example.methodist_mobile_app.data.models.ProfileModel
import kotlinx.coroutines.flow.Flow

@Dao
interface ProfileDao {

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    fun insert(items: List<ProfileModel>)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    fun insert(item: ProfileModel)

    @Delete
    fun delete(item: ProfileModel)

    @Query("DELETE FROM profiles")
    fun deleteAll()

    @Query("SELECT * FROM profiles")
    fun getAll(): Flow<List<ProfileModel>>

    @Query("SELECT * FROM profiles WHERE id = :id")
    fun getById(id: String): Flow<List<ProfileModel>>

    @Query("SELECT * FROM profiles WHERE id = :id")
    fun getByIdSingle(id: String): ProfileModel

    @Update(onConflict = OnConflictStrategy.REPLACE)
    fun update(item: ProfileModel)

}

