import classes from './AuthInput.module.css'

export default function AuthInput({ label, type = "text", ...props }) {
    return (<div className={classes.inputAuth}>
        <div>{label}</div>
        <input
            {...props}
            type={type}
        />
    </div>)
}

