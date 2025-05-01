import classes from "./MainPage.module.css"
import {observer} from "mobx-react-lite";
import {Header} from "@/presentation/components/header/Header.jsx";
import {useState} from "react";
import {Events} from "@/presentation/components/events/Events.jsx";

function MainPage() {
    const [category, setCategory] = useState('Мероприятия');
    return (
        <div className={classes.background}>
            <Header onClick={setCategory}/>
            {(() => {
                switch (category) {
                    case 'Профиль':
                        return <></>;
                    case 'Мероприятия':
                        return <Events/>;
                    case 'Статистика':
                        return <></>;
                    default:
                        return <></>;
                }
            })()}
        </div>
    )
}

const ObservedMainPage = observer(MainPage)
export default ObservedMainPage



