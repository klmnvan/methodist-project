import classes from './Buttons.module.css'

export default function ButtonAuth({children, ...props}) {
    return (
        <button
            className={classes.buttonAuth}
            {...props}
        >
            {children}
        </button>
    )
}

