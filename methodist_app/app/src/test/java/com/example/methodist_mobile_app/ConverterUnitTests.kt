package com.example.methodist_mobile_app

import com.example.methodist_mobile_app.presentation.ui.theme.convertDateToTimestamptz
import com.example.methodist_mobile_app.presentation.ui.theme.convertTimestamptzToCalendarDate
import org.junit.Test

import org.junit.Assert.*
import java.time.LocalDateTime
import java.time.ZoneOffset
import java.time.ZonedDateTime
import java.time.format.DateTimeFormatter

/**
 * Example local unit test, which will execute on the development machine (host).
 *
 * See [testing documentation](http://d.android.com/tools/testing).
 */
class ConverterUnitTests {

    @Test
    fun ConvertTimestamptzToCalendarDate_ConvertDate_Returned_15_04_2025() {
        // Arrange
        val inputDateFromDb = "2025-04-15T16:06:08.688Z" //дата в том формате, в котором приходит из БД
        val expectedFormattedDate = "15.04.2025" //ожидаемый формат даты
        //Act
        val actualFormattedDate = inputDateFromDb.convertTimestamptzToCalendarDate() //функция конвертациии даты
        //Assert
        assertEquals(expectedFormattedDate, actualFormattedDate) //проверка равенства ожидаемого и получаемого результата
    }

    @Test
    fun convertDateToTimestamptz_ValidInput_ReturnsCorrectTimestamp() {
        // Arrange
        val chosenYear = 2024
        val chosenMonth = 11  // Ноябрь
        val chosenDay = 26

        // Act
        val result = convertDateToTimestamptz(chosenYear, chosenMonth, chosenDay)

        // Assert
        // проверяем только начало строки (год, месяц, день)
        assertTrue(
            "Таймстамп должен начинаться с '2024-11-26T'",
            result.startsWith("2024-11-26T")
        )

        // Проверяем общий формат
        val timestampPattern = Regex("""^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$""")
        assertTrue(
            "Таймстамп должен соответствовать формату yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
            timestampPattern.matches(result)
        )
    }


}