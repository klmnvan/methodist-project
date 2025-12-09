import {action, makeObservable, observable, toJS} from "mobx";
import AxiosClient from "@/data/AxiosClient.jsx";

export class FormVM {

    modes = ["Участие", "Проведение", "Стажировка", "Публикация", "Участие студентов"];
    currentMode = this.modes[4];
    ownerTypeByResults = [];
    statuses = [];
    eventForms = [];
    results = [];
    participationForms = [];
    modalIsOpen = false;
    error = ""
    selectedFiles = [];

    constructor() {

        this.event = {
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
            participantsCount: "0",
            results: []
        }

        makeObservable(this, {
            modes: observable,
            selectedFiles: observable,
            modalIsOpen: observable,
            currentMode: observable,
            error: observable,
            ownerTypeByResults: observable,
            statuses: observable,
            eventForms: observable,
            results: observable,
            participationForms: observable,
            event: observable,
            selectMode: action,
            handleQuantityInput: action,
            handleParticipantsCount: action,
            handleInput: action,
            handleRemoveFile: action,
            handleSelect: action,
            closeModal: action,
            setParticipationForms: action,
            initNewResult: action,
            setEventForms: action,
            removeFile: action,
            clearFiles: action,
            addFiles: action,
            setStatuses: action,
            setResults: action,
        })
        console.log(toJS(this.currentMode.name))
    }

    initNewResult() {
        console.log('добавляю');
        const newResult = {
            ownerTypeId: this.ownerTypeByResults[0],
            result: this.results[0],
            file: null
        }
        this.event.results = [...this.event.results, newResult];
        console.log(this.event.results);
    }

    handleFileSelect(index) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '*'; // можно уточнить типы, например 'image/*, .pdf'
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const maxSize = 10 * 1024 * 1024;
            if (file.size > maxSize) {
                alert('Файл слишком большой. Максимальный размер — 10 МБ.');
                return;
            }
            this.event.results = this.event.results.map((result, idx) => {
                if (idx === index) {
                    return {
                        ...result,
                        file: file
                    };
                }
                return result;
            });
            console.log('Файл добавлен:', this.event.results[index].file);
        };
        input.click();
    };

    handleRemoveFile(index) {
        this.event.results = this.event.results.map((result, idx) => {
            if (idx === index) {
                return {
                    ...result,
                    file: null // сбрасываем файл
                };
            }
            return result;
        });
        console.log('Файл удалён:', this.event.results[index].file); // будет null
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

    setOwnerTypeByResults(data) {
        this.ownerTypeByResults = data;
    }

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

    handleParticipantsCount = (value) => {
        let cleanValue = value.replace(/\D/g, '');
        cleanValue = cleanValue.replace(/^0+/, '') || '0';
        cleanValue = cleanValue.slice(0, 10);
        this.event.participantsCount = cleanValue;
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
            participantsCount: "1",
            results: []
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
            case 'Участие студентов':
                return '53ffe6e1-f95d-4b8a-9922-36c6c2840498';
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
        if(this.currentMode === this.modes[4]) {
            return !this.hasEmptyOrNullFields(toJS(this.event), ['formOfParticipation', 'name', 'formOfEvent', 'status'])
        }
    }

    hasEmptyOrNullFields(obj, fields) {
        return fields.some(field => {
            const value = obj[field];
            return value === '' || value === null;
        });
    }

}