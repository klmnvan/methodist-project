import {makeObservable, observable} from "mobx";
import httpClient from "@/data/AxiosClient.jsx";
import {userStore} from "@/stores/UserStore.jsx";

export class ProfileVM {
    profile = null

    constructor() {
        makeObservable(this, {
            profile: observable,
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
}