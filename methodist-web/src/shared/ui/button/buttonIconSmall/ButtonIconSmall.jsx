import classes from "@ui/button/buttonIconSmall/ButtonIconSmall.module.css";

export default function ButtonIconSmall({children, icon, background = "color-mix(in srgb, var(--color-primary) 20%, transparent)", color = "var(--color-primary)", width = "60%", ...props}) {
    return (
        <button
            {...props}
            style={{background: background, color: color, width: width}}
        >
            <div className={classes.icon}>
                {icon}
            </div>
            {children}
        </button>
    )
}