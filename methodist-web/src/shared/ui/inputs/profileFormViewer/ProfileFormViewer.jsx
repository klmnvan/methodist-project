import classes from './ProfileFormViewer.module.css';
import icon_tick from "@images/icon_tick.svg"

export default function ProfileFormViewer({label, value}) {
    return (
        <div className={classes.container}>
            <div className={classes.label}>{label}</div>
            <div className={classes.valueContainer}>
                <div className={classes.value}>{value || "Не указано"}</div>
                {icon_tick && value ? (
                    <img src={icon_tick} alt={""} className={classes.icon}/>
                ) : null
                }
            </div>
        </div>
    )
}