import classes from './EventItem.module.css'
import {IconEventBox} from "@ui/icons/IconEventBox.jsx";
import {IconDate} from "@ui/icons/IconDate.jsx";
import {formatDateDDMMYYYY} from "@/data/converters/FormatDateDDMMYYYY.jsx";
import SpacerPX from "@ui/spacers/SpacerPX.jsx";

export default function EventItem({event, onClick}) {
    return (
        <div className={classes.background} onClick={onClick}>
            <div className={classes.rowTitle}>
                <div style={{color: getEventColor(event.typeOfEvent.name), height: "100%", width: "auto" }}>
                    <IconEventBox style={{height: "100%", width: "auto"}}/>
                </div>
                <SpacerPX orientation="h" size={8}/>
                <div className={classes.column}>
                    <div className={classes.title}>{getTitleEvent(event)}</div>
                    <SpacerPX orientation="v" size={4}/>
                    <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                        <div style={{color: "var(--color-outline)", height: "100%", width: "auto"} }>
                            <IconDate style={{height: "100%", width: "auto"}}/>
                        </div>
                        <SpacerPX orientation="h" size={8}/>
                        <div className={classes.date}>{formatDateDDMMYYYY(event.dateOfEvent)}</div>
                    </div>
                </div>
            </div>
            <SpacerPX orientation="v" size={16}/>
            <div className={classes.gradientLine}/>
            <SpacerPX orientation="v" size={12}/>
            <div className={classes.btns}>
                <div
                    className={classes.approveBtn}
                    style={{
                        background: !event.isApproved
                            ? "color-mix(in srgb, var(--color-primary) 20%, transparent)"
                            : "var(--color-primary)",
                        color: !event.isApproved
                            ? "var(--color-primary)"
                            : "#FFFFFF",
                    }}>
                    {event.isApproved ? "Одобрено" : "Не одобрено"}
                </div>
                <div
                    className={classes.categoryBtn}
                    style={{
                        background: `color-mix(in srgb, ${getEventColor(event.typeOfEvent.name)} 20%, transparent)`,
                        color: getEventColor(event.typeOfEvent.name)
                }}>
                    {event.typeOfEvent.name}
                </div>
            </div>

            <SpacerPX orientation='v' size={12}/>
            {/*для описания*/}
            <div className={classes.description}>
                {getDescriptionEvent(event)}
            </div>
            <SpacerPX orientation='v' size={12}/>
            <div className={classes.profileRow}>
                <div className={classes.name}>{`${event.profile.firstName} ${event.profile.patronymic} ${event.profile.lastName}`}</div>
                <SpacerPX orientation="v" size={4}/>
                <div className={classes.mc}>{`Комиссия ${event.profile && event.profile.mc && event.profile.mc.name || "не указана" }`}</div>
            </div>

        </div>
    )
}

export const getEventColor = (category) => {
    if (category === 'Участие') return '#22B07D';
    if (category === 'Стажировка') return '#C184FF';
    if (category === 'Публикация') return '#FF7C3B';
    if (category === 'Проведение') return '#1977FF';
    // Далее другие варианты
    return 'transparent';
};


const getDescriptionEvent = (event) => {
    switch(event.typeOfEvent.name) {
        case "Участие":
            return event.formOfEvent;
        case "Проведение":
            return event.location;
        case "Стажировка":
            return `Количество часов: ${event.quantityOfHours}`;
        case "Публикация":
            return event.location;
        default:
            return "";
    }
}

export const getTitleEvent = (event) => {
    switch(event.typeOfEvent.name) {
        case "Участие":
            return event.name;
        case "Проведение":
            return event.name;
        case "Стажировка":
            return event.location;
        case "Публикация":
            return event.name;
        default:
            return "";
    }
}