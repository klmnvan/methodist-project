import {useEffect, useState} from "react";
import classes from "./EventSelector.module.css"
import {IconRadioBtnOn} from "@ui/icons/IconRadioBtnOn.jsx";
import {IconRadioBtnOff} from "@ui/icons/IconRadioBtnOff.jsx";

export const EventSelector = ({defaultValues, onSelect, label, defaultIsExists = true}) => {
    const [options, setOptions] = useState(
        defaultIsExists === true ? [...defaultValues, ""] : [...defaultValues]
    );
    const [selectedIndex, setSelectedIndex] = useState(null);

    useEffect(() => {
        setOptions(
            defaultIsExists ? [...(defaultValues || []), ""] : [...(defaultValues || [])]
        );
    }, [defaultValues, defaultIsExists]);

    const handleSelect = (index) => {
        setSelectedIndex(index);
        onSelect?.(options[index]);
    };

    const handleCustomChange = (e) => {
        const newValue = e.target.value;
        const newOptions = [...options];
        newOptions[newOptions.length - 1] = newValue;
        setOptions(newOptions);
        if (selectedIndex === options.length - 1) {
            onSelect?.(newValue);
        }
    };

    return (
        <>
            <h3 className={classes.label}>{label}</h3>
            <div className={classes.optionsList}>
                {options.map((option, index) => (
                    <div
                        key={index}
                        className={selectedIndex !== index ? classes.optionItem : `${classes.optionItem} ${classes.active}`}
                        onClick={() => handleSelect(index)}
                    >
                        <div className={classes.icon}>
                            { selectedIndex === index ? (<IconRadioBtnOn/>) : (<IconRadioBtnOff/>) }
                        </div>
                        {defaultIsExists && index === options.length - 1 ? (
                            <div className={classes.customOption}>
                                <span>Другое: </span>
                                <input
                                    type="text"
                                    placeholder="свой вариант"
                                    name = {name}
                                    value={option}
                                    onChange={handleCustomChange}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>
                        ) : (
                            option
                        )}
                    </div>
                ))}
            </div>
        </>
    );


}