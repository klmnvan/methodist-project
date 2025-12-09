import {observer} from "mobx-react-lite";
import {Dialog} from "@mui/material";
import {getEventColor, getTitleEvent} from "@/presentation/components/events/eventItem/EventItem.jsx";
import classes from "./EventDialog.module.css"
import {IconClose} from "@ui/icons/IconClose.jsx";
import {IconEdit} from "@ui/icons/IconEdit.jsx";
import {IconEventBox} from "@ui/icons/IconEventBox.jsx";
import default_icon from "@images/default_image.svg"
import {postService} from "@/data/network/PostService.js";
import {useEffect, useState} from "react";
import {EventDialogVM} from "@/presentation/components/events/eventDialog/EventDialogVM.js";
import {IconDelete} from "@ui/icons/IconDelete.jsx";
import {useMutation} from "@tanstack/react-query";
import {useStore} from "@/presentation/providers/AppStoreProvider.jsx";
import {IconCancel} from "@ui/icons/IconCancel.jsx";
import ProfileInput from "@ui/inputs/profileInput/ProfileInput.jsx";
import ButtonAuth from "@ui/button/buttonAuth/ButtonAuth.jsx";
import {DatePicker} from "@ui/datePicker/datePicker/DatePicker.jsx";
import {EventSelector} from "@/presentation/components/form/eventSelector/EventSelector.jsx";
import {IconFile} from "@ui/icons/IconFile.jsx";

export const EventDialog = observer(({ event, onClose}) => {

    const [vm] = useState(() => new EventDialogVM())

    const { queryClient } = useStore()

    const { statuses, results, eventForms, participationForms } = useStore()

    const { mutate: deleteEvent, isSuccess: deleted } = useMutation({
        mutationKey: "deleteEvent",
        mutationFn: (id) => postService.deleteEvent(id),
    });

    const { mutate: updateEvent, isSuccess: updated } = useMutation({
        mutationKey: "updateEvent",
        mutationFn: ({event, id}) => postService.updateEvent(event, id),
    });

    const { mutate: getFile, isSuccess: fileSuccess } = useMutation({
        mutationKey: "getFile",
        mutationFn: (fileName) => postService.getResultFile(fileName),
    });

    const handleDownload = (fileName) => {
        const link = document.createElement('a');
        link.href = `http://localhost/Event/Uploads/${fileName}`;
        link.download = fileName; // Указываем имя файла для скачивания
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    useEffect(() => {
        if(deleted) {
            onClose()
            queryClient.invalidateQueries({
                queryKey: ['events'],
                exact: true,
            });
        }
    }, [deleted, onClose, queryClient])

    useEffect(() => {
        if(updated) {
            vm.swapMode()
            queryClient.invalidateQueries({
                queryKey: ['events'],
                exact: true,
            });
        }
    }, [updated, queryClient, vm])

    useEffect(() => {
        vm.setEvent(event)
    })

    const formatFieldValue = (fieldName, value) => {
        if (!value) return 'Не указано';

        if (fieldName === 'dateOfEvent') {
            return new Date(value).toLocaleDateString('ru-RU');
        }

        return value.toString();
    };

    return (
        <Dialog open={!!event} onClose={onClose} fullScreen className={classes.dialog}
                PaperProps={{style: {backgroundColor: 'transparent',boxShadow: 'none',}}}>
            <div className={classes.container}>
                <div className={classes.rowHeader}>
                    <div className={classes.title}>Сведения о мероприятии</div>
                    <div className={classes.rowIcons}>
                        <div className={classes.icon} style={{color: "var(--color-error)"}} onClick={() => vm.swapMode()}>
                            {vm.mode === vm.modes[0] ? <IconEdit/> : <IconCancel/>}
                        </div>
                        <div className={classes.icon} onClick={onClose}>
                            <IconClose/>
                        </div>
                    </div>
                </div>
                <div className={classes.rowMode}>
                    Режим {vm.mode}
                </div>
                <div className={classes.rowTitles}>
                    <div className={classes.rowIconTitles}>
                        <div className={classes.icon} style={{color: getEventColor(event.typeOfEvent.name)}}>
                            <IconEventBox style={{height: "100%", width: "auto"}}/>
                        </div>
                        <div className={classes.columnTitles}>
                            <div className={classes.title}>{getTitleEvent(event)}</div>
                            <div className={classes.type} style={{color:`${getEventColor(event.typeOfEvent.name)}`}}>{event.typeOfEvent.name}</div>
                        </div>
                    </div>

                    <div className={classes.dateColumn}>
                        <div className={classes.create}>{event.createdAt && `Создано: ${formatDate(event.createdAt)}`}</div>
                        {event.createdAt === event.updatedAt || (<div className={classes.update}>{event.updatedAt && `Изменено: ${formatDate(event.updatedAt)}`}</div>)}

                    </div>
                </div>
                <div className={classes.line}/>
                <div className={classes.rowProfile}>
                    {event.profile && event.profile.imageUrl ? (
                            <img className={classes.avatar}
                                src={`${postService.BASE_URL}Profile/Uploads/${event.profile.imageUrl}`}
                                alt={event.profile.lastName}
                            />) :
                        (
                            <img className={classes.avatar}
                                alt={"default_avatar"}
                                src={default_icon}
                            />
                        )
                    }
                    <div className={classes.columnTitles}>
                        <div className={classes.name}>
                            {`${event.profile?.lastName} ${event.profile?.firstName} ${event.profile?.patronymic}`}
                        </div>
                        <div className={classes.commission}>{event.profile?.mc?.name}</div>
                    </div>
                </div>
                {vm.mode === vm.modes[0] ? (
                    /*Просмотр*/
                    <>
                        <div className={classes.fields}>
                            {event && vm.getFieldsForEventType(event.typeOfEvent.name).map(field => (
                                <div key={field} className={classes.fieldInfo}>
                                    <div className={classes.label}>{vm.getFieldLabel(field)}:</div>
                                    <div className={classes.value}>
                                        {formatFieldValue(field, event[field])}
                                    </div>
                                </div>
                            ))}
                            {event.results && event.results.length > 0 &&
                                <>
                                    <div className={classes.label}>Результаты</div>
                                    {event.results.map(file => (
                                        <div className={classes.rowResult}>
                                            <div className={classes.value}>
                                                {file.result}
                                            </div>
                                            { file.fileName && true &&
                                                <>
                                                    <div className={classes.iconBox}
                                                         onClick={ () => handleDownload(file.fileName) }
                                                         style={{
                                                             cursor: 'pointer',
                                                         }}>
                                                        Скачать файл
                                                    </div>
                                                </>
                                            }

                                        </div>
                                    ))
                                    }
                                </>
                            }
                        </div>
                        <button className={classes.button} onClick={() => deleteEvent(event.id)}>
                            <svg style={{width:'24px', height:'24px'}}>
                                <IconDelete/>
                            </svg>
                        </button>
                    </>
                ) : (
                    /*Редактирование*/
                    <>
                        <div className={classes.fields}>
                            {event && vm.getFieldsForEventType(event.typeOfEvent.name).map(field => (
                                <>
                                    {['name', 'type', 'location'].includes(field) && (
                                        <div key={field} className={classes.fieldInfo}>
                                            <ProfileInput
                                                label={vm.getFieldLabel(field)}
                                                type={"text"}
                                                name={field}
                                                value={vm.draftEvent[field]}
                                                onChange={(e) => vm.draftEvent[field] = e.target.value}
                                                bg="var(--color-bg)"
                                            />
                                        </div>
                                    )}
                                    {field === 'formOfParticipation' && (
                                        <div key={field} className={classes.fieldInfo}>
                                            <EventSelector
                                                value={vm.draftEvent[field]}
                                                label="Форма участия"
                                                defaultValues={participationForms}
                                                defaultIsExists={false}
                                                onSelect={(value) => vm.onSelect('formOfParticipation', value)}
                                                bg="var(--color-bg)"
                                            />
                                        </div>
                                    )}
                                    {field === 'formOfEvent' && (
                                        <div key={field} className={classes.fieldInfo}>
                                            <EventSelector
                                                value={vm.draftEvent[field]}
                                                label="Форма мероприятия"
                                                defaultValues={eventForms}
                                                onSelect={(value) => vm.onSelect('formOfEvent', value)}
                                                bg="var(--color-bg)"
                                            />
                                        </div>
                                    )}
                                    {field === 'status' && (
                                        <div key={field} className={classes.fieldInfo}>
                                            <EventSelector
                                                value={vm.draftEvent[field]}
                                                label="Статус мероприятия"
                                                defaultValues={statuses}
                                                onSelect={(value) => vm.onSelect('status', value)}
                                                bg="var(--color-bg)"
                                            />
                                        </div>
                                    )}
                                    {field === 'result' && (
                                        <div key={field} className={classes.fieldInfo}>
                                            <EventSelector
                                                value={vm.draftEvent[field]}
                                                label="Результат"
                                                defaultValues={results}
                                                onSelect={(value) => vm.onSelect('result', value)}
                                                bg="var(--color-bg)"
                                            />
                                        </div>
                                    )}
                                    {field === 'dateOfEvent' && (
                                        <DatePicker
                                            selectedDate={vm.draftEvent.dateOfEvent}
                                            handleDateSelect={vm.handleDateSelect}
                                            bg="var(--color-bg)"
                                        />
                                    )}
                                </>
                            ))}
                        </div>
                        <ButtonAuth onClick={() => {
                            const draftEventWithDateString = {
                                ...vm.draftEvent,
                                dateOfEvent: vm.draftEvent.dateOfEvent.toISOString() // преобразуем Date в строку Timestamptz
                            };

                            updateEvent({ event: draftEventWithDateString, id: event.id });
                        }}>Сохранить</ButtonAuth>
                    </>
                )}

            </div>
        </Dialog>
    )
})

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}.${month}.${year} ${hours}:${minutes}`;
}