import {useEffect, useState} from "react";
import classes from "../customDatePicker/CustomDatePicker.module.css";
import ButtonAuth from "@ui/button/buttonAuth/ButtonAuth.jsx";

export const DatePicker = ({ selectedDate, handleDateSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selected, setSelected] = useState(selectedDate || null);

    useEffect(() => {
        if (selectedDate) {
            setSelected(selectedDate);
        }
    }, [selectedDate]);

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

    return (
        <div className={classes.datepicker}>
            <div
                className={classes.dateRow}
            >
                <div className={classes.dateDisplay}>{formatDate(selected) || "Выберите дату"}</div>
                <ButtonAuth
                    onClick={() => setIsOpen(!isOpen)}
                    style={{background:"var(--color-primary)"}}>
                    {isOpen ? "Скрыть" : "Изменить"}
                </ButtonAuth>
            </div>

            {isOpen && (
                <div className={classes.calendar}>
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