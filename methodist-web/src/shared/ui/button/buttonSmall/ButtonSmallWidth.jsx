import classes from "@ui/button/buttonSmall/buttonSmall.module.css";

export default function ButtonSmallWidth({children, ...props}) {
    return (
        <button
            {...props}
            className={classes.buttonAuth}
        >
            {children}
        </button>
    )
}