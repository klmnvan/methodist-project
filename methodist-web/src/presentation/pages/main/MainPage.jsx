import classes from "./MainPage.module.css"
import {observer} from "mobx-react-lite";
import {Header} from "@/presentation/components/header/Header.jsx";
import {useState} from "react";
import {Events} from "@/presentation/components/events/Events.jsx";
import {Profile} from "@/presentation/components/profile/Profile.jsx";
import {Statistics} from "@/presentation/components/statistics/Statistics.jsx";

function MainPage() {
    const [category, setCategory] = useState('Мероприятия');
    return (
        <div className={classes.background}>
            <Header onClick={setCategory}/>
            <div className={classes.mainContent}>
                {(() => {
                    switch (category) {
                        case 'Профиль':
                            return <Profile/>;
                        case 'Мероприятия':
                            return <Events/>;
                        case 'Статистика':
                            return <Statistics/>;
                        default:
                            return <></>;
                    }
                })()}
            </div>
        </div>
    )
}

const ObservedMainPage = observer(MainPage)
export default ObservedMainPage



