import classes from "./ProfileInput.module.css"
import icon_tick from "@images/icon_tick.svg";

export default function ProfileInput({label, ...props}) {
    return (
        <div className={classes.container}>
            <div className={classes.label}>{label}</div>
            <div className={classes.valueContainer}>
                <input
                    {...props}
                    className={classes.input}
                />
                {/*{icon_tick && value ? (
                    <img src={icon_tick} alt={""} className={classes.icon} />
                ) : null}*/}
            </div>
        </div>
    )
}