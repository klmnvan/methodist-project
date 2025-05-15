import classes from "./ProfileInput.module.css"

export default function ProfileInput({label, ...props}) {
    return (
        <div className={classes.container}>
            <div className={classes.label}>{label}</div>
            <div className={classes.valueContainer}>
                <input
                    {...props}
                    className={classes.input}
                />
            </div>
        </div>
    )
}