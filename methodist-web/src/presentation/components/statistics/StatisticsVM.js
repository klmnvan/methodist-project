import {action, computed, makeObservable, observable, toJS} from "mobx";
import httpClient from "@/data/AxiosClient.jsx";
import {typeSelectAll} from "@/presentation/components/events/EventVM.js";

export class StatisticsVM {

    data = [
        {color: "#22B07D", name:"Участие", value: 0},
        {color: "#FF7C3B", name:"Публикация", value: 0},
        {color: "#C184FF", name:"Стажировка", value: 0},
        {color: "#1977FF", name:"Проведение", value: 0},
        {color: "#FDB913", name:"Участие студентов", value: 0},
    ]
    colorMap = {
        "Участие": "#22B07D",
        "Публикация": "#FF7C3B",
        "Стажировка": "#C184FF",
        "Проведение": "#1977FF",
        "Участие студентов": "#FDB913"
    };

    displayedDateRange = {
        start: null,
        end: null,
    }

    modes = ["Комиссия", "Преподаватель"]
    teachers = []
    commissions = []
    events = []
    settings = {
        dateRange: {
            start: null,
            end: null,
        },
        mode: this.modes[1],
        teacher: typeSelectAll.id,
        commission: typeSelectAll.id
    }
    search = ""

    constructor() {
        makeObservable(this, {
            settings: observable,
            displayedDateRange: observable,
            teachers: observable,
            commissions: observable,
            data: observable,
            search: observable,
            setEvents: action,
            setCommissions: action,
            setTeachers: action,
            setDateRange: action,
            setMode: action,
            onSearch: action,
            getEvents: action,
            selectCommission: action,
            selectTeacher: action,
            filteredTeachers: computed,
            filteredCommissions: computed,
        })
    }

    setEvents(data) {
        this.events = data
    }

    setCommissions(data) {
        this.commissions = [
            typeSelectAll,
            ...data
        ]
    }

    setTeachers(data) {
        this.teachers = [
            typeSelectAll,
            ...data
        ]
    }

    calcData() {
        if(this.data && this.settings.dateRange.start) {
            console.log("тут")
            this.displayedDateRange = {
                start: this.settings.dateRange.start,
                end: this.settings.dateRange.end,
            };
            const counters = {
                "Участие": 0,
                "Публикация": 0,
                "Стажировка": 0,
                "Проведение": 0,
                "Участие студентов": 0
            };

            const startDate = new Date(this.settings.dateRange.start)
            startDate.setHours(0, 0, 0, 0)
            const startTimestamp = startDate.getTime()

            let endTimestamp;
            if (this.settings.dateRange.end) {
                const endDate = new Date(this.settings.dateRange.end);
                endDate.setHours(23, 59, 59, 999);
                endTimestamp = endDate.getTime();
            }
            else {
                const endDate = new Date(startDate);
                endDate.setHours(23, 59, 59, 999);
                endTimestamp = endDate.getTime();
            }

            this.events.forEach(event => {
                if(this.settings.mode === this.modes[0] && this.settings.commission !== 'all') {
                    console.log("Текущая комиссия", this.settings.commission);
                    if (event.profile && event.profile.mc && event.profile.mc.id !== this.settings.commission) return;
                }
                if(this.settings.mode === this.modes[1] && this.settings.teacher !== 'all') {
                    console.log("Текущий препод", this.settings.teacher);
                    if (event.profile.id !== this.settings.teacher) return;
                }

                console.log("взяли", this.settings.teacher);
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
                name: (teacher.lastName || "") + " " + ((teacher.firstName[0] && teacher.firstName[0] + ".") || "")  + ((teacher.patronymic[0] && teacher.patronymic[0] + ".") || "") ,
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

    setDateRange = (newRange) => {
        this.settings.dateRange = newRange;
        console.log("Полученный диапазон дат", toJS(this.settings.dateRange));
    }

    setMode = (mode) => {
        this.settings.mode = mode;
        console.log(mode);
    }

    onSearch = (value) => {
        console.log("Строка поиска: ", toJS(value.target.value));
        this.search = value.target.value;
    }

    selectTeacher = (teacher) => {
        console.log(toJS(teacher))
        this.settings.teacher = teacher;
    }

    selectCommission = (commission) => {
        console.log(toJS(commission))
        this.settings.commission = commission;
    }

    get filteredTeachers() {
        if (!this.teachers) return null;
        return this.teachers.filter(teacher =>
            teacher.name.toLowerCase().includes(this.search)
        );
    }

    get filteredCommissions() {
        if (!this.commissions) return null;
        return this.commissions.filter(commission =>
            commission.name.toLowerCase().includes(this.search)
        );
    }

}