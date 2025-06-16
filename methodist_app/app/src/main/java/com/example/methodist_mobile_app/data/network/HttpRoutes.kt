package com.example.methodist_mobile_app.data.network

object HttpRoutes {
    //private const val BASE_URL = "https://iis.ngknn.ru/ngknn/МамшеваЮС/10/api"
    private const val BASE_URL = "https://iis.ngknn.ru/ngknn/КлимычеваАА/API"
    const val LOGIN = "$BASE_URL/Account/Login"
    const val REGISTER = "$BASE_URL/Account/Register"

    //Мероприятия
    const val GET_EVENTS = "$BASE_URL/Event/GetEvents"
    const val CREATE_EVENT = "$BASE_URL/Event/Create"
    const val UPLOAD_FILES = "$BASE_URL/Event/UploadFiles"

    //Профиль
    const val GET_PROFILE = "$BASE_URL/Profile/GetProfile"
    const val UPDATE_PROFILE = "$BASE_URL/Profile/UpdatePart"

    //Url для картинок
    const val BASE_URL_IMAGE = "$BASE_URL/Profile/Uploads"

    //Значения форм
    const val GET_EVENT_FORMS = "$BASE_URL/FormValues/GetEventForms"
    const val GET_EVENT_STATUSES = "$BASE_URL/FormValues/GetEventStatuses"
    const val GET_EVENT_RESULTS = "$BASE_URL/FormValues/GetEventResults"
    const val GET_PARTICIPATION_FORMS = "$BASE_URL/FormValues/GetParticipationForms"

    //Профиль
    const val UPLOAD_IMAGE = "$BASE_URL/Profile/UploadImage"
}