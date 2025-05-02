import httpClient from "@/data/AxiosClient.jsx";
import {action, computed, makeObservable, observable} from "mobx";

export class EventsVM {

    search = "";
    currentPage = 1;
    allEvents = []; // Все мероприятия
    filteredEvents = []; // Отфильтрованные мероприятия
    itemsPerPage = 12;
    types = [{name: "Всё", id: ""}];

    constructor() {
        makeObservable(this, {
            search: observable,
            currentPage: observable,
            allEvents: observable,
            types: observable,
            filteredEvents: observable,
            handleSearch: action,
            getEvents: action,
            nextPage: action,
            prevPage: action,
            currentItems: computed, // Вычисляемые элементы для текущей страницы
            totalPages: computed, // Общее количество страниц
        });
    }

    handleSearch = (e) => {
        this.search = e.target.value;
        this.filterEvents();
    };

    filterEvents = () => {
        this.filteredEvents = this.allEvents.filter(event =>
            event.name.toLowerCase().includes(this.search.toLowerCase())
        );
        this.currentPage = 1; // Сбросить текущую страницу при новом поиске
    };

    getEvents = async () => {
        try {
            const response = await httpClient.getEvents()
            this.allEvents = response.data;
            this.filteredEvents = [...this.allEvents];
            console.log(response.data);
        } catch (error) {
            alert(`Ошибка получения данных: ${error}`);
            console.log(`Ошибка получения данных: ${error}`);
        }
    }

    // Вычисляемые элементы для текущей страницы
    get currentItems() {
        const indexOfLastItem = this.currentPage * this.itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - this.itemsPerPage;
        return this.filteredEvents.slice(indexOfFirstItem, indexOfLastItem);
    }

    get totalPages() {
        return Math.ceil(this.filteredEvents.length / this.itemsPerPage);
    }

    nextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage += 1;
        }
    }

    prevPage() {
        if (this.currentPage > 1) {
            this.currentPage -= 1;
        }
    }

}