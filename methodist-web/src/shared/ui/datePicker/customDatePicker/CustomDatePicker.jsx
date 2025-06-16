import React, { useState, useEffect } from "react";
import classes from "./CustomDatePicker.module.css";

export const CustomDatePicker = ({ rangeValue, handleSetDateRange, bg = "var(--color-container)" }) => {
    const [dateRange, setDateRange] = useState({
        start: null,
        end: null,
    });
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        if (rangeValue) {
            setDateRange(rangeValue);
        }
    }, [rangeValue]);

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
        if (handleSetDateRange) {
            handleSetDateRange(newDateRange);
        }
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

    return (
        <div className={classes.datepicker}
        style={{background: bg}}>
            <div className={classes.calendar}>
                <div className={classes.title}>Текущий диапазон дат</div>
                <div className={classes.hintsRow}>
                    <div className={classes.dateViewer}>{formatDate(dateRange.start) || "не выбрано"}</div>
                    <div className={classes.t}>-</div>
                    <div className={classes.dateViewer}>{formatDate(dateRange.end) || "не выбрано"}</div>
                </div>
                <div className={classes.monthHeader}>
                    <button onClick={() => changeMonth(-1)}>{"<"}</button>
                    <div className={classes.monthTitle}>{`${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`}</div>
                    <button onClick={() => changeMonth(1)}>{">"}</button>
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