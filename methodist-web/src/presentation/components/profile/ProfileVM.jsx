import {action, makeObservable, observable, toJS} from "mobx";
import httpClient from "@/data/AxiosClient.jsx";
import {userStore} from "@/stores/UserStore.jsx";

export class ProfileVM {
    profile = null
    draftProfile = {
        firstName: "",
        lastName: "",
        patronymic: "",
        phoneNumber: ""
    }
    states = ["Просмотр", "Редактирование"]
    state = this.states[0]

    constructor() {
        makeObservable(this, {
            profile: observable,
            state: observable,
            draftProfile: observable,
            handleChange: action,
            handleState: action,
            handleRemoveChanges: action,
            getProfile: action,
            updateProfile: action,
        })
    }

    getProfile = async () => {
        try {
            const response = await httpClient.getProfile()
            this.profile = response.data;
            console.log(response.data);
        }
        catch (error) {
            console.log(error);
        }
    }

    updateProfile = async () => {
        try {
            const response = await httpClient.updateProfile(this.draftProfile)
            this.profile = response.data;
            this.state = this.states[0];
            console.log(response.data);
        }
        catch (error) {
            console.log(error);
        }
    }

    logOut = async (navigate) => {
        try {
            const response = await httpClient.logOut();
            console.log(response.data);
            userStore.clearAuthData();
            // Создаем и диспатчим кастомное событие
            navigate("/auth", { replace: true })
        } catch (error) {
            console.log(error);
        }
    }

    handleState = (state) => {
        this.state = state;
        console.log(this.profile);
        if(state === this.states[1] && this.profile) {
            console.log(toJS(this.profile));
            console.log('я тут');
            this.draftProfile.firstName = this.profile.firstName || "";
            this.draftProfile.lastName = this.profile.lastName || "";
            this.draftProfile.patronymic = this.profile.patronymic || "";
            this.draftProfile.phoneNumber = this.profile.phoneNumber || "";
        }
    }

    handleChange = (e) => {
        console.log(toJS(e))
        const { name, value } = e.target;
        this.draftProfile = {
            ...this.draftProfile,
            [name]: value
        }
        console.log(toJS(this.draftProfile))
    }

    handleRemoveChanges = () => {
        this.draftProfile = {
            firstName: this.profile.firstName,
            lastName: this.profile.lastName,
            patronymic: this.profile.patronymic,
            phoneNumber: this.profile.phoneNumber,
        }
    }


}