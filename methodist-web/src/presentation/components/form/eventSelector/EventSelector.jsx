import {useEffect, useRef, useState} from "react";
import classes from "./EventSelector.module.css";
import {IconTreg} from "@ui/icons/IconTreg.jsx";

export const EventSelector = ({ value, defaultValues = [], onSelect, label, defaultIsExists = true, bg="var(--color-container)", labelIsShow = true}) => {
    const [selectedValue, setSelectedValue] = useState(null);
    const [customValue, setCustomValue] = useState("");
    const [isCustom, setIsCustom] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const isInternalChange = useRef(false); // Флаг для отслеживания внутренних изменений

    useEffect(() => {
        // Пропускаем обработку, если изменение происходит изнутри компонента
        if (isInternalChange.current) {
            isInternalChange.current = false;
            return;
        }

        if(value) {
            // Проверяем, является ли value кастомным значением
            const isValueInList = defaultValues.some(item => {
                const itemName = typeof item === 'object' ? item.name : item;
                const valueName = typeof value === 'object' ? value.name : value;
                return itemName === valueName;
            });

            if (!isValueInList && typeof value === 'string') {
                // Кастомное значение
                setIsCustom(true);
                setSelectedValue("Другое");
                setCustomValue(value);
            } else {
                // Значение из списка
                setIsCustom(false);
                setSelectedValue(value);
                setCustomValue("");
            }
        } else if (value === "" && !isCustom) {
            // Если пустая строка и не режим "Другое", сбрасываем
            setSelectedValue(null);
            setIsCustom(false);
            setCustomValue("");
        }
    }, [value, defaultValues])

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
            isInternalChange.current = true; // Помечаем как внутреннее изменение
            setIsCustom(true);
            setSelectedValue(option);
            setCustomValue("");
            // НЕ вызываем onSelect с пустой строкой сразу
            setIsOpen(false);
        } else {
            isInternalChange.current = true; // Помечаем как внутреннее изменение
            setIsCustom(false);
            setSelectedValue(option);
            setCustomValue("");
            onSelect?.(option);
            setIsOpen(false);
        }
    };

    const handleCustomChange = (e) => {
        const val = e.target.value;
        setCustomValue(val);
        onSelect?.(val);
    };

    // Функция для получения отображаемого текста
    const getDisplayText = (val) => {
        if (!val) return "Выберите...";

        // Если это объект с name
        if (typeof val === 'object' && val !== null && val.name) {
            return val.name;
        }

        // Если это строка
        if (typeof val === 'string') {
            return val;
        }

        return "Выберите...";
    };

    // Функция для получения отображаемого текста опции
    const getOptionText = (option) => {
        if (typeof option === 'object' && option !== null && option.name) {
            return option.name;
        }
        return option;
    };

    // Функция для сравнения значений
    const isOptionSelected = (option) => {
        if (!selectedValue) return false;

        if (option === "Другое" && selectedValue === "Другое") {
            return true;
        }

        const optionName = typeof option === 'object' ? option.name : option;
        const selectedName = typeof selectedValue === 'object' ? selectedValue.name : selectedValue;

        return optionName === selectedName;
    };

    return (
        <div className={classes.container} ref={containerRef}>
            {labelIsShow && (<label className={classes.label}>{label}</label>)}
            <div
                className={classes.value}
                onClick={() => setIsOpen((prev) => !prev)}
                style={{backgroundColor: bg}}
                title={getDisplayText(selectedValue)}
            >
                <div className={classes.row}>
                    {selectedValue === "Другое" && isCustom ? (
                        <div className={classes.customInputWrapper}>
                            <div className={classes.hintOther}>Другое: </div>
                            <input style={{color: "var(--color-title)"}}
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
                        <div className={classes.customInputWrapper}>
                            <div
                                style={selectedValue ? {color: "var(--color-title)"} : {color: "var(--color-description)"}}
                            >
                                {getDisplayText(selectedValue)}
                            </div>
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
                                isOptionSelected(option) ? classes.active : ""
                            }`}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleSelect(option);
                            }}
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    handleSelect(option);
                                }
                            }}
                            role="option"
                            aria-selected={isOptionSelected(option)}
                        >
                            {getOptionText(option)}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};