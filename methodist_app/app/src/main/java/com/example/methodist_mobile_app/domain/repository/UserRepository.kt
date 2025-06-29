package com.example.methodist_mobile_app.domain.repository

import android.content.Context
import android.content.SharedPreferences
import android.util.Log
import com.example.methodist_mobile_app.presentation.ui.theme.ThemeMode
import org.json.JSONObject
import java.time.Instant
import java.time.ZoneId
import java.util.Base64
import java.util.Date

object UserRepository {

    private lateinit var spAct: SharedPreferences

    fun init(context: Context){
        spAct = context.getSharedPreferences("root", Context.MODE_PRIVATE)
    }

    fun checkToken() {
        if (token != "") {
            val mDecode = decodeToken(token)
            val exp = JSONObject(mDecode).getString("exp")
            val localDate = utcToLocalDateTime(exp.toLong())
            val now = Date()
            if (localDate.before(now)) {
                Log.d("token", "истек")
                act = 1
            } else {
                Log.d("token", "не истек")
            }
        } else {
            Log.d("token", "отсутствует")
            act = 1
        }
    }


    fun utcToLocalDateTime(utcSeconds: Long): Date {
        val instant = Instant.ofEpochSecond(utcSeconds)
        val zonedDateTime = instant.atZone(ZoneId.of("UTC"))
        return Date.from(zonedDateTime.toInstant())
    }

    private fun decodeToken(jwt: String): String {
        val parts = jwt.split(".")
        return try {
            val charset = charset("UTF-8")
            val header = String(Base64.getUrlDecoder().decode(parts[0].toByteArray(charset)), charset)
            val payload = String(Base64.getUrlDecoder().decode(parts[1].toByteArray(charset)), charset)
            "$header"
            "$payload"
        } catch (e: Exception) {
            "Error parsing JWT: $e"
        }
    }

    var act: Int
        get() = spAct.getInt("act", 1)
        set(value) = spAct.edit().putInt("act", value).apply()

    var token: String
        get() = spAct.getString("token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzNDVoMDk4YmI4cmViZXJid3I0dnZiODk0NSIsImp0aSI6IjkxZjY1MDU1LTRhNDctNDAxYi1iM2ZiLTlhZGQ3NzU1Mzk0NSIsImlhdCI6IjE3MjM3ODkyMDkiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6ImRkMzhmMzJkLTc1ODYtNGM1Yi05ZGExLTM4YTYxY2MxN2VhYyIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWUiOiJuZXNrbG1udmFuQGdtYWlsLmNvbSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6Im5lc2tsbW52YW5AZ21haWwuY29tIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoi0J_RgNC10L_QvtC00LDQstCw0YLQtdC70YwiLCJleHAiOjE3MjM4NzU2MDksImlzcyI6IkV4YW1wbGVJc3N1ZXIiLCJhdWQiOiJWYWxpZEF1ZGllbmNlIn0.PHyENhl-1FYCOhPoAYUD5gJ-7a4ClmOnzS_cZ3HlApc")!!
        set(value) = spAct.edit().putString("token", value).apply()

    var refreshToken: String
        get() = spAct.getString("refreshToken", null)!!
        set(value) = spAct.edit().putString("refreshToken", value).apply()

    var accessToken: String
        get() = spAct.getString("accessToken", null)!!
        set(value) = spAct.edit().putString("accessToken", value).apply()

    var theme: String
        get() = spAct.getString("theme", "Dark")!!
        set(value) = spAct.edit().putString("theme", value).apply()

    var profileId: String
        get() = spAct.getString("profileId", "5ce9f584-6fea-41e9-9a64-4ab4d9d09e84")!!
        set(value) = spAct.edit().putString("profileId", value).apply()

    var themes = listOf(ThemeMode.Light, ThemeMode.Dark)
}