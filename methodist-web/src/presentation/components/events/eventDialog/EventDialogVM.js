import {action, makeObservable, observable, toJS} from "mobx";

export class EventDialogVM {

    draftEvent = {}
    fieldModes = [
        {
            typeOfEvent: 'Участие',
            fields: ['dateOfEvent', 'formOfParticipation', 'name', 'formOfEvent', 'status', 'result']
        },
        {
            typeOfEvent: 'Проведение',
            fields: ['dateOfEvent', 'location', 'name', 'formOfEvent', 'status', 'result']
        },
        {
            typeOfEvent: 'Стажировка',
            fields: ['dateOfEvent', 'location', 'quantityOfHours']
        },
        {
            typeOfEvent: 'Публикация',
            fields: ['dateOfEvent', 'name', 'type', 'location']
        },
    ]
    modes = ["просмотра", "редактирования"]
    mode = this.modes[0]

    constructor() {
        makeObservable(this, {
            draftEvent: observable,
            mode: observable,
            setEvent: action,
            swapMode: action,
            handleDateSelect: action,
            onSelect: action,
        })
    }

    setEvent(event) {
        this.event = event
    }

    handleDateSelect = (newDate) => {
        this.draftEvent.dateOfEvent = newDate;
        this.draftEvent.endDateOfEvent = newDate;
    }

    onSelect = (fieldName, value) => {
        this.draftEvent[fieldName] = value;
    }

    swapMode() {
        this.mode = this.mode === this.modes[0]
            ? this.modes[1]
            : this.modes[0];
        if (this.mode === this.modes[1]) {
            this.fillDraftEvent(); // Заполняем draftEvent при переключении на режим редактирования
        } else {
            this.draftEvent = null; // Очищаем draftEvent при возврате в режим просмотра
        }
    }

    fillDraftEvent() {
        if (this.event) {
            this.draftEvent = {};
            const fields = this.getFieldsForEventType(this.event.typeOfEvent.name);
            fields.forEach(field => {
                if(field === 'dateOfEvent') {
                    this.draftEvent[field] = new Date(this.event[field]);
                    return
                }
                this.draftEvent[field] = this.event[field];
            });
        }
    }

    getFieldsForEventType = (typeName) => {
        const mode = this.fieldModes.find(mode => mode.typeOfEvent === typeName);
        return mode ? mode.fields : [];
    };

    getFieldLabel = (fieldName) => {
        const labels = {
            dateOfEvent: 'Дата мероприятия',
            formOfParticipation: 'Форма участия',
            name: 'Название',
            formOfEvent: 'Форма мероприятия',
            status: 'Статус',
            result: 'Результат',
            location: 'Место проведения',
            quantityOfHours: 'Количество часов',
            type: 'Вид публикации'
        };
        return labels[fieldName] || fieldName;
    };

}