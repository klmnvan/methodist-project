import React, {useEffect, useRef, useState} from "react";
import classes from "../customDatePicker/CustomDatePicker.module.css";
import ButtonAuth from "@ui/button/buttonAuth/ButtonAuth.jsx";
import {IconArrowV2} from "@ui/icons/IconArrowV2.jsx";
import {IconCalendarV2} from "@ui/icons/IconCalendarV2.jsx";

export const DatePicker = ({ selectedDate, handleDateSelect, colorContainer = "var(--color-bg)" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selected, setSelected] = useState(selectedDate || null);

    const handleDateClick = (date) => {
        setSelected(date);
        if (handleDateSelect) {
            handleDateSelect(date);
        }
        setIsOpen(false); // Закрываем календарь после выбора даты
    };

    const formatDate = (date) => {
        return date ? date.toLocaleDateString("ru-RU") : "";
    };

    const changeMonth = (direction) => {
        setCurrentDate((prevDate) => {
            const newDate = new Date(prevDate);
            newDate.setMonth(prevDate.getMonth() + direction);
            return newDate;
        });
    };

    const daysInMonth = (month, year) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const monthNames = [
        "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
        "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
    ];

    const weekDayNames = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

    const getWeekDayMondayFirst = (date) => {
        let day = date.getDay();
        return day === 0 ? 7 : day;
    };

    const buildCalendarDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const daysCount = daysInMonth(month, year);
        const firstWeekDay = getWeekDayMondayFirst(firstDay);

        const calendarDays = [];

        for (let i = 1; i < firstWeekDay; i++) {
            calendarDays.push(null);
        }
        for (let i = 1; i <= daysCount; i++) {
            calendarDays.push(new Date(year, month, i));
        }

        return calendarDays;
    };

    const calendarDays = buildCalendarDays();

    //#region Обработка ввода даты
    const [inputDate, setInputDate] = useState("");

    //синхра
    useEffect(() => {
        if (selectedDate) {
            setSelected(selectedDate);
            setCurrentDate(new Date(selectedDate));
            setInputDate(formatDate(selectedDate));
        }
    }, [selectedDate]);

    const inputRef = useRef(null);
    const [cursorTarget, setCursorTarget] = useState(null);

    useEffect(() => {
        if (cursorTarget !== null && inputRef.current) {
            inputRef.current.setSelectionRange(cursorTarget, cursorTarget);
            setCursorTarget(null);
        }
    }, [inputDate, cursorTarget]);


    const [isInvalid, setIsInvalid] = useState(false);

    const parseAndValidateDate = (digitString) => {
        if (digitString.length !== 8) return null;

        const day = parseInt(digitString.slice(0, 2), 10);
        const month = parseInt(digitString.slice(2, 4), 10) - 1;
        const year = parseInt(digitString.slice(4, 8), 10);

        if (day < 1 || day > 31 || month < 0 || month > 11 || year < 1900 || year > 2100) {
            return null;
        }

        const date = new Date(year, month, day);

        if (date.getDate() === day && date.getMonth() === month && date.getFullYear() === year) {
            return date;
        }

        return null;
    }

    const handleInputDate = (e) => {
        const cursorPos = e.target.selectionStart;
        const newValueRaw = e.target.value.replace(/\D/g, "");
        const v = newValueRaw.slice(0, 8);
        const formatted = v.slice(0, 2) + (v.length >= 3 ? "." + v.slice(2, 4) : "") + (v.length >= 5 ? "." + v.slice(4) : "");

        // Проверяем валидность если введено 8 цифр
        if (v.length === 8) {
            const parsedDate = parseAndValidateDate(v);
            if (parsedDate) {
                // Валидная дата
                setIsInvalid(false);
                setSelected(parsedDate);
                setCurrentDate(parsedDate);
                if (handleDateSelect) {
                    handleDateSelect(parsedDate);
                }
            } else {
                // Невалидная дата
                setIsInvalid(true);
                // Сбрасываем через 2 секунды
                setTimeout(() => {
                    setInputDate(selected ? formatDate(selected) : "");
                    setIsInvalid(false);
                }, 2000);
            }
        } else {
            setIsInvalid(false);
        }

        const digitsBeforeCursor = e.target.value.slice(0, cursorPos).replace(/\D/g, "").length;
        let pos = 0, count = 0;
        for (let i = 0; i < formatted.length; i++) {
            if (formatted[i] !== '.') count++;
            if (count === digitsBeforeCursor) {
                pos = i + 1;
                break;
            }
        }
        if (formatted[pos] === '.') pos++;
        setCursorTarget(pos);
        setInputDate(formatted);
    }
    //#endregion

    return (
        <div className={classes.datepicker}>
            <div
                className={`${classes.dateRow} ${isInvalid ? classes.shake : ''}`}
                style={{
                    background: colorContainer,
                }}
            >
                <input
                    ref={inputRef}
                    type="text"
                    className={`${classes.dateDisplay} ${isInvalid ? classes.invalid : ''}`}
                    style={isInvalid ? { animation: 'shake 0.5s' } : {}}
                    value={inputDate}
                    onChange={handleInputDate}
                    placeholder="Выберите дату"
                    maxLength={10}
                />
                <ButtonAuth
                    onClick={() => setIsOpen(!isOpen)}
                    style={{background:"var(--color-primary)",
                        height: "auto"}}>
                    {isOpen ? "Скрыть" : "Изменить"}
                </ButtonAuth>

            </div>

            {isOpen && (
                <div className={classes.calendar}>
                    <div className={classes.monthHeader}>
                        <button className={classes.buttonArrow} onClick={() => changeMonth(-1)}>
                            <IconArrowV2 className={classes.icon}></IconArrowV2>
                        </button>
                        <div>

                        </div>
                        <div className={classes.monthRow}>
                            <IconCalendarV2/>
                            <div className={classes.monthTitle}>{`${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`}</div>
                        </div>
                        <button className={classes.buttonArrow} onClick={() => changeMonth(1)}
                                style={{transform: "rotate(180deg)"}}>
                            <IconArrowV2 className={classes.icon}></IconArrowV2>
                        </button>
                    </div>
                    <div className={classes.weekDaysRow}>
                        {weekDayNames.map((dayName, index) => (
                            <div key={index} className={classes.weekDay}>
                                {dayName}
                            </div>
                        ))}
                    </div>
                    <div className={classes.daysGrid}>
                        {calendarDays.map((date, i) => {
                            if (!date) {
                                return <div key={i} className={classes.emptyDay}></div>;
                            }
                            const isSelected = selected?.toDateString() === date.toDateString();

                            return (
                                <div
                                    key={i}
                                    className={`${classes.day} ${isSelected ? classes.selected : ""}`}
                                    onClick={() => handleDateClick(date)}
                                >
                                    {date.getDate()}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}