import {observer} from "mobx-react-lite";
import classes from "./Header.module.css";
import logo from "@images/logo.svg"
import {useTheme} from "../../providers/MethodistThemeProvider.jsx";
import {useEffect, useState} from "react";
import {IconProfile} from "@ui/icons/IconProfile.jsx";
import {IconEvent} from "@ui/icons/IconEvent.jsx";
import {IconStat} from "@ui/icons/IconStat.jsx";

import {IconHamburger} from "@ui/icons/IconHamburger.jsx";
import {IconPlus} from "@ui/icons/IconPlus.jsx";

export const Header = observer(({onClick}) => {
    const [currentSection, setCurrentSection] = useState("Мероприятия");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const closeMenu = () => setIsMenuOpen(false);
    const { switchTheme } = useTheme();

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
        {
            image: <IconPlus/>,
            path: "Создание формы"
        },
    ]

    useEffect(() => {
        onClick(currentSection); // Вызов после обновления состояния
    }, [currentSection]); // Сработает при каждом изменении currentSection

    return (
        <>

            {/* Бургер-меню (видно только на мобильных) */}
            <div
                className={!isMenuOpen ? `${classes.burger}` : `${classes.burger} ${classes.active}`}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
                {isMenuOpen
                    ?
                    <IconHamburger style={{transform: 'scaleX(-1)'}}/>
                    :
                    <IconHamburger/>
                }
            </div>

            {/* Оверлей */}
            <div
                className={`${classes.menuOverlay} ${isMenuOpen ? 'active' : ''}`}
                onClick={closeMenu}
            />

            {/* Основной Header */}
            <header className={`${classes.header} ${isMenuOpen ? classes.active : ''}`}>
                <img src={logo} alt="logo" className={classes.logo} onClick={() => setCurrentSection("Мероприятия")} />
                <div className={classes.sections}>
                    {sections.map((section) => (
                        <div
                            key={section.path}
                            onClick={() => {
                                setCurrentSection(section.path)
                                setIsMenuOpen(false);
                            }}
                            className={`${classes.sectionCont} ${
                                section.path === currentSection ? 'active' : ''
                            }`}
                            style={{
                                color: section.path === currentSection
                                    ? "var(--color-title)"
                                    : "var(--color-inversePrimary)"
                            }}
                        >
                            {section.image}
                        </div>
                    ))}
                </div>
                <div
                    className={classes.theme}
                    onClick={switchTheme}
                >
                    <svg  viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M11.6949 0.0333418C9.14837 0.291176 6.64293 1.33658 4.72636 2.941C2.57848 4.73909 1.07208 7.11131 0.382099 9.78221C-0.107201 11.6764 -0.127825 14.0084 0.327475 15.9568C0.89046 18.3656 2.14861 20.5921 3.92257 22.3189C5.07104 23.4367 5.93683 24.0475 7.33248 24.7245C9.16962 25.6155 11.0773 26.0447 12.985 25.9963C13.808 25.9755 13.8678 25.9652 14.186 25.789C14.5666 25.5783 14.8725 25.249 15.0804 24.8263C15.1944 24.5946 15.2233 24.4298 15.2245 24.0049C15.226 23.5032 15.2098 23.4382 14.9373 22.848C14.3814 21.6442 14.2942 21.2796 14.294 20.1589C14.2939 19.0744 14.436 18.4373 14.8802 17.5324C15.7389 15.7829 17.2222 14.6726 19.1513 14.3352C20.3579 14.1242 21.5234 14.3098 22.8401 14.9227C23.4419 15.2028 23.5042 15.2186 24.0071 15.218C24.4695 15.2174 24.5853 15.1936 24.9011 15.0342C25.3014 14.8321 25.6146 14.5212 25.8309 14.1114C25.9541 13.878 25.9756 13.7288 25.9961 12.9713C26.1086 8.79583 23.8062 4.50445 20.1635 2.10027C18.5797 1.05492 16.619 0.335201 14.676 0.0858717C14.0127 0.000698209 12.3128 -0.0291938 11.6949 0.0333418ZM11.6012 3.18026C10.8444 3.43384 10.2947 4.0258 10.0976 4.79937C9.85166 5.76479 10.356 6.79057 11.3071 7.25902C11.679 7.44225 11.7805 7.4642 12.2561 7.4642C12.7136 7.4642 12.8391 7.43937 13.1473 7.28798C13.6044 7.06341 14.0131 6.65449 14.2375 6.19717C14.3912 5.88405 14.4135 5.76655 14.4133 5.27545C14.4129 4.58937 14.289 4.27682 13.8216 3.78229C13.2314 3.15793 12.3672 2.92355 11.6012 3.18026ZM18.6635 6.32824C17.6971 6.57326 16.9505 7.36295 16.7575 8.34439C16.5606 9.34596 17.1703 10.4844 18.1635 10.9694C18.5016 11.1345 18.6001 11.1526 19.1644 11.1532C19.7427 11.1537 19.8213 11.1386 20.1963 10.954C21.3379 10.3922 21.9094 9.09613 21.5082 7.97931C21.0766 6.778 19.8037 6.0392 18.6635 6.32824ZM5.58702 7.15127C4.98154 7.31956 4.49262 7.73717 4.23606 8.30524C4.05256 8.7116 4.05894 9.42332 4.24956 9.81779C4.45255 10.2377 4.75911 10.5687 5.14141 10.7806C5.44315 10.9478 5.53209 10.9662 6.03883 10.9662C6.5455 10.9662 6.6345 10.9478 6.93599 10.7807C8.17508 10.0939 8.36364 8.54 7.32167 7.60259C6.83199 7.16209 6.16895 6.98956 5.58702 7.15127ZM4.56136 13.5969C4.39418 13.6484 4.13919 13.8052 3.95925 13.9671C3.0114 14.8198 3.2059 16.1912 4.35487 16.7571C4.71342 16.9337 4.80055 16.952 5.15004 16.924C6.68962 16.8003 7.31548 14.964 6.1637 13.9496C5.69227 13.5344 5.1511 13.4153 4.56136 13.5969Z" fill="url(#paint0_linear_78_333)"/>
                        <defs>
                            <linearGradient id="paint0_linear_78_333" x1="13" y1="26" x2="13" y2="0" gradientUnits="userSpaceOnUse">
                                <stop stop-color="#1977FF"/>
                                <stop offset="1" stop-color="#F7F7F9"/>
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
                {/*<img src={theme} alt="logo" className={classes.theme} onClick={() => useTheme()}/>*/}
            </header>

        </>
    )
})

