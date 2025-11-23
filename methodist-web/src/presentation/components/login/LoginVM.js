import {action, makeObservable, observable} from "mobx";
import {userStore} from "@/stores/UserStore.jsx";

export class LoginVM {

    formData = {
        email: "user@example.com",
        password: "12345678",
    }

    error = ""

    constructor() {
        makeObservable(this, {
            formData: observable,
            error: observable,
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

    logIn = (navigate, mutate) => {
        if(this.formData.email.trim() === "" || this.formData.password.trim() === "") {
            this.error = "Не все поля заполнены"
            return
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this.formData.email)) {
            this.error = "Некорректный email"
            return
        }

        //вызов post запроса
        mutate(this.formData, {
            onSuccess: (response) => {
                console.log("ок")
                userStore.setToken(response.data.accessToken)
                navigate("/main", { replace: true })
            },
            onError: (error) => {
                console.log(error)
                if (error.response && error.response.data) {
                    this.error = error.response.data
                    console.error("login", error.response.data)
                } else {
                    this.error = `Ошибка ${error.response.status}`
                    console.error("login", 'Неизвестная ошибка');
                }
            }
        });
    }

}



