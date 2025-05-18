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
    teachers = null
    currentTeacher = null
    commissions = null
    currentCommission = null
    events = null
    data = [
        {color: "#22B07D", name:"Участие", value: 0},
        {color: "#FF7C3B", name:"Публикация", value: 0},
        {color: "#C184FF", name:"Стажировка", value: 0},
        {color: "#1977FF", name:"Проведение", value: 0},
    ]

    colorMap = {
        "Участие": "#22B07D",
        "Публикация": "#FF7C3B",
        "Стажировка": "#C184FF",
        "Проведение": "#1977FF"
    };

    constructor() {
        makeObservable(this, {
            dateRange: observable,
            mode: observable,
            displayedDateRange: observable,
            teachers: observable,
            currentTeacher: observable,
            currentCommission: observable,
            commissions: observable,
            data: observable,
            search: observable,
            handleSetDateRange: action,
            switchMode: action,
            onSearch: action,
            getEvents: action,
            selectCommission: action,
            selectTeacher: action
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
                if(this.mode === this.modes[0]) {
                    console.log("Текущий препод", this.currentCommission);
                    if (event.profile.mc.id !== this.currentCommission) return;
                }
                if(this.mode === this.modes[1]) {
                    console.log("Текущий препод", this.currentTeacher);
                    if (event.profile.id !== this.currentTeacher) return;
                }

                console.log("взяли", this.currentTeacher);
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
                value,
                color: this.colorMap[name] || "#CCCCCC" // Используем цвет из карты или серый по умолчанию
            }));
            console.log(toJS(this.data))
        }
    }

    getEvents = async () => {
        try {
            const response = await httpClient.getEvents()
            this.events = response.data;

            const uniqueTechers = [
                ...new Map(response.data
                    .map(e => e.profile)
                    .filter(Boolean)
                    .map(teacher => [teacher.id, teacher]))
                    .values()
            ];

            const uniqueCommissions = [
                ...new Map(response.data
                    .map(e => e.profile.mc)
                    .filter(Boolean)
                    .map(commission => [commission.id, commission]))
                    .values()
            ];

            this.teachers = uniqueTechers.map(teacher => ({
                id: teacher.id,
                name: teacher.lastName + " " + teacher.firstName[0] + ". " + teacher.patronymic[0] + ".",
            }))

            this.commissions = uniqueCommissions.map(commission => ({
                id: commission.id,
                name: commission.name,
            }))

            this.currentTeacher = uniqueTechers[0].id;
            this.currentCommission = uniqueCommissions[0].id;
            console.log("Преподаватели:", toJS(this.teachers));
            console.log("Комиссии:", toJS(this.commissions));
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

    selectTeacher = (teacher) => {
        console.log(toJS(teacher))
        this.currentTeacher = teacher;
    }

    selectCommission = (commission) => {
        console.log(toJS(commission))
        this.currentCommission = commission;
    }

}