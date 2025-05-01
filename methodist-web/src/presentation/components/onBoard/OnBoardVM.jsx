import {action, makeObservable, observable} from "mobx";
import on_board1 from "@images/on_board1.svg";

export class OnBoardVM {

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

    constructor() {
        makeObservable(this,
            {
                currentIndex: observable,
                hdlBack: action,
                hdlNext: action,
            })
    }

    hdlNext = () => {
        if (this.currentIndex < this.slides.length - 1)
            this.currentIndex += 1; // Увеличиваем индекс
        else
            this.currentIndex = 0;
        console.log(this.currentIndex);
    };

    hdlBack = () => {
        if (this.currentIndex > 0)
            this.currentIndex -= 1; // Уменьшаем индекс
        else
            this.currentIndex = 2; // Уменьшаем индекс
        console.log(this.currentIndex);
    };


}