import {action, makeObservable, observable} from "mobx";
import httpClient from "@/data/AxiosClient.jsx";
import {userStore} from "@/stores/UserStore.jsx";

export class LoginVM {

    formData = {
        email: "user@example.com",
        password: "12345678",
    }

    constructor() {
        makeObservable(this,
            {
                formData: observable,
                handleChange: action,
                logIn: action,
            })
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.formData = {
            ...this.formData,
            [name]: value
        }
    }

    logIn = async (navigate) => {
        try {
            const response = await httpClient.login(this.formData)
            console.log("Получил accessToken:" + response.data.accessToken);
            console.log("Получил refreshToken:" + response.data.refreshToken);
            userStore.setToken(response.data.accessToken);
            navigate("/main", { replace: true });
        } catch (error) {
            alert(`Ошибка авторизации: ${error}`);
        }
    }

}

