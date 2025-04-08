package com.example.methodist_mobile_app.presentation.screens.main.profile.state

import com.example.methodist_mobile_app.data.models.ProfileModel

data class ProfileSt(
    var profile: ProfileModel = ProfileModel(),
    var newProfile: ProfileModel = ProfileModel(),
)