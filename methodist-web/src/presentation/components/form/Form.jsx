import {observer} from "mobx-react-lite";
import classes from "./Form.module.css"
import {ToggleBtnStat} from "@ui/toggleButtons/toggleBtnStat/ToggleBtnStat.jsx";
import {useEffect, useMemo} from "react";
import {FormVM} from "@/presentation/components/form/FormVM.js";
import SpacerPX from "@ui/spacers/SpacerPX.jsx";
import ProfileInput from "@ui/inputs/profileInput/ProfileInput.jsx";
import {DatePicker} from "@ui/datePicker/datePicker/DatePicker.jsx";
import ButtonAuth from "@ui/button/buttonAuth/ButtonAuth.jsx";
import {EventSelector} from "@/presentation/components/form/eventSelector/EventSelector.jsx";
import {createPortal} from "react-dom";
import {ImageSuccess} from "@ui/icons/ImageSuccess.jsx";
import {useStore} from "@/presentation/providers/AppStoreProvider.jsx";
import {useLoadFiles} from "@/presentation/components/form/hooks/useLoadFiles.jsx";
import {useCreateEvent} from "@/presentation/components/form/hooks/useCreateEvent.jsx";
import {IconEvent} from "@ui/icons/IconEvent.jsx";
import {IconDelete} from "@ui/icons/IconDelete.jsx";
import {IconFile} from "@ui/icons/IconFile.jsx";
import {IconPlus} from "@ui/icons/IconPlus.jsx";

export const Form = observer(() => {

    const vm = useMemo(() => new FormVM(), [])
    const { statuses, results, eventForms, participationForms, ownerTypeByResults } = useStore()
    const { mutate: mLoadFiles } = useLoadFiles()
    const { mutate: mCreateEvent } = useCreateEvent()
    //#region React Queries

    //#endregion
    //#region Use Effects
    useEffect(() => {
        if(ownerTypeByResults) { vm.setOwnerTypeByResults(ownerTypeByResults) }
    }, [vm, ownerTypeByResults])

    useEffect(() => {
        if(participationForms) { vm.setParticipationForms(participationForms) }
    }, [vm, participationForms])

    useEffect(() => {
        if(eventForms) { vm.setEventForms(eventForms) }
    }, [vm, eventForms])

    useEffect(() => {
        if(statuses) { vm.setStatuses(statuses) }
    }, [vm, statuses])

    useEffect(() => {
        if(results) { vm.setResults(results) }
    }, [vm, results])
    //#endregion
    return(
        <div className={classes.background}>
            {vm.modalIsOpen && createPortal(
                <div className={classes.modalOverlay}>
                    <div className={classes.modal}>
                        <ImageSuccess className={classes.icon} width={"90"} height={"90"}/>
                        <h2>Создание мероприятия</h2>
                        <div className={classes.des}>Запись о мероприятии была успешно добавлена. Вы можете увидеть её в списке мероприятий. Для Вашего удобства форма была очищена.</div>
                        <ButtonAuth onClick={() => vm.closeModal()}>Закрыть</ButtonAuth>
                    </div>
                </div>,
                document.body
            )}
            <div className={classes.container}>
                <div className={classes.title}>Создание формы</div>
                <SpacerPX size={12} orientation={"v"}/>
                <div className={classes.titleInput}>Форма работы</div>
                <SpacerPX size={12} orientation={"v"}/>
                <ToggleBtnStat currentValue={vm.currentMode} values={vm.modes} onChange={ vm.selectMode }/>
                <SpacerPX size={20} orientation={"v"}/>
                {vm.currentMode === vm.modes[0] && (
                    //#region Участие
                    <>
                        <EventSelector
                            label="Форма участия"
                            defaultValues={vm.participationForms}
                            defaultIsExists={false}
                            onSelect={(value) => vm.handleSelect('formOfParticipation', value)}
                        />
                        <SpacerPX size={12} orientation={"v"}/>
                        <ProfileInput
                            label="Название мероприятия"
                            type="text"
                            name="name"
                            placeholder = "Название"
                            value={vm.event.name}
                            onChange={vm.handleInput}
                        />
                        <SpacerPX size={12} orientation={"v"}/>
                        <EventSelector
                            label="Форма мероприятия"
                            defaultValues={vm.eventForms}
                            onSelect={(value) => vm.handleSelect('formOfEvent', value)}
                        />
                        <SpacerPX size={12} orientation={"v"}/>
                        <EventSelector
                            label="Cтатус мероприятия"
                            defaultValues={vm.statuses}
                            onSelect={(value) => vm.handleSelect('status', value)}
                        />
                        <SpacerPX size={12} orientation={"v"}/>
                        <EventSelector
                            label="Результат"
                            defaultValues={vm.results}
                            onSelect={(value) => vm.handleSelect('result', value)}
                        />
                    </>
                    //#endregion
                )}
                {vm.currentMode === vm.modes[1] && (
                    //#region Проведение
                    <>
                        <ProfileInput
                            label="Название мероприятия"
                            type="text"
                            name="name"
                            placeholder = "Название"
                            value={vm.event.name}
                            onChange={vm.handleInput}
                        />
                        <SpacerPX size={12} orientation={"v"}/>
                        <EventSelector
                            label="Форма мероприятия"
                            defaultValues={vm.eventForms}
                            onSelect={(value) => vm.handleSelect('formOfEvent', value)}
                        />
                        <SpacerPX size={12} orientation={"v"}/>
                        <ProfileInput
                            label="Место проведения"
                            type={"text"}
                            name="location"
                            placeholder = "ГБПОУ НГК"
                            value={vm.event.location}
                            onChange={vm.handleInput}
                        />
                        <SpacerPX size={12} orientation={"v"}/>
                        <EventSelector
                            label="Cтатус мероприятия"
                            defaultValues={vm.statuses}
                            onSelect={(value) => vm.handleSelect('status', value)}
                        />
                        <SpacerPX size={12} orientation={"v"}/>
                        <EventSelector
                            label="Результат"
                            defaultValues={vm.results}
                            onSelect={(value) => vm.handleSelect('result', value)}
                        />
                    </>
                    //#endregion
                )}
                {vm.currentMode === vm.modes[2] && (
                    //#region Стажировка
                    <>
                        <ProfileInput
                            label="Место прохождения"
                            type={"text"}
                            name="location"
                            placeholder = "ГБПОУ НГК"
                            value={vm.event.location}
                            onChange={vm.handleInput}
                        />
                        <SpacerPX size={12} orientation={"v"}/>
                        <ProfileInput
                            label="Количество часов"
                            type="text"
                            inputMode="numeric"
                            name="quantityOfHours"
                            value={vm.event.quantityOfHours}
                            onChange={(e) => {
                                const newValue = vm.handleQuantityInput(e.target.value);
                                e.target.value = newValue; // Синхронизируем значение
                            }}
                            title="Только положительные целые числа"
                            maxLength={10}
                        />
                    </>
                    //#endregion
                )}
                {vm.currentMode === vm.modes[3] && (
                    //#region Публикация
                    <>
                        <ProfileInput
                            label="Название"
                            type="text"
                            name="name"
                            placeholder = "Название"
                            value={vm.event.name}
                            onChange={vm.handleInput}
                        />
                        <SpacerPX size={12} orientation={"v"}/>
                        <ProfileInput
                            label="Вид"
                            type="text"
                            name="type"
                            placeholder = "Вид"
                            value={vm.event.type}
                            onChange={vm.handleInput}
                        />
                        <SpacerPX size={12} orientation={"v"}/>
                        <ProfileInput
                            label="Место публикации"
                            type="text"
                            name="location"
                            placeholder = "Сайт/ название сборника"
                            value={vm.event.location}
                            onChange={vm.handleInput}
                        />
                    </>
                    //#endregion
                )}
                {vm.currentMode === vm.modes[4] && (
                    //#region Участие студентов
                    <>
                        <EventSelector
                            label="Форма участия"
                            defaultValues={vm.participationForms}
                            defaultIsExists={false}
                            onSelect={(value) => vm.handleSelect('formOfParticipation', value)}
                        />
                        <SpacerPX size={12} orientation={"v"}/>
                        <ProfileInput
                            label="Название мероприятия"
                            type="text"
                            name="name"
                            placeholder = "Название"
                            value={vm.event.name}
                            onChange={vm.handleInput}
                        />
                        <SpacerPX size={12} orientation={"v"}/>
                        <EventSelector
                            label="Форма мероприятия"
                            defaultValues={vm.eventForms}
                            onSelect={(value) => vm.handleSelect('formOfEvent', value)}
                        />
                        <SpacerPX size={12} orientation={"v"}/>
                        <EventSelector
                            label="Cтатус мероприятия"
                            defaultValues={vm.statuses}
                            onSelect={(value) => vm.handleSelect('status', value)}
                        />
                        <SpacerPX size={12} orientation={"v"}/>
                        <ProfileInput
                            label="Количество участников"
                            type="text"
                            inputMode="numeric"
                            name="participantsCount"
                            value={vm.event.participantsCount}
                            onChange={(e) => {
                                const newValue = vm.handleParticipantsCount(e.target.value);
                                e.target.value = newValue; // Синхронизируем значение
                            }}
                            title="Только положительные целые числа"
                            maxLength={10}
                        />
                        <SpacerPX size={12} orientation={"v"}/>
                        <div className={classes.label}>Результаты</div>
                        <SpacerPX size={12} orientation={"v"}/>
                        {vm.event.results && vm.event.results.map((result, index) => (
                            <>
                                <div key={index} className={classes.rowResult}>
                                    <div className={classes.titleResult}>
                                        <div className={classes.label}>{index + 1}.</div>
                                        <div className={classes.hint}>{result.result}</div>
                                    </div>
                                    {!result.file && (
                                        <button
                                            className={classes.buttonFile}
                                            onClick={() => {vm.handleFileSelect(index)}}
                                        >
                                            Добавить файл
                                        </button>)
                                    }
                                    {result.file && (
                                        <button
                                            className={classes.buttonFile}
                                            onClick={() => vm.handleRemoveFile(index)}
                                        >
                                            Удалить файл {result.file.name}
                                        </button>
                                    )}
                                </div>
                                <SpacerPX size={12} orientation={"v"}/>
                            </>
                        ))}
                        <button
                            className={classes.buttonFile}
                            onClick={() => vm.initNewResult()}
                            disabled={vm.event.participantsCount <= vm.event.results.length}
                        >
                            Добавить результат
                        </button>
                    </>
                    //#endregion
                )}
                <SpacerPX size={12} orientation={"v"}/>
                <div className={classes.label}>Дата мероприятия</div>
                <SpacerPX size={12} orientation={"v"}/>
                <DatePicker
                    selectedDate={vm.event.dateOfEvent}
                    handleDateSelect={vm.handleDateSelect}
                />
                {vm.error && (<>
                    <SpacerPX size={12} orientation={'v'}/>
                    <div className={classes.error}>{vm.error}</div>
                </>)}
                <SpacerPX size={12} orientation={"v"}/>
                <ButtonAuth onClick={() => vm.createForm(mCreateEvent, mLoadFiles)}>Создать</ButtonAuth>
            </div>

        </div>
    )

})