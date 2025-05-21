import {useState} from "react";
import classes from "@ui/selectors/sortSelector/SortSelector.module.css";
import SpacerPX from "@ui/spacers/SpacerPX.jsx";

export default function SortSelector({title, selectedValue, options, onChange}) {
    const [isOpen, setIsOpen] = useState(false);
    const selectedOption = options.find(opt => opt.id === selectedValue);

    return (
        <div className={classes.container} onClick={() => setIsOpen(!isOpen)}>
            <label className={classes.label}>{title}</label>
            <SpacerPX orientation={"h"} size={4}/>
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
    )
}