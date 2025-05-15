import {action, makeObservable, observable, toJS} from "mobx";
import AxiosClient from "@/data/AxiosClient.jsx";

export class FormVM {

    modes = ["Участие", "Проведение", "Стажировка", "Публикация"];
    currentMode = this.modes[0];
    event = {
        dateOfEvent: new Date(), // Теперь это объект Date, а не строка
        endDateOfEvent: new Date(),
        typeId: "",
        isChecked: false,
        isApproved: false,
        type: "",
        name: "",
        formOfParticipation: "",
        formOfEvent: "",
        status: "",
        location: "",
        quantityOfHours: "0",
        result: ""
    };
    statuses = [];
    eventForms = [];
    results = [];
    participationForms = [];

    constructor() {
        makeObservable(this, {
            modes: observable,
            currentMode: observable,
            statuses: observable,
            eventForms: observable,
            results: observable,
            participationForms: observable,
            event: observable,
            selectMode: action,
            handleQuantityInput: action,
            handleInput: action,
            handleSelect: action
        })
        console.log(toJS(this.currentMode.name))
    }

    selectMode = (mode) => {
        this.currentMode = mode;
        this.resetForm();
    }

    handleInput = (e) => {
        console.log(toJS(e))
        const { name, value } = e.target;
        this.event = {
            ...this.event,
            [name]: value
        };
        console.log(toJS(this.event))
    }

    handleSelect = (fieldName, value) => {
        this.event[fieldName] = value;
    }

    handleDateSelect = (newDate) => {
        this.event.dateOfEvent = newDate;
        console.log("Новая дата", toJS(this.newDate));
    }

    handleQuantityInput = (value) => {
        let cleanValue = value.replace(/\D/g, '');
        cleanValue = cleanValue.replace(/^0+/, '') || '0';
        cleanValue = cleanValue.slice(0, 10);
        this.event.quantityOfHours = cleanValue;
        console.log(toJS(this.event))
        return cleanValue;
    }

    resetForm = action(() => {
        const { dateOfEvent} = this.event;
        this.event = {
            dateOfEvent: dateOfEvent,
            endDateOfEvent: dateOfEvent,
            typeId: "",
            isChecked: false,
            isApproved: false,
            type: "",
            name: "",
            formOfParticipation: "",
            formOfEvent: "",
            status: "",
            location: "",
            quantityOfHours: "0",
            result: ""
        };
    });

    getValuesForms = async () => {
        try {
            const { data: participationForms } = await AxiosClient.axiosClient.get('FormValues/GetParticipationForms');
            this.participationForms = participationForms;
            const { data: eventForms } = await AxiosClient.axiosClient.get('FormValues/GetEventForms');
            this.eventForms = eventForms;
            const { data: statuses } = await AxiosClient.axiosClient.get('FormValues/GetEventStatuses');
            this.statuses = statuses;
            const { data: results } = await AxiosClient.axiosClient.get('FormValues/GetEventResults');
            this.results = results;
            console.log("1", toJS(this.statuses))
            console.log("2", toJS(this.eventForms))
            console.log("3", toJS(this.results))
            console.log("4", toJS(this.participationForms))
        } catch (error) {
            console.log(error.message);
            alert(`Ошибка получения данных: ${error}`);
            console.log(`Ошибка получения данных: ${error}`);
        }
    }

    createForm = async () => {
        try {
            const eventToSend = {
                ...this.event,
                typeId: this.getFormOfEventId(),
                endDateOfEvent: this.event.dateOfEvent.toISOString(),
                dateOfEvent: this.event.dateOfEvent.toISOString(),
            };
            console.log("попытка отправить event", eventToSend);
            const { data: newEvent } = await AxiosClient.axiosClient.post('Event/Create', eventToSend);
            this.resetForm();
            console.log("новый event", newEvent);
        }
        catch (error) {
            console.log("Ошибка при создании мероприятия", error.message);
        }
    }

    getFormOfEventId() {
        switch (this.currentMode) {
            case 'Участие':
                return '638ea3fe-b998-4a6e-a06e-3331597e34b8';
            case 'Проведение':
                return 'ec2d1d7b-4cb7-41e1-aa80-74f695fea627';
            case 'Стажировка':
                return '01f2e985-5066-4a1c-bc51-5c46b6b20362';
            case 'Публикация':
                return '5ce9f584-6fea-41e9-9a64-4ab4d9d09e84';
            default:
                return '';
        }
    }

}