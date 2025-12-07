import {observer} from "mobx-react-lite";
import classes from "./Form.module.css"
import {ToggleBtnStat} from "@ui/toggleButtons/toggleBtnStat/ToggleBtnStat.jsx";
import {useEffect, useMemo, useRef} from "react";
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

export const Form = observer(() => {

    const vm = useMemo(() => new FormVM(), [])
    const { statuses, results, eventForms, participationForms, ownerTypeByResults } = useStore()
    const { mutate: mLoadFiles } = useLoadFiles()
    const { mutate: mCreateEvent } = useCreateEvent()
    const fileInputRef = useRef(null);
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

    const handleFileSelect = (event) => {
        const files = Array.from(event.target.files);
        const maxFiles = 3;
        const maxSize = 200 * 1024 * 1024; // 200 МБ в байтах

        if (files.length === 0) {
            event.target.value = '';
            return;
        }

        // Проверка количества файлов
        if (files.length > maxFiles) {
            alert(`Можно загрузить не более ${maxFiles} файлов`);
            event.target.value = '';
            return;
        }

        // Проверка общего количества файлов (текущие + новые)
        const totalFiles = vm.selectedFiles.length + files.length;
        if (totalFiles > maxFiles) {
            alert(`Можно загрузить не более ${maxFiles} файлов. У вас уже ${vm.selectedFiles.length} файлов`);
            event.target.value = '';
            return;
        }

        // Проверка размера каждого файла
        const oversizedFiles = files.filter(file => file.size > maxSize);
        if (oversizedFiles.length > 0) {
            const oversizedFileNames = oversizedFiles.map(f => f.name).join(', ');
            alert(`Следующие файлы превышают лимит 200 МБ: ${oversizedFileNames}`);
            event.target.value = '';
            return;
        }

        // Если все проверки пройдены, добавляем файлы
        if (files.length > 0) {
            vm.addFiles(files);
            console.log('Состояние после добавления:', vm.selectedFiles);
        }

        event.target.value = '';
    };

    const handleAddFilesClick = () => {
        fileInputRef.current?.click();
    };

    const handleRemoveFile = (index) => {
        vm.removeFile(index);
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

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
                )}
                {vm.currentMode === vm.modes[1] && (
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
                )}
                {vm.currentMode === vm.modes[2] && (
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
                )}
                {vm.currentMode === vm.modes[3] && (
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
                )}
                {vm.currentMode === vm.modes[4] && (
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
                            <div key={index} className={classes.rowResult}>
                                <>{result.result}</>
                                <SpacerPX size={12} orientation={"v"}/>
                            </div>
                        ))}
                        <button
                            className={classes.buttonFile}
                            type="button"
                            onClick={() => vm.initNewResult()}
                        >
                            Добавить результат
                        </button>
                    </>
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
                <SpacerPX size={20} orientation={"v"}/>
                <div className={classes.label}>Подтверждение документа (при наличии)</div>
                <SpacerPX size={12} orientation={"v"}/>
                <div className={classes.hint}>Загрузите файлы поддерживаемого типа. Размер файла – не более 200 MB.</div>
                <SpacerPX size={12} orientation={"v"}/>
                <div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        multiple
                        onChange={handleFileSelect}
                        style={{ display: 'none' }}
                    />
                    <button
                        className={classes.buttonFile}
                        type="button"
                        onClick={handleAddFilesClick}
                        disabled={vm.selectedFiles.length >= 3} // Отключаем кнопку при достижении лимита
                    >
                        {vm.selectedFiles.length >= 3 ? 'Достигнут лимит файлов' : 'Выбрать файлы'}
                    </button>
                </div>

                <div>
                    {vm.selectedFiles.length > 0 && (
                        <div>
                            <SpacerPX size={12} orientation={"v"}/>
                            <div className={classes.label}>Загруженные файлы ({vm.selectedFiles.length})</div>
                            <SpacerPX size={12} orientation={"v"}/>
                            {vm.selectedFiles.map((file, index) => (
                                <div className={classes.fileBox}>
                                    <div className={classes.fileIcon}>
                                        <svg>
                                            <IconFile/>
                                        </svg>
                                    </div>
                                    <SpacerPX size={12} orientation={"h"}/>
                                    <div className={classes.label}>{file.name}</div>
                                    <SpacerPX size={12} orientation={"h"}/>
                                    <div className={classes.label}>{formatFileSize(file.size)}</div>
                                    <SpacerPX size={12} orientation={"h"}/>
                                    <div style={{flex: 1}}></div> {/* Занимает все доступное пространство */}
                                    <div className={classes.fileIcon} onClick={() => handleRemoveFile(index)} style={{color:'var(--color-error)'}} >
                                        <svg>
                                            <IconDelete/>
                                        </svg>
                                    </div>

                                    <SpacerPX size={12} orientation={"h"}/>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <SpacerPX size={12} orientation={"v"}/>
                <ButtonAuth onClick={() => vm.createForm(mCreateEvent, mLoadFiles)}>Создать</ButtonAuth>
            </div>

        </div>
    )

})