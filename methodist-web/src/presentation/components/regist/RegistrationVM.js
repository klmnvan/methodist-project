import {action, makeObservable, observable} from "mobx";
import axios from "axios";

export class RegistrationVM {

    formData = {
        name: "",
        surname: "",
        patronymic: "",
        email: "",
        password: "",
        confirmPassword: "",
    }

    eventForms = []

    constructor() {
        makeObservable(this,
            {
                formData: observable,
                eventForms: observable,
                handleChange: action,
                fetchEventForm: action,
                handleButtonClick: action,
            })
    }

    fetchEventForm = async () => {
        try {
            const apiUrl = "http://localhost:80/FormValues/GetEventForms"
            const response = await axios.get(apiUrl)
            this.eventForms = response.data;
        } catch (error) {
            console.log(error)
        }
    }

     handleChange = (e) => {
        const { name, value } = e.target;
        this.formData = {
            ...this.formData,
            [name]: value
        }
    }

    handleButtonClick = () => {
        alert(`Вы тыкнули на кнопку Создать с данными: ${JSON.stringify(this.formData)}`);
    }

}