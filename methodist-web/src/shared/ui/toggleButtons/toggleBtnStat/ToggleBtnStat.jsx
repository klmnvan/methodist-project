import classes from "./ToggleBtnStat.module.css"

export const ToggleBtnStat = ({values, onChange, currentValue}) => {

    const sections = values.map(((value, i) =>
        <li
            className={`${currentValue !== value ? classes.section : `${classes.section} ${classes.active}`}`}
            onClick={() => {
                onChange(value)
            }}
            key={i}
        >{value}</li>
    ))

    return (
        <div className={classes.container}>
            {sections}
        </div>
    )
}