import React, { useState, useEffect, useRef } from "react";
import classes from "./CustomDatePicker.module.css";
import {IconArrowV2} from "@ui/icons/IconArrowV2.jsx";
import {IconCalendarV2} from "@ui/icons/IconCalendarV2.jsx";

export const CustomDatePicker = ({ rangeValue, handleSetDateRange, bg = "var(--color-container)" }) => {
    const [dateRange, setDateRange] = useState({
        start: null,
        end: null,
    });
    const [currentDate, setCurrentDate] = useState(new Date());

    const [inputStart, setInputStart] = useState("");
    const [inputEnd, setInputEnd] = useState("");
    const [isInvalidStart, setIsInvalidStart] = useState(false);
    const [isInvalidEnd, setIsInvalidEnd] = useState(false);

    const inputStartRef = useRef(null);
    const inputEndRef = useRef(null);
    const [cursorTargetStart, setCursorTargetStart] = useState(null);
    const [cursorTargetEnd, setCursorTargetEnd] = useState(null);

    useEffect(() => {
        if (rangeValue) {
            setDateRange(rangeValue);
            setInputStart(rangeValue.start ? formatDate(rangeValue.start) : "");
            setInputEnd(rangeValue.end ? formatDate(rangeValue.end) : "");
        }
    }, [rangeValue]);

    useEffect(() => {
        if (cursorTargetStart !== null && inputStartRef.current) {
            inputStartRef.current.setSelectionRange(cursorTargetStart, cursorTargetStart);
            setCursorTargetStart(null);
        }
    }, [inputStart, cursorTargetStart]);

    useEffect(() => {
        if (cursorTargetEnd !== null && inputEndRef.current) {
            inputEndRef.current.setSelectionRange(cursorTargetEnd, cursorTargetEnd);
            setCursorTargetEnd(null);
        }
    }, [inputEnd, cursorTargetEnd]);

    const handleDateClick = (date) => {
        let newDateRange;
        if (!dateRange.start || (dateRange.start && dateRange.end)) {
            newDateRange = { start: date, end: null };
        } else {
            newDateRange = {
                start: date < dateRange.start ? date : dateRange.start,
                end: date > dateRange.start ? date : dateRange.start,
            };
        }
        setDateRange(newDateRange);
        setInputStart(formatDate(newDateRange.start));
        setInputEnd(formatDate(newDateRange.end));
        if (handleSetDateRange) {
            handleSetDateRange(newDateRange);
        }
    };

    const formatDate = (date) => {
        return date ? date.toLocaleDateString("ru-RU") : "";
    };

    const parseAndValidateDate = (digitString) => {
        if (digitString.length !== 8) return null;
        const day = parseInt(digitString.slice(0, 2), 10);
        const month = parseInt(digitString.slice(2, 4), 10) - 1;
        const year = parseInt(digitString.slice(4, 8), 10);
        if (day < 1 || day > 31 || month < 0 || month > 11 || year < 1900 || year > 2100) return null;
        const date = new Date(year, month, day);
        if (date.getDate() === day && date.getMonth() === month && date.getFullYear() === year) {
            return date;
        }
        return null;
    }

    const handleInputStart = (e) => {
        const cursorPos = e.target.selectionStart;
        const newValueRaw = e.target.value.replace(/\D/g, "");
        const v = newValueRaw.slice(0, 8);
        const formatted = v.slice(0, 2) + (v.length >= 3 ? "." + v.slice(2, 4) : "") + (v.length >= 5 ? "." + v.slice(4) : "");

        if (v.length === 0) {
            setInputStart("");
            setDateRange(prev => ({ ...prev, start: null }));
            setCurrentDate(new Date());
            setIsInvalidStart(false);
            if (handleSetDateRange) handleSetDateRange({ ...dateRange, start: null });
            setCursorTargetStart(0);
            return;
        }

        if (v.length === 8) {
            const parsedDate = parseAndValidateDate(v);
            if (parsedDate) {
                setIsInvalidStart(false);
                let newStart = parsedDate;
                let newEnd = dateRange.end;

                if (newEnd && newStart > newEnd) {
                    [newStart, newEnd] = [newEnd, newStart];
                    setInputStart(formatDate(newStart));
                    setInputEnd(formatDate(newEnd));
                }

                const newRange = { start: newStart, end: newEnd };
                setDateRange(newRange);
                setCurrentDate(parsedDate);
                if (handleSetDateRange) handleSetDateRange(newRange);
            } else {
                setIsInvalidStart(true);
                const previousValue = inputStart;
                setTimeout(() => {
                    setInputStart(previousValue);
                    setIsInvalidStart(false);
                }, 2000);
                return;
            }
        } else {
            setIsInvalidStart(false);
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
        setCursorTargetStart(pos);
        setInputStart(formatted);
    }

    const handleInputEnd = (e) => {
        const cursorPos = e.target.selectionStart;
        const newValueRaw = e.target.value.replace(/\D/g, "");
        const v = newValueRaw.slice(0, 8);
        const formatted = v.slice(0, 2) + (v.length >= 3 ? "." + v.slice(2, 4) : "") + (v.length >= 5 ? "." + v.slice(4) : "");

        if (v.length === 0) {
            setInputEnd("");
            setDateRange(prev => ({ ...prev, end: null }));
            setIsInvalidEnd(false);
            if (handleSetDateRange) handleSetDateRange({ ...dateRange, end: null });
            setCursorTargetEnd(0);
            return;
        }

        if (v.length === 8) {
            const parsedDate = parseAndValidateDate(v);
            if (parsedDate) {
                setIsInvalidEnd(false);
                let newStart = dateRange.start;
                let newEnd = parsedDate;

                if (newStart && newEnd < newStart) {
                    [newStart, newEnd] = [newEnd, newStart];
                    setInputStart(formatDate(newStart));
                    setInputEnd(formatDate(newEnd));
                }

                const newRange = { start: newStart, end: newEnd };
                setDateRange(newRange);
                if (handleSetDateRange) handleSetDateRange(newRange);
            } else {
                setIsInvalidEnd(true);
                const previousValue = inputEnd;
                setTimeout(() => {
                    setInputEnd(previousValue);
                    setIsInvalidEnd(false);
                }, 2000);
                return;
            }
        } else {
            setIsInvalidEnd(false);
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
        setCursorTargetEnd(pos);
        setInputEnd(formatted);
    }

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

    return (
        <div className={classes.datepicker}
             style={{background: bg}}>
            <div className={classes.calendar}>
                <div className={classes.title}>Текущий диапазон дат</div>
                <div className={classes.hintsRow}>
                    <input
                        ref={inputStartRef}
                        type="text"
                        className={`${classes.dateViewer} ${isInvalidStart ? classes.invalid : ''} ${isInvalidStart ? classes.shake : ''}`}
                        value={inputStart}
                        onChange={handleInputStart}
                        placeholder="не выбрано"
                        maxLength={10}
                    />
                    <div className={classes.t}>-</div>
                    <input
                        ref={inputEndRef}
                        type="text"
                        className={`${classes.dateViewer} ${isInvalidEnd ? classes.invalid : ''} ${isInvalidEnd ? classes.shake : ''}`}
                        value={inputEnd}
                        onChange={handleInputEnd}
                        placeholder="не выбрано"
                        maxLength={10}
                    />
                </div>
                <div className={classes.monthHeader}>
                    <button className={classes.buttonArrow} onClick={() => changeMonth(-1)}>
                        <IconArrowV2 className={classes.icon}></IconArrowV2>
                    </button>
                    <div></div>
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
                        const isInRange =
                            dateRange.start &&
                            dateRange.end &&
                            date >= dateRange.start &&
                            date <= dateRange.end;
                        const isStart = dateRange.start?.toDateString() === date.toDateString();
                        const isEnd = dateRange.end?.toDateString() === date.toDateString();

                        return (
                            <div
                                key={i}
                                className={`${classes.day} ${
                                    isInRange ? classes.inRange : ""
                                } ${isStart ? classes.start : ""} ${isEnd ? classes.end : ""}`}
                                onClick={() => handleDateClick(date)}
                            >
                                {date.getDate()}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};