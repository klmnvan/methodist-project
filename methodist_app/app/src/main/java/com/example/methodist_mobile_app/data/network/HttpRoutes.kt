package com.example.methodist_mobile_app.data.network

object HttpRoutes {
    //private const val BASE_URL = "https://iis.ngknn.ru/ngknn/МамшеваЮС/10/api"
    private const val BASE_URL = "http://10.0.2.2:80"
    const val LOGIN = "$BASE_URL/Account/Login"
    const val REGISTER = "$BASE_URL/Account/Register"
    const val GET_EVENTS = "$BASE_URL/Event/GetByIdProfile"

    //Профиль
    const val GET_PROFILE = "$BASE_URL/Profile/GetProfile"
    const val UPDATE_PROFILE = "$BASE_URL/Profile/UpdatePart"

    //Url для картинок
    const val BASE_URL_IMAGE = "$BASE_URL/Profile/Uploads"
}