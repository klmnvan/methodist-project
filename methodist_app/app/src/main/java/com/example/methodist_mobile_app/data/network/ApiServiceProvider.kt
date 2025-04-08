package com.example.methodist_mobile_app.data.network

import android.content.Context
import androidx.room.Room
import com.example.methodist_mobile_app.data.room.converters.Converters
import com.example.methodist_mobile_app.data.room.database.MKDatabase
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import io.ktor.client.HttpClient
import io.ktor.client.engine.android.Android
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.client.plugins.logging.LogLevel
import io.ktor.client.plugins.logging.Logging
import io.ktor.http.ContentType
import io.ktor.serialization.kotlinx.KotlinxSerializationConverter
import io.ktor.serialization.kotlinx.json.json
import kotlinx.serialization.json.Json

/** Hilt Модуль, в котором описано как получать зависимость  с типом ApiServiceImpl  */
@Module
@InstallIn(SingletonComponent::class)
class ApiServiceProvider {

    @Provides
    fun provideClient(): HttpClient {
        return HttpClient(Android){
            expectSuccess = true
            install(Logging) {
                level = LogLevel.ALL
            }
            install(ContentNegotiation){
                json(
                    Json {
                        encodeDefaults = false
                        ignoreUnknownKeys = true
                        isLenient = true
                        useAlternativeNames = false
                    })
                register(
                    ContentType.Text.Html, KotlinxSerializationConverter(
                        Json {
                            prettyPrint = true
                            isLenient = true
                            ignoreUnknownKeys = true
                        }
                    )
                )
            }
        }
    }

    @Provides
    fun provideConverters(): Converters {
        return Converters() // Пока без базы
    }

    @Provides
    fun provideDb(
        @ApplicationContext context: Context,
        converters: Converters // Получаем конвертер
    ): MKDatabase {
        val db = Room.databaseBuilder(
            context,
            MKDatabase::class.java,
            "mk_database"
        )
            .allowMainThreadQueries()
            .addTypeConverter(converters) // Передаём конвертер
            .build()

        converters.setDatabase(db) // Теперь конвертер знает о базе
        return db
    }

    @Provides
    fun provideService(client: HttpClient, database: MKDatabase): ApiServiceImpl {
        return ApiServiceImpl(client, database)
    }

}