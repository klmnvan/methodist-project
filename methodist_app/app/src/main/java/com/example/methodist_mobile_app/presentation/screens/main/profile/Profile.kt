package com.example.methodist_mobile_app.presentation.screens.main.profile

import androidx.compose.runtime.Composable
import androidx.compose.runtime.MutableState
import androidx.compose.runtime.collectAsState
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavHostController
import com.example.methodist_mobile_app.presentation.common.dialogs.DialogError
import com.example.methodist_mobile_app.presentation.screens.main.profile.pages.EditProfile
import com.example.methodist_mobile_app.presentation.screens.main.profile.pages.ShowProfile
import com.example.methodist_mobile_app.presentation.screens.main.profile.state.ProfileUISt
import com.example.methodist_mobile_app.presentation.ui.theme.ThemeMode

@Composable
fun Profile(controller: NavHostController, currentThemeMode: MutableState<ThemeMode>, vm: ProfileVM = hiltViewModel()) {

    val stateDialog = vm.dialogSt.collectAsState().value
    val stateUi = vm.uiSt.collectAsState().value
    val stateData = vm.dataSt.collectAsState().value

    if(stateDialog.dialogIsOpen) {
        DialogError(stateDialog.title, stateDialog.description) {
            vm.updDialog(stateDialog.copy(dialogIsOpen = false))
        }
    }

    when(stateUi) {
        ProfileUISt.Show -> {
            ShowProfile(controller, currentThemeMode, vm, stateData)
        }
        ProfileUISt.Edit -> {
            EditProfile(vm, stateData)
        }
    }

}

