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
    selectedFiles = []; //не используется

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
            participantsCount: "1",
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
            clearFiles: action,
            setStatuses: action,
            setResults: action,
        })
        console.log(toJS(this.currentMode.name))
    }

    /** Добавление нового результата в список results модели мероприятия **/
    initNewResult() {
        const newResult = {
            ownerTypeId: this.ownerTypeByResults[0].id,
            result: this.results[0],
            fileName: null
        }
        this.event.results = [...this.event.results, newResult];
        console.log(this.event.results);
    }

    /** Обработчик для добавления файла к результату **/
    handleFileSelect(index) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '*'; // можно уточнить типы, например 'image/*, .pdf'
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const maxSize = 10 * 1024 * 1024;
            if (file.size > maxSize) {
                alert('Файл слишком большой. Максимальный размер — 10 МБ.');
                return;
            }
            // Генерируем уникальное имя файла
            const uniqueName = this.generateFileName(file);
            // Сохраняем файл с новым именем
            const fileToSave = new File([file], uniqueName, { type: file.type });
            this.event.results = this.event.results.map((result, idx) => {
                if (idx === index) {
                    return {
                        ...result,
                        fileName: uniqueName
                    };
                }
                return result;
            });
            this.selectedFiles = [...this.selectedFiles, fileToSave];
            console.log('Файл добавлен:', fileToSave.name);
            console.log('Все файлы:', this.selectedFiles);
        };
        input.click();
    };

    fileCounter = 0;
    /** Генерация уникального имени файла.
     * Формат: оригинальное_имя_счетчик.расширение **/
    generateFileName(file) {
        this.fileCounter++;
        const originalName = file.name;
        const nameWithoutExt = originalName.replace(/\.[^/.]+$/, "");
        const extension = originalName.split('.').pop();
        return `${nameWithoutExt}_${this.fileCounter}.${extension}`;
    }

    /** Обработчик для удаления файла у результата **/
    handleRemoveFile(index) {
        const result = this.event.results[index];
        if (result.fileName) {
            this.selectedFiles = this.selectedFiles.filter(file => file.name !== result.fileName);
            this.event.results = this.event.results.map((res, idx) => {
                if (idx === index) {
                    return {
                        ...res,
                        fileName: null
                    };
                }
                return res;
            });
        }
        console.log('Файл удалён:', result); // будет null
    }

    /** Обработчик для удаления файлов у мероприятия **/
    clearFiles = () => {
        this.selectedFiles = [];
    };

    /** Инициализация списка типов принадлежности результата **/
    setOwnerTypeByResults(data) {
        this.ownerTypeByResults = data;
    }

    /** Инициализация списка ... **/
    setParticipationForms(data) {
        this.participationForms = data;
    }

    /** Инициализация списка ... **/
    setEventForms(data) {
        this.eventForms = data;
    }

    /** Инициализация списка ... **/
    setStatuses(data) {
        this.statuses = data;
    }

    /** Инициализация списка ... **/
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

    /** Сброс формы к нормальному состоянию **/
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
        this.initNewResult()
        this.error = ""
    });

    /** Создание формы и отправка в БД **/
    createForm = (mCreateEvent, mLoadFiles) => {
        if (!this.formIdValid()) {
            this.error = 'Не все поля заполнены';
            return;
        }
        const eventToSend = {
            ...this.event,
            typeId: this.getFormOfEventId(),
            endDateOfEvent: this.event.dateOfEvent.toISOString(),
            dateOfEvent: this.event.dateOfEvent.toISOString()
        };
        mCreateEvent(eventToSend, {
            onSuccess: (response) => {
                console.log('мероприятие создано с ID' + response.data.id);
                const eventId = response.data.id;
                if (this.selectedFiles.length > 0) {
                    mLoadFiles({ files: this.selectedFiles, eventId }, {
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
            return !this.hasEmptyOrNullFields(toJS(this.event), ['formOfParticipation', 'name', 'formOfEvent', 'status'])
                && this.hasAtLeastOneResult()
        }
        if(this.currentMode === this.modes[1]) {
            return !this.hasEmptyOrNullFields(toJS(this.event), ['location', 'name', 'formOfEvent', 'status'])
                && this.hasAtLeastOneResult()
        }
        if(this.currentMode === this.modes[2]) {
            return !this.hasEmptyOrNullFields(toJS(this.event), ['location', 'quantityOfHours'])
        }
        if(this.currentMode === this.modes[3]) {
            return !this.hasEmptyOrNullFields(toJS(this.event), ['name', 'type', 'location'])
        }
        if(this.currentMode === this.modes[4]) {
            return !this.hasEmptyOrNullFields(toJS(this.event), ['formOfParticipation', 'name', 'formOfEvent', 'status'])
                && this.hasAtLeastOneResult()
        }
    }

    /** Проверка заполнения поля **/
    hasEmptyOrNullFields(obj, fields) {
        return fields.some(field => {
            const value = obj[field];
            return value === '' || value === null;
        });
    }

    /** Проверка наличия хотя бы 1 элемента списка **/
    hasAtLeastOneResult() {
        return this.event.results && this.event.results.length > 0;
    }

}