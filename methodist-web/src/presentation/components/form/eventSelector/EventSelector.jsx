import {useEffect, useRef, useState} from "react";
import classes from "./EventSelector.module.css";
import {IconTreg} from "@ui/icons/IconTreg.jsx";

export const EventSelector = ({ value, defaultValues = [], onSelect, label, defaultIsExists = true, bg="var(--color-container)", labelIsShow = true}) => {
    const [selectedValue, setSelectedValue] = useState(null);
    const [customValue, setCustomValue] = useState("");
    const [isCustom, setIsCustom] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if(value) setSelectedValue(value)
    }, [value])

    const containerRef = useRef(null);

    const options = defaultIsExists
        ? [...defaultValues, "Другое"]
        : [...defaultValues];

    useEffect(() => {
        setIsOpen(false);
    }, [defaultValues, defaultIsExists]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (option) => {
        if (option === "Другое") {
            setIsCustom(true);
            setSelectedValue(option);
            onSelect?.("");
            setIsOpen(false);
        } else {
            setIsCustom(false);
            setSelectedValue(option);
            onSelect?.(option);
            setIsOpen(false);
        }
    };

    const handleCustomChange = (e) => {
        const val = e.target.value;
        setCustomValue(val);
        onSelect?.(val);
    };

    return (
        <div className={classes.container} ref={containerRef}>
            {labelIsShow && (<label className={classes.label}>{label}</label>)}
            <div
                className={classes.value}
                onClick={() => setIsOpen((prev) => !prev)}
                style={{backgroundColor: bg}}
            >
                <div className={classes.row}>
                    {selectedValue === "Другое" && isCustom ? (
                        <div className={classes.customInputWrapper}>
                            <div className={classes.hintOther}>Другое: </div>
                            <input
                                type="text"
                                className={classes.customInputInValue}
                                placeholder="введите свой вариант"
                                value={customValue}
                                onChange={handleCustomChange}
                                autoFocus
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    ) : (
                        <div
                            className={classes.customInputWrapper}
                            style={selectedValue ? {color: "var(--color-title)"} : {color: "var(--color-description)"}}
                        >
                            {selectedValue || "Выберите..."}
                        </div>
                    )}
                    <div className={classes.icon}>
                        <IconTreg/>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className={classes.dropdown} role="listbox"
                style={{backgroundColor: bg}}>
                    {options.map((option, i) => (
                        <div
                            key={i}
                            className={`${classes.option} ${
                                selectedValue === option ? classes.active : ""
                            }`}
                            onClick={(e) => {
                                e.stopPropagation(); // чтобы не закрывать дважды
                                handleSelect(option);
                            }}
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    handleSelect(option);
                                }
                            }}
                            role="option"
                            aria-selected={selectedValue === option}
                        >
                            {option}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};


