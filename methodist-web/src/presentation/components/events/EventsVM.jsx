import httpClient from "@/data/AxiosClient.jsx";
import {action, computed, makeObservable, observable, toJS} from "mobx";

export class EventsVM {

    search = "";
    //Пагинация
    currentPage = 1;
    itemsPerPage = 9; //сколько на странице элементов

    //Листы мероприятий
    allEvents = []; // Все
    filteredEvents = []; // Отфильтрованные

    //Фильтры
    typeSelectAll = {name: "Все", id: ""};
    types = [this.typeSelectAll]; //Типы мероприятий
    selectedType = this.typeSelectAll.id;
    profiles = [this.typeSelectAll] //Все профили
    selectProfile = this.typeSelectAll.id

    //Сортировки
    sorts = [
        {
          id: 0,
          name: "без сортировки"
        },
        {
            id: 1,
            name: "по убыванию даты мероприятия"
        },
        {
            id: 2,
            name: "по возрастанию даты мероприятия"
        },
        {
            id: 3,
            name: "по убыванию даты добавления формы"
        },
        {
            id: 4,
            name: "по возрастанию даты добавления формы"
        },
    ]
    selectSort = 0

    constructor() {
        makeObservable(this, {
            search: observable,
            currentPage: observable,
            allEvents: observable,
            types: observable,
            profiles: observable,
            filteredEvents: observable,
            selectedType: observable,
            selectProfile: observable,
            selectSort: observable,
            handleSearch: action,
            getEvents: action,
            nextPage: action,
            prevPage: action,
            currentItems: computed,
            totalPages: computed,
            totalItems: computed,
        });
    }

    handleSearch = (e) => {
        this.search = e.target.value;
        this.filterEvents();
    };

    handleTypeChange = (typeId) => {
        console.log(typeId);
        this.selectedType = typeId;
        this.filterEvents();
    };

    handleSortChange = (typeId) => {
        this.selectSort = typeId;
        this.filterEvents();
    };

    handleProfileChange = (typeId) => {
        this.selectProfile = typeId;
        this.filterEvents();
    };

    filterEvents = () => {
        // 1. Фильтрация
        this.filteredEvents = this.allEvents.filter(event => {
            let matches = true;

            // Поиск по названию
            if (this.search !== "") {
                matches = matches && event.name.toLowerCase().includes(this.search.toLowerCase());
            }

            // Фильтр по типу
            if (this.selectedType !== this.typeSelectAll.id) {
                matches = matches &&
                    event.typeOfEvent &&
                    event.typeOfEvent.id === this.selectedType;
            }

            // Фильтр по профилю
            if (this.selectProfile !== this.typeSelectAll.id) {
                matches = matches &&
                    event.profile &&
                    event.profile.id === this.selectProfile;
            }

            return matches;
        });

        // 2. Сортировка (применяется ко всему массиву после фильтрации)
        if (this.selectSort === 1) {
            this.filteredEvents.sort((a, b) => b.dateOfEvent.localeCompare(a.dateOfEvent));
        }
        else if (this.selectSort === 2) {
            this.filteredEvents.sort((a, b) => a.dateOfEvent.localeCompare(b.dateOfEvent));
        }
        else if (this.selectSort === 3) {
            this.filteredEvents.sort((a, b) => b.сreatedAt.localeCompare(a.сreatedAt));
        }
        else if (this.selectSort === 4) {
            this.filteredEvents.sort((a, b) => a.сreatedAt.localeCompare(b.сreatedAt));
        }
        // Добавьте другие условия сортировки по необходимости

        this.currentPage = 1;
    };

    getEvents = async () => {
        try {
            const response = await httpClient.getEvents()
            this.allEvents = response.data;

            const uniqueTypes = [
                ...new Map(response.data
                    .map(e => e.typeOfEvent)
                    .filter(Boolean)
                    .map(type => [type.id, type]))
                .values()
            ];
            this.types = [
                this.typeSelectAll,
                ...uniqueTypes.map(type => ({
                    name: type.name,
                    id: type.id,
                }))
            ];
            console.log("Типы мероприятий:", toJS(this.types));

            const uniqueProfiles = [
                ...new Map(response.data
                    .map(e => e.profile)
                    .filter(Boolean)
                    .map(type => [type.id, type]))
                    .values()
            ];
            this.profiles = [
                this.typeSelectAll,
                ...uniqueProfiles.map(p => ({
                    name: `${p.firstName} ${p.patronymic} ${p.lastName}`,
                    id: p.id,
                }))
            ];
            this.filteredEvents = [...this.allEvents];
            console.log(response.data);
        } catch (error) {
            console.log(error.message);
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

    get totalItems() {
        return this.filteredEvents.length;
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