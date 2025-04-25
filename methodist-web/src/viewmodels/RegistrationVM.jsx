import {action, makeObservable, observable} from "mobx";
import axios from "axios";
import on_board1 from '@images/on_board1.svg'

export class RegistrationVM {

    formData = {
        name: "",
        surname: "",
        patronymic: "",
        email: "",
        password: "",
        confirmPassword: "",
    }

    currentIndex = 0;

    slides = [
        {
            title: "Все активности под рукой",
            description: "Легко проверяйте, кто из участников комиссии проявляет активность",
            imageUrl: on_board1
        },
        {
            title: "Состав комиссии: легко остлеживать",
            description: "Все контакты и роли собраны в одном разделе",
            imageUrl: on_board1
        },
        {
            title: "Аналитика и отчеты",
            description: "Сравнивайте активность членов комиссии с помощью диаграмм и рейтингов",
            imageUrl: on_board1
        },

    ]

    eventForms = []

    constructor() {
        makeObservable(this,
            {
                formData: observable,
                eventForms: observable,
                currentIndex: observable,
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

    hdlNext = () => {
        if (this.currentIndex < this.slides.length - 1)
            this.currentIndex += 1; // Увеличиваем индекс
        else
            this.currentIndex = 0;
    };

    hdlBack = () => {
        if (this.currentIndex > 0)
            this.currentIndex -= 1; // Уменьшаем индекс
        else
            this.currentIndex = 2; // Уменьшаем индекс
    };

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