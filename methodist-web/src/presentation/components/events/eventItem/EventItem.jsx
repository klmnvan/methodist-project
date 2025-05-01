import classes from './EventItem.module.css'
import {IconClock} from "@ui/icons/IconClock.jsx";
import SpacerV from "@ui/spacers/SpacerV.jsx";
import {formatEventDate} from "@/data/converters/FormatEventDate.jsx";
import SpacerEM from "@ui/spacers/SpacerEM.jsx";

export default function EventItem({event}) {
    return (
        <div className={classes.background}>
            <div className={classes.rowDate}>
                <div className={classes.date}>
                    <div style={{height: '60%'}}>
                        <IconClock style={{height: "100%", width: "auto"}}/>
                    </div>
                    <SpacerV orientation='h' size={0.5}/>
                    <div style={{flexGrow: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                        {formatEventDate(event.dateOfEvent)}
                    </div>
                </div>
                <div className={classes.btns}>
                    <div
                        className={classes.approveBtn}
                        style={{
                            background: !event.isApproved
                                ? "color-mix(in srgb, var(--color-primary) 20%, transparent)"
                                : "var(--color-primary)",
                            color: !event.isApproved
                                ? "var(--color-primary)"
                                : "var(--color-title)",
                    }}>
                        {event.isApproved ? "Одобрено" : "Не одобрено"}
                    </div>
                    <SpacerV orientation='h' size={1}/>
                    <div className={classes.categoryBtn}>
                        {event.typeOfEvent.name}
                    </div>
                </div>
            </div>
            <SpacerV orientation='v' size={1}/>
            <div className={classes.title}>
                {`${event.name}`}
            </div>
            <SpacerV orientation='v' size={1}/>

            <div className={classes.gradientLine}/>
            <SpacerV orientation='v' size={1}/>

            <div className={classes.description}>
                {`Описание: ${event.description}`}
            </div>

        </div>
    )
}

