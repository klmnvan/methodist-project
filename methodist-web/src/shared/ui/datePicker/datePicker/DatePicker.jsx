import {useEffect, useRef, useState} from "react";
import classes from "../customDatePicker/CustomDatePicker.module.css";
import ButtonAuth from "@ui/button/buttonAuth/ButtonAuth.jsx";

export const DatePicker = ({ selectedDate, handleDateSelect, bg = "var(--color-container)" }) => {
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

    //#region
    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    //пока не понятно
    const [activeInput, setActiveInput] = useState('day');
    //ссылки на поля ввода для установки фокуса
    const dayInputRef = useRef(null);
    const monthInputRef = useRef(null);
    const yearInputRef = useRef(null);

    // Фокус и выделение текста при смене активного поля
    useEffect(() => {
        let ref = null;
        if (activeInput === 'day') ref = dayInputRef.current;
        else if (activeInput === 'month') ref = monthInputRef.current;
        else if (activeInput === 'year') ref = yearInputRef.current;

        if (ref) {
            ref.focus();
            // Выделяем весь текст в поле
            ref.select();
        }
    }, [activeInput]);

    // Общая функция для обработки ввода с поддержкой вставки и редактирования
    const handleInputChange = (value, maxLength, setValue, nextInput) => {
        // Убираем все нецифры
        let filtered = value.replace(/[^0-9]/g, '');

        // Ограничиваем длину
        if (filtered.length > maxLength) {
            filtered = filtered.slice(0, maxLength);
        }

        setValue(filtered);

        // Если длина достигла maxLength, переключаемся на следующий input
        if (filtered.length === maxLength && nextInput) {
            setActiveInput(nextInput);
        }
    };

    const isValidDate = () => {
        const d = parseInt(day, 10);
        const m = parseInt(month, 10);
        const y = parseInt(year, 10);

        if (!d || !m || !y) return false;
        if (m < 1 || m > 12) return false;

        const daysInMonth = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if ((y % 4 === 0 && y % 100 !== 0) || y % 400 === 0) {
            daysInMonth[2] = 29;
        }

        if (d < 1 || d > daysInMonth[m]) return false;

        return true;
    };

    // Для контроля ввода и замены символов в середине строки
    const handleKeyDown = (e, value, setValue, maxLength, nextInput) => {
        const { selectionStart, selectionEnd } = e.target;

        // Разрешаем навигационные клавиши, удаление, таб и т.п.
        const allowedKeys = [
            'Backspace',
            'Delete',
            'ArrowLeft',
            'ArrowRight',
            'Tab',
            'Home',
            'End',
        ];
        if (allowedKeys.includes(e.key)) return;

        // Если ввод не цифры — блокируем
        if (!/\d/.test(e.key)) {
            e.preventDefault();
            return;
        }

        // Если длина уже max и курсор не выделяет символы — блокируем ввод
        if (
            value.length >= maxLength &&
            !(selectionStart !== selectionEnd)
        ) {
            e.preventDefault();
            return;
        }
    };
    //#enfregion

    return (
        <div className={classes.datepicker}
             style={{background: bg}}>
            <div
                className={classes.dateRow}
                style={{background: bg}}
            >
                <input
                    type="text"
                    className="dateInput"
                    placeholder="DD"
                    maxLength={2}
                    value={day}
                    ref={dayInputRef}
                    onFocus={() => setActiveInput('day')}
                    onChange={(e) =>
                        handleInputChange(e.target.value, 2, setDay, 'month')
                    }
                    onKeyDown={(e) => handleKeyDown(e, day, setDay, 2, 'month')}
                />
                .
                <input
                    type="text"
                    className="dateInput"
                    placeholder="MM"
                    maxLength={2}
                    value={month}
                    ref={monthInputRef}
                    onFocus={() => setActiveInput('month')}
                    onChange={(e) =>
                        handleInputChange(e.target.value, 2, setMonth, 'year')
                    }
                    onKeyDown={(e) => handleKeyDown(e, month, setMonth, 2, 'year')}
                />
                .
                <input
                    type="text"
                    className="dateInput year"
                    placeholder="YYYY"
                    maxLength={4}
                    value={year}
                    ref={yearInputRef}
                    onFocus={() => setActiveInput('year')}
                    onChange={(e) => handleInputChange(e.target.value, 4, setYear, null)}
                    onKeyDown={(e) => handleKeyDown(e, year, setYear, 4, null)}
                />
                {!isValidDate() && day && month && year && (
                    <p style={{ color: 'red', marginTop: '4px' }}>Invalid date</p>
                )}
                {/*<input
                    className={classes.dateDisplay}
                    value={formatDate(currentDate)}
                    placeholder={'ДД.ММ.ГГГГ'}
                    maxLength={10}
                />*/}
                <ButtonAuth
                    onClick={() => setIsOpen(!isOpen)}
                    style={{background:"var(--color-primary)"}}>
                    {isOpen ? "Скрыть" : "Изменить"}
                </ButtonAuth>
            </div>

            {isOpen && (
                <div className={classes.calendar}
                     style={{background: bg}}>
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