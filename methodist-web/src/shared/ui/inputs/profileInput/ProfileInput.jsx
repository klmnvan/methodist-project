import classes from "./ProfileInput.module.css"

export default function ProfileInput({label, bg="var(--color-container)", ...props}) {
    return (
        <div className={classes.container}>
            <div className={classes.label}>{label}</div>
            <div className={classes.valueContainer}
                 style={{background: bg}}>
                <input
                    {...props}
                    className={classes.input}
                />
            </div>
        </div>
    )
}