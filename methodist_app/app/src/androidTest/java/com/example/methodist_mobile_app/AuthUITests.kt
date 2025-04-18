package com.example.methodist_mobile_app

import android.content.Context
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.runtime.Composable
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.test.isDisplayed
import androidx.compose.ui.test.junit4.createComposeRule
import androidx.compose.ui.test.onNodeWithText
import androidx.compose.ui.test.performClick
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.room.Room
import androidx.test.platform.app.InstrumentationRegistry
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.example.methodist_mobile_app.data.network.ApiServiceImpl
import com.example.methodist_mobile_app.data.room.converters.Converters
import com.example.methodist_mobile_app.data.room.database.MKDatabase
import com.example.methodist_mobile_app.domain.repository.UserRepository
import com.example.methodist_mobile_app.presentation.navigation.NavRoutes
import com.example.methodist_mobile_app.presentation.screens.auth.login.Login
import com.example.methodist_mobile_app.presentation.screens.auth.login.LoginVM
import com.example.methodist_mobile_app.presentation.screens.auth.register.Register
import com.example.methodist_mobile_app.presentation.screens.auth.register.RegisterVM
import io.ktor.client.HttpClient
import io.ktor.client.engine.android.Android
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.client.plugins.logging.LogLevel
import io.ktor.client.plugins.logging.Logging
import io.ktor.http.ContentType
import io.ktor.serialization.kotlinx.KotlinxSerializationConverter
import io.ktor.serialization.kotlinx.json.json
import kotlinx.serialization.json.Json

import org.junit.Test
import org.junit.runner.RunWith

import org.junit.Assert.*
import org.junit.Rule

/**
 * Instrumented test, which will execute on an Android device.
 *
 * See [testing documentation](http://d.android.com/tools/testing).
 */
@RunWith(AndroidJUnit4::class)
class AuthUITests {

    val client = HttpClient(Android) {
        expectSuccess = true
        install(Logging) {
            level = LogLevel.ALL
        }
        install(ContentNegotiation) {
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

    lateinit var context: Context
    lateinit var service: ApiServiceImpl
    lateinit var database: MKDatabase
    lateinit var registerVM: RegisterVM
    lateinit var loginVM: LoginVM

    @get:Rule
    val composeTestRule =
        createComposeRule() //это функция, которая создает правило для тестирования Jetpack Compose UI компонентов.

    @Test
    fun UseAppContext() {
        val appContext = InstrumentationRegistry.getInstrumentation().targetContext
        assertEquals("com.example.methodist_mobile_app", appContext.packageName)
    }

    @Test
    fun Login_TryLoginEmptyTextFields_ShowError() {
        composeTestRule.setContent {
            context = LocalContext.current
            val converters = Converters()
            database = Room.databaseBuilder(
                context,
                MKDatabase::class.java,
                "mk_database"
            )
                .allowMainThreadQueries()
                .addTypeConverter(converters) // Передаём конвертер
                .build()

            converters.setDatabase(database)
            service = ApiServiceImpl(client, database, context)
            loginVM = LoginVM(service)
            TestNavigation(NavRoutes.LOGIN)
        }
        composeTestRule.onNodeWithText("Далее").performClick()
        composeTestRule.onNodeWithText("Ошибка заполнения полей").isDisplayed()
        composeTestRule.onNodeWithText("Не все поля заполнены").isDisplayed()
    }

    @Test
    fun Register_TryRegisterEmptyTextFields_ShowError() {
        composeTestRule.setContent {
            context = LocalContext.current
            val converters = Converters()
            database = Room.databaseBuilder(
                context,
                MKDatabase::class.java,
                "mk_database"
            )
                .allowMainThreadQueries()
                .addTypeConverter(converters) // Передаём конвертер
                .build()

            converters.setDatabase(database)
            service = ApiServiceImpl(client, database, context)
            registerVM = RegisterVM(service)
            TestNavigation(NavRoutes.REGISTER)
        }
        composeTestRule.onNodeWithText("Далее").performClick()
        composeTestRule.onNodeWithText("Ошибка заполнения полей").isDisplayed()
        composeTestRule.onNodeWithText("Не все поля заполнены").isDisplayed()
    }

    @Test
    fun Register_TryRegisterPasswordNotEqual_ShowError() {
        composeTestRule.setContent {
            context = LocalContext.current
            val converters = Converters()
            database = Room.databaseBuilder(
                context,
                MKDatabase::class.java,
                "mk_database"
            )
                .allowMainThreadQueries()
                .addTypeConverter(converters) // Передаём конвертер
                .build()

            converters.setDatabase(database)
            service = ApiServiceImpl(client, database, context)
            registerVM = RegisterVM(service)
            registerVM.updData(registerVM.dataSt.value.copy(password = "1234567", confirmPassword = "1234567",
                patronymic = "test", firstName = "test", lastName = "test", email = "test"))
            TestNavigation(NavRoutes.REGISTER)
        }
        composeTestRule.onNodeWithText("Далее").performClick()
        composeTestRule.onNodeWithText("Ошибка заполнения полей").isDisplayed()
        composeTestRule.onNodeWithText("Пароли не совпадают").isDisplayed()
    }

    @Test
    fun Register_TryRegisterInvalidData_ShowError() {
        composeTestRule.setContent {
            context = LocalContext.current
            val converters = Converters()
            database = Room.databaseBuilder(
                context,
                MKDatabase::class.java,
                "mk_database"
            )
                .allowMainThreadQueries()
                .addTypeConverter(converters) // Передаём конвертер
                .build()

            converters.setDatabase(database)
            service = ApiServiceImpl(client, database, context)
            registerVM = RegisterVM(service)
            registerVM.updData(registerVM.dataSt.value.copy(password = "1234567", confirmPassword = "1234567",
                patronymic = "test", firstName = "test", lastName = "test", email = "test"))
            TestNavigation(NavRoutes.REGISTER)
        }
        composeTestRule.onNodeWithText("Далее").performClick()
        composeTestRule.onNodeWithText("Ошибка при регистрации").isDisplayed()
    }

    @Test
    fun Login_TryLoginInvalidData_ShowError() {
        composeTestRule.setContent {
            context = LocalContext.current
            val converters = Converters()
            database = Room.databaseBuilder(
                context,
                MKDatabase::class.java,
                "mk_database"
            )
                .allowMainThreadQueries()
                .addTypeConverter(converters) // Передаём конвертер
                .build()

            converters.setDatabase(database)
            service = ApiServiceImpl(client, database, context)
            loginVM = LoginVM(service)
            loginVM.updData(loginVM.dataSt.value.copy(password = "1234567", email = "test"))
            TestNavigation(NavRoutes.LOGIN)
        }
        composeTestRule.onNodeWithText("Далее").performClick()
        composeTestRule.onNodeWithText("Ошибка при авторизации").isDisplayed()
    }

    @Composable
    fun TestNavigation(start: String) {
        UserRepository.init(context)
        val controller = rememberNavController()
        NavHost(
            navController = controller,
            startDestination = start) {

            composable(NavRoutes.LOGIN) {
                Login(controller, loginVM)
            }

            composable(NavRoutes.REGISTER) {
                Register(controller, registerVM)
            }

        }
    }

}