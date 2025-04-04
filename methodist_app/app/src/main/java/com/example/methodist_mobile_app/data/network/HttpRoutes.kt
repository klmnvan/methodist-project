package com.example.methodist_mobile_app.data.network

object HttpRoutes {
    //private const val BASE_URL = "https://iis.ngknn.ru/ngknn/МамшеваЮС/10/api"
    private const val BASE_URL = "http://10.0.2.2:80"
    const val LOGIN = "$BASE_URL/Account/Login"
    const val REGISTER = "$BASE_URL/Account/Register"
}