import classes from './DateRangeSelector.module.css';
import {CustomDatePicker} from "@ui/datePicker/customDatePicker/CustomDatePicker.jsx";
import {useState} from "react";
import ButtonAuth from "@ui/button/buttonAuth/ButtonAuth.jsx";

export default function DateRangeSelector({title, icon, selectedValue, options, onChange}) {
    const [isOpen, setIsOpen] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [customDateRange, setCustomDateRange] = useState({start: null, end: null});

    const handleOptionClick = (option) => {
        if (option.id === options[options.length - 1].id) {
            setShowDatePicker(true);
        } else {
            onChange(option.dateRange);
        }
        setIsOpen(false);
    };

    const handleDatePickerConfirm = (dateRange) => {
        onChange(dateRange);
        setShowDatePicker(false);
    };

    const formatDate = (date) => {
        if (!date) return "";
        return new Date(date).toLocaleDateString("ru-RU");
    };

    const getDisplayText = () => {
        if (!selectedValue) return "Выберите...";

        // Проверяем, соответствует ли selectedValue одной из предустановленных опций
        const matchedOption = options.find(opt => {
            if (!opt.dateRange) return false;
            return (
                (!opt.dateRange.start && !selectedValue.start) ||
                (opt.dateRange.start?.getTime() === selectedValue.start?.getTime())
            ) && (
                (!opt.dateRange.end && !selectedValue.end) ||
                (opt.dateRange.end?.getTime() === selectedValue.end?.getTime())
            );
        });

        if (matchedOption) return matchedOption.name;

        // Если это кастомный диапазон
        return `${formatDate(selectedValue.start)} - ${formatDate(selectedValue.end)}`;
    };

    return (
        <div className={classes.wrapper}>
            <div className={classes.container} onClick={() => setIsOpen(!isOpen)}>
                <div className={classes.columnValues}>
                    <label className={classes.label}>{title}</label>
                    <div className={classes.selectedValue}>
                        {getDisplayText()}
                    </div>

                    {isOpen && (
                        <div className={classes.dropdown}>
                            {options.map((option) => (
                                <div
                                    key={option.id}
                                    className={classes.option}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleOptionClick(option);
                                    }}
                                >
                                    {option.name || "Выбрать диапазон дат..."}
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

            {showDatePicker && (
                <div className={classes.datePickerModal}>
                    <div className={classes.datePickerOverlay} onClick={() => setShowDatePicker(false)} />
                    <div className={classes.datePickerContainer}>
                        <CustomDatePicker
                            rangeValue={customDateRange}
                            handleSetDateRange={setCustomDateRange}
                        />
                        <ButtonAuth
                            onClick={() => handleDatePickerConfirm(customDateRange)}
                            disabled={!customDateRange.start || !customDateRange.end}
                        >
                            Подтвердить
                        </ButtonAuth>
                    </div>
                </div>
            )}
        </div>
    )
}


/*
export default function DateRangeSelector({ title, icon, selectedValue, onChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const [showCustomPicker, setShowCustomPicker] = useState(false);

    const presetOptions = [
        { id: 'last_month', name: 'За последний месяц' },
        { id: 'last_year', name: 'За последний год' },
        { id: 'academic_2023_2024', name: '2023-2024 учебный год' },
        { id: 'custom', name: 'Выбрать вручную...' }
    ];

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (isOpen && !e.target.closest(`.${classes.container}`)) {
                setIsOpen(false);
                setShowCustomPicker(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const getSelectedOptionName = () => {
        if (!selectedValue) return "Выберите период...";

        if (selectedValue.preset) {
            const preset = presetOptions.find(opt => opt.id === selectedValue.preset);
            return preset ? preset.name : "Выберите период...";
        }

        if (selectedValue.start && selectedValue.end) {
            return `${formatDate(selectedValue.start)} - ${formatDate(selectedValue.end)}`;
        }

        return "Выберите период...";
    };

    const formatDate = (date) => {
        if (!date) return "";
        const d = new Date(date);
        return d.toLocaleDateString("ru-RU", {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const calculatePresetDates = (presetId) => {
        const today = new Date();
        let startDate, endDate;

        switch (presetId) {
            case 'last_month':
                startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                endDate = new Date(today.getFullYear(), today.getMonth(), 0);
                break;
            case 'last_year':
                startDate = new Date(today.getFullYear() - 1, 0, 1);
                endDate = new Date(today.getFullYear() - 1, 11, 31);
                break;
            case 'academic_2023_2024':
                // Учебный год с сентября по июнь
                startDate = new Date(2023, 8, 1); // 1 сентября 2023
                endDate = new Date(2024, 5, 30); // 30 июня 2024
                break;
            default:
                return null;
        }

        return { start: startDate, end: endDate };
    };

    const handlePresetSelect = (presetId) => {
        if (presetId === 'custom') {
            setShowCustomPicker(true);
            return;
        }

        const dates = calculatePresetDates(presetId);
        if (dates) {
            onChange({
                ...dates,
                preset: presetId
            });
            setIsOpen(false);
        }
    };

    const handleCustomDateChange = (range) => {
        if (range.start && range.end) {
            onChange({
                start: range.start,
                end: range.end,
                preset: null
            });
            setShowCustomPicker(false);
            setIsOpen(false);
        }
    };

    return (
        <div className={classes.container}>
            <div
                className={classes.columnValues}
                onClick={() => !isOpen && setIsOpen(true)}
            >
                <label className={classes.label}>{title}</label>
                <div className={classes.selectedValue}>
                    {getSelectedOptionName()}
                </div>
            </div>

            <div className={classes.icon}>
                <svg>
                    {icon}
                </svg>
            </div>

            {isOpen && (
                <div className={classes.dropdownContainer}>
                    {!showCustomPicker ? (
                        <>
                            {presetOptions.map((option) => (
                                <div
                                    key={option.id}
                                    className={classes.option}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handlePresetSelect(option.id);
                                    }}
                                >
                                    {option.name}
                                </div>
                            ))}
                        </>
                    ) : (
                        <div
                            className={classes.customPickerContainer}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <CustomDatePicker
                                rangeValue={{
                                    start: selectedValue?.start,
                                    end: selectedValue?.end
                                }}
                                handleSetDateRange={handleCustomDateChange}
                            />
                            <div className={classes.pickerActions}>
                                <button
                                    className={classes.closeButton}
                                    onClick={() => handleCustomDateChange({
                                        start: selectedValue?.start,
                                        end: selectedValue?.end
                                    })}
                                >
                                    Применить
                                </button>
                                <button
                                    className={classes.closeButton}
                                    onClick={() => {
                                        setShowCustomPicker(false);
                                        setIsOpen(false);
                                    }}
                                >
                                    Отмена
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}*/
