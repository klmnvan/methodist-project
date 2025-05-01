import classes from './Buttons.module.css'

export default function ButtonAuth({children, ...props}) {
    return (
        <button
            {...props}
            className={classes.buttonAuth}
        >
            {children}
        </button>
    )
}