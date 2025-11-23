import {action, makeObservable, observable, toJS} from "mobx";
import AxiosClient from "@/data/AxiosClient.jsx";

export class FormVM {

    modes = ["Участие", "Проведение", "Стажировка", "Публикация"];
    currentMode = this.modes[0];
    event = {
        dateOfEvent: new Date(),
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
    modalIsOpen = false;
    error = ""

    selectedFiles = [];

    constructor() {
        makeObservable(this, {
            modes: observable,
            selectedFiles: observable,
            modalIsOpen: observable,
            currentMode: observable,
            error: observable,
            statuses: observable,
            eventForms: observable,
            results: observable,
            participationForms: observable,
            event: observable,
            selectMode: action,
            handleQuantityInput: action,
            handleInput: action,
            handleSelect: action,
            closeModal: action,
            setParticipationForms: action,
            setEventForms: action,
            removeFile: action,
            clearFiles: action,
            addFiles: action,
            setStatuses: action,
            setResults: action,
        })
        console.log(toJS(this.currentMode.name))
    }


    removeFile(index) {
        this.selectedFiles = this.selectedFiles.filter((_, i) => i !== index);
    };

    addFiles = (files) => {
        this.selectedFiles = [...this.selectedFiles, ...files];
        console.log('Файлы добавлены:', this.selectedFiles); // Добавь лог
    };

    clearFiles = () => {
        this.selectedFiles = [];
    };

    setParticipationForms(data) {
        this.participationForms = data;
    }

    setEventForms(data) {
        this.eventForms = data;
    }

    setStatuses(data) {
        this.statuses = data;
    }

    setResults(data) {
        this.results = data;
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
        this.error = ""
    });

    createForm = (mutateCreateEvent, mutateUploadFiles) => {
        if (!this.formIdValid()) {
            this.error = 'Не все поля заполнены';
            return;
        }
        const eventToSend = {
            ...this.event,
            typeId: this.getFormOfEventId(),
            endDateOfEvent: this.event.dateOfEvent.toISOString(),
            dateOfEvent: this.event.dateOfEvent.toISOString(),
        };
        mutateCreateEvent(eventToSend, {
            onSuccess: (response) => {
                const eventId = response.data.id;
                if (this.selectedFiles.length > 0) {
                    mutateUploadFiles({ files: this.selectedFiles, eventId }, {
                        onSuccess: (response) => {
                            console.log('Файлы тоже загрузились ' + response);
                        }
                    });
                }
                this.resetForm();
                this.modalIsOpen = true;
                this.clearFiles();
            }
        })
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

    closeModal() {
        this.modalIsOpen = false;
    }

    formIdValid() {
        if(this.currentMode === this.modes[0]) {
            return !this.hasEmptyOrNullFields(toJS(this.event), ['formOfParticipation', 'name', 'formOfEvent', 'status', 'result'])
        }
        if(this.currentMode === this.modes[1]) {
            return !this.hasEmptyOrNullFields(toJS(this.event), ['location', 'name', 'formOfEvent', 'status', 'result'])
        }
        if(this.currentMode === this.modes[2]) {
            return !this.hasEmptyOrNullFields(toJS(this.event), ['location', 'quantityOfHours'])
        }
        if(this.currentMode === this.modes[3]) {
            return !this.hasEmptyOrNullFields(toJS(this.event), ['name', 'type', 'location'])
        }
    }

    hasEmptyOrNullFields(obj, fields) {
        return fields.some(field => {
            const value = obj[field];
            return value === '' || value === null;
        });
    }

}