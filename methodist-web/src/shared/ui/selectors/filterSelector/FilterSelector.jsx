import classes from "@ui/selectors/filterSelector/FilterSelector.module.css";
import {useState} from "react";

export default function FilterSelector({title, icon, selectedValue, options, onChange}) {
    const [isOpen, setIsOpen] = useState(false);
    const selectedOption = options.find(opt => opt.id === selectedValue);

    return (
        <div className={classes.container} onClick={() => setIsOpen(!isOpen)}>
            <div className={classes.columnValues}>
                <label className={classes.label}>{title}</label>
                <div className={classes.selectedValue}>
                    {selectedOption?.name || "Выберите..."}
                </div>

                {isOpen && (
                    <div className={classes.dropdown}>
                        {options.map((option) => (
                            <div
                                key={option.value}
                                className={classes.option}
                                onClick={() => {
                                    console.log(option.id)
                                    onChange(option.id);
                                    setIsOpen(false);
                                }}
                            >
                                {option.name}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className={classes.icon}>
                <svg>
                    {icon}
                </svg>
            </div>
        </div>
    )
}

