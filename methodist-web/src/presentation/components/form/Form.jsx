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
import {useCreateEvent} from "@/presentation/components/form/hooks/useCreateEvent.jsx";
import {useLoadFiles} from "@/presentation/components/form/hooks/useLoadFiles.jsx";
import {IconAddFile, IconFile, IconRemoveFile} from "@ui/icons/IconFile.jsx";
import {IconClose} from "@ui/icons/IconClose.jsx";
import ButtonIconSmall from "@ui/button/buttonIconSmall/ButtonIconSmall.jsx";
import {IconClear} from "@ui/icons/IconClear.jsx";

export const Form = observer(() => {

    const vm = useMemo(() => new FormVM(), [])
    const { statuses, results, eventForms, participationForms, ownerTypeByResults } = useStore()
    //#region React Queries
    const { mutate: mLoadFiles } = useLoadFiles()
    const { mutate: mCreateEvent } = useCreateEvent()
    //#endregion
    //#region Use Effects
    useEffect(() => {
        if(ownerTypeByResults) {
            vm.setOwnerTypeByResults(ownerTypeByResults)
        }
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

    useEffect(() => {
        if(ownerTypeByResults && participationForms &&
            eventForms && statuses && results) {
            vm.loadFromStorage() 
        }
    }, [eventForms, ownerTypeByResults, participationForms, results, statuses, vm])


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
                <div className={classes.rowModes}>
                    <ToggleBtnStat currentValue={vm.currentMode} values={vm.modes} onChange={ vm.selectMode }/>
                    <ButtonIconSmall
                        icon={<IconClear/>}
                        background="var(--color-error)"
                        color="white"
                        children="Очистить форму"
                        width="auto"
                        onClick={() => vm.resetForm()}
                    />
                </div>
                <SpacerPX size={20} orientation={"v"}/>
                {vm.currentMode === vm.modes[0] && (
                    //#region Участие
                    <>
                        <EventSelector
                            label="Форма участия"
                            defaultValues={vm.participationForms}
                            defaultIsExists={false}
                            value={vm.event.formOfParticipation}
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
                            value={vm.event.formOfEvent}
                            onSelect={(value) => vm.handleSelect('formOfEvent', value)}
                        />
                        <SpacerPX size={12} orientation={"v"}/>
                        <EventSelector
                            label="Cтатус мероприятия"
                            defaultValues={vm.statuses}
                            value={vm.event.status}
                            onSelect={(value) => vm.handleSelect('status', value)}
                        />
                        <SpacerPX size={12} orientation={"v"}/>
                        <div className={classes.label}>Результаты</div>
                        <SpacerPX size={12} orientation={"v"}/>
                        <div className={classes.label} style={{color: "var(--color-description)"}}>Вы можете дополнить Ваш результат файлом</div>
                        <SpacerPX size={12} orientation={"v"}/>
                        {vm.event.results && vm.event.results.map((result, index) => (
                            <>
                                <div key={index} className={classes.rowResult}>
                                    <span className={classes.numberItemResult}>{index + 1}</span>
                                    <div className={classes.resultSelector}>
                                        <EventSelector
                                            label="Результат"
                                            labelIsShow={false}
                                            defaultValues={vm.results}
                                            value={result.result}
                                            onSelect={(value) => vm.handleInputResult(value, index)}
                                        />
                                    </div>
                                    {!result.fileName && (
                                        <button
                                            className={classes.buttonIcon}
                                            onClick={() => {vm.handleFileSelect(index)}}
                                            title="Добавить файл"
                                        >
                                            <div className={classes.iconBox}>
                                                <IconAddFile/>
                                            </div>
                                        </button>
                                    )}
                                    {result.fileName && (
                                        <div className={classes.rowRemoveFile}>
                                            <div className={classes.fileName} title={result.fileName}>
                                                <span>{result.fileName}</span>
                                            </div>
                                            <button
                                                className={classes.buttonIcon}
                                                onClick={() => {vm.handleRemoveFile(index)}}
                                                style={{
                                                    background: 'var(--color-error)'
                                                }}
                                                title="Удалить файл"
                                            >
                                                <div className={classes.iconBox}>
                                                    <IconRemoveFile/>
                                                </div>
                                            </button>
                                        </div>
                                    )}
                                    <span className={classes.numberItemResult}
                                          style={{color: "#FFFFFF", cursor: "pointer", background: "color-mix(in srgb, #FD3535 90%, transparent)"}}
                                    >
                                        <div
                                            style={{
                                                width: '25px',
                                                height: '25px',
                                            }}
                                            onClick={() => {vm.removeResult(index)}}
                                            title="Удалить результат"
                                        >
                                            <IconClose/>
                                        </div>
                                    </span>
                                </div>
                                <SpacerPX size={12} orientation={"v"}/>
                            </>
                        ))}
                        <button
                            className={classes.buttonFile}
                            onClick={() => {
                                if (vm.event.results.length >= 4) {
                                    vm.setError('Количество результатов не может превышать 4');
                                    return;
                                }
                                vm.initNewResult();
                            }}
                        >
                            <span className={classes.value}>Добавить результат</span>
                        </button>
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
                            value={vm.event.formOfEvent}
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
                            value={vm.event.status}
                            onSelect={(value) => vm.handleSelect('status', value)}
                        />
                        <SpacerPX size={12} orientation={"v"}/>
                        <div className={classes.label}>Результаты</div>
                        <SpacerPX size={12} orientation={"v"}/>
                        <div className={classes.label} style={{color: "var(--color-description)"}}>Вы можете дополнить Ваш результат файлом</div>
                        <SpacerPX size={12} orientation={"v"}/>
                        {vm.event.results && vm.event.results.map((result, index) => (
                            <>
                                <div key={index} className={classes.rowResult}>
                                    <span className={classes.numberItemResult}>{index + 1}</span>
                                    <div className={classes.resultSelector}>
                                        <EventSelector
                                            label="Результат"
                                            labelIsShow={false}
                                            defaultValues={vm.results}
                                            value={result.result}
                                            onSelect={(value) => vm.handleInputResult(value, index)}
                                        />
                                    </div>
                                    {!result.fileName && (
                                        <button
                                            className={classes.buttonIcon}
                                            onClick={() => {vm.handleFileSelect(index)}}
                                            title="Добавить файл"
                                        >
                                            <div className={classes.iconBox}>
                                                <IconAddFile/>
                                            </div>
                                        </button>
                                    )}
                                    {result.fileName && (
                                        <div className={classes.rowRemoveFile}>
                                            <div className={classes.fileName} title={result.fileName}>
                                                <span>{result.fileName}</span>
                                            </div>
                                            <button
                                                className={classes.buttonIcon}
                                                onClick={() => {vm.handleRemoveFile(index)}}
                                                style={{
                                                    background: 'var(--color-error)'
                                                }}
                                                title="Удалить файл"
                                            >
                                                <div className={classes.iconBox}>
                                                    <IconRemoveFile/>
                                                </div>
                                            </button>
                                        </div>
                                    )}
                                    <span className={classes.numberItemResult}
                                          style={{color: "#FFFFFF", cursor: "pointer", background: "color-mix(in srgb, #FD3535 90%, transparent)"}}
                                    >
                                        <div
                                            style={{
                                                width: '25px',
                                                height: '25px',
                                            }}
                                            onClick={() => {vm.removeResult(index)}}
                                            title="Удалить результат"
                                        >
                                            <IconClose/>
                                        </div>
                                    </span>
                                </div>
                                <SpacerPX size={12} orientation={"v"}/>
                            </>
                        ))}
                        <button
                            className={classes.buttonFile}
                            onClick={() => {
                                if (vm.event.results.length >= 4) {
                                    vm.setError('Количество результатов не может превышать 4');
                                    return;
                                }
                                vm.initNewResult();
                            }}
                        >
                            <span className={classes.value}>Добавить результат</span>
                        </button>
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
                            onChange={(e) => e.target.value = vm.handleNumericInput(e.target.value, 'quantityOfHours')}
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
                            value={vm.event.formOfParticipation}
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
                            value={vm.event.formOfEvent}
                            onSelect={(value) => vm.handleSelect('formOfEvent', value)}
                        />
                        <SpacerPX size={12} orientation={"v"}/>
                        <EventSelector
                            label="Cтатус мероприятия"
                            defaultValues={vm.statuses}
                            value={vm.event.status}
                            onSelect={(value) => vm.handleSelect('status', value)}
                        />
                        <SpacerPX size={12} orientation={"v"}/>
                        <ProfileInput
                            label="Количество участников"
                            type="text"
                            inputMode="numeric"
                            name="participantsCount"
                            value={vm.event.participantsCount}
                            onChange={(e) => e.target.value = vm.handleNumericInput(e.target.value, 'participantsCount')}
                            title="Только положительные целые числа"
                            maxLength={3}
                        />
                        <SpacerPX size={12} orientation={"v"}/>
                        <div className={classes.label}>Результаты</div>
                        <SpacerPX size={12} orientation={"v"}/>
                        <div className={classes.label} style={{color: "var(--color-description)"}}>Вы можете дополнить Ваш результат файлом</div>
                        <SpacerPX size={12} orientation={"v"}/>
                        {vm.event.results && vm.event.results.map((result, index) => (
                            <>
                                <div key={index} className={classes.rowResult}>
                                    <span className={classes.numberItemResult}>{index + 1}</span>
                                    <div className={classes.resultSelector}>
                                        <EventSelector
                                            label="Результат"
                                            labelIsShow={false}
                                            defaultValues={vm.results}
                                            value={result.result}
                                            onSelect={(value) => vm.handleInputResult(value, index)}
                                        />
                                    </div>
                                    {!result.fileName && (
                                        <button
                                            className={classes.buttonIcon}
                                            onClick={() => {vm.handleFileSelect(index)}}
                                            title="Добавить файл"
                                        >
                                            <div className={classes.iconBox}>
                                                <IconAddFile/>
                                            </div>
                                        </button>
                                    )}
                                    {result.fileName && (
                                        <div className={classes.rowRemoveFile}>
                                            <div className={classes.fileName} title={result.fileName}>
                                                <span>{result.fileName}</span>
                                            </div>
                                            <button
                                                className={classes.buttonIcon}
                                                onClick={() => {vm.handleRemoveFile(index)}}
                                                style={{
                                                    background: 'var(--color-error)'
                                                }}
                                                title="Удалить файл"
                                            >
                                                <div className={classes.iconBox}>
                                                    <IconRemoveFile/>
                                                </div>
                                            </button>
                                        </div>
                                    )}
                                    <span className={classes.numberItemResult}
                                          style={{color: "#FFFFFF", cursor: "pointer", background: "color-mix(in srgb, #FD3535 90%, transparent)"}}
                                    >
                                        <div
                                            style={{
                                                width: '25px',
                                                height: '25px',
                                            }}
                                            onClick={() => {vm.removeResult(index)}}
                                            title="Удалить результат"
                                        >
                                            <IconClose/>
                                        </div>
                                    </span>
                                </div>
                                <SpacerPX size={12} orientation={"v"}/>
                            </>
                        ))}
                        <button
                            className={classes.buttonFile}
                            onClick={() => {
                                if (vm.event.participantsCount <= vm.event.results.length) {
                                    vm.setError('Количество результатов не может превышать количество участников');
                                    return;
                                }
                                vm.initNewResult();
                            }}
                        >
                            <span className={classes.value}>Добавить результат</span>
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