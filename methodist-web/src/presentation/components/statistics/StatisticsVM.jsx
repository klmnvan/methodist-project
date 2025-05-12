import {action, makeObservable, observable, toJS} from "mobx";
import httpClient from "@/data/AxiosClient.jsx";

export class StatisticsVM {

    dateRange = {
        start: null,
        end: null,
    }

    displayedDateRange = {
        start: null,
        end: null,
    }

    modes = ["Комиссия", "Преподаватель"]
    mode = this.modes[1]
    search = ""
    events = null
    data = [
        {name:"Участие", value: 0},
        {name:"Публикация", value: 0},
        {name:"Стажировка", value: 0},
        {name:"Проведение", value: 0},
    ]

    constructor() {
        makeObservable(this, {
            dateRange: observable,
            mode: observable,
            displayedDateRange: observable,
            data: observable,
            search: observable,
            handleSetDateRange: action,
            switchMode: action,
            onSearch: action,
            getEvents: action,
        })
    }

    calcData() {
        if(this.data && this.dateRange.start) {
            this.displayedDateRange = {
                start: this.dateRange.start,
                end: this.dateRange.end,
            };
            const counters = {
                "Участие": 0,
                "Публикация": 0,
                "Стажировка": 0,
                "Проведение": 0
            };

            const startDate = new Date(this.dateRange.start)
            startDate.setHours(0, 0, 0, 0)
            const startTimestamp = startDate.getTime()

            let endTimestamp;
            if (this.dateRange.end) {
                const endDate = new Date(this.dateRange.end);
                endDate.setHours(23, 59, 59, 999);
                endTimestamp = endDate.getTime();
            }
            else {
                const endDate = new Date(startDate);
                endDate.setHours(23, 59, 59, 999);
                endTimestamp = endDate.getTime();
            }

            this.events.forEach(event => {
                const eventDate = new Date(event.dateOfEvent).getTime();
                const isInRange = eventDate >= startTimestamp && eventDate <= endTimestamp;
                if (!isInRange) return;
                const eventType = event.typeOfEvent?.name;
                if (eventType && Object.prototype.hasOwnProperty.call(counters, eventType)) {
                    counters[eventType]++;
                }
            });

            this.data = Object.entries(counters).map(([name, value]) => ({
                name,
                value
            }));
        }
    }

    getEvents = async () => {
        try {
            const response = await httpClient.getEvents()
            this.events = response.data;
            console.log(response.data);
            this.calcData()
        } catch (error) {
            console.log(error.message);
            alert(`Ошибка получения данных: ${error}`);
            console.log(`Ошибка получения данных: ${error}`);
        }
    }

    handleSetDateRange = (newRange) => {
        this.dateRange = newRange;
        console.log("Полученный диапазон дат", toJS(this.dateRange));
    }

    switchMode = (mode) => {
        this.mode = mode;
        console.log(mode);
    }

    onSearch = (value) => {
        console.log("Строка поиска: ", toJS(value.target.value));
        this.search = value.target.value;
    }

}