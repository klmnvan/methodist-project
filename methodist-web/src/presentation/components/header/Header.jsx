import {observer} from "mobx-react-lite";
import classes from "./Header.module.css";
import logo from "@images/logo.svg"
import theme from "@images/icon_theme.svg"
import {useTheme} from "../../providers/MethodistThemeProvider.jsx";
import {useEffect, useState} from "react";
import {IconProfile} from "@ui/icons/IconProfile.jsx";
import {IconEvent} from "@ui/icons/IconEvent.jsx";
import {IconStat} from "@ui/icons/IconStat.jsx";

export const Header = observer(({onClick}) => {
    const [currentSection, setCurrentSection] = useState("Мероприятия");

    let sections = [
        {
            image: <IconEvent/>,
            path: "Мероприятия"
        },
        {
            image: <IconStat/>,
            path: "Статистика"
        },
        {
            image: <IconProfile/>,
            path: "Профиль"
        },
    ]

    useEffect(() => {
        onClick(currentSection); // Вызов после обновления состояния
    }, [currentSection]); // Сработает при каждом изменении currentSection

    return (
        <header className={classes.background}>
            <img src={logo} alt="logo" className={classes.logo}/>
            <div className={classes.sections}>
                {sections.map((section) => (
                    <div
                        key={section.path}
                        onClick={() => setCurrentSection(section.path)}
                        className={classes.sectionCont}
                        style={{
                            color: section.path === currentSection
                                ? "var(--color-title)"
                                : "var(--color-inversePrimary)",
                            background: section.path === currentSection
                                ? "color-mix(in srgb, var(--color-primary) 80%, transparent)"
                                : ""
                        }}
                    >
                        {section.image}
                    </div>
                ))}
            </div>
            <img src={theme} alt="logo" className={classes.theme} onClick={() => useTheme()}/>
        </header>
    )
})

