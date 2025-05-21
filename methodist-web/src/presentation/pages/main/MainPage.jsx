import classes from "./MainPage.module.css"
import {observer} from "mobx-react-lite";
import {Header} from "@/presentation/components/header/Header.jsx";
import {useEffect, useState} from "react";
import {Events} from "@/presentation/components/events/Events.jsx";
import {Profile} from "@/presentation/components/profile/Profile.jsx";
import {Statistics} from "@/presentation/components/statistics/Statistics.jsx";
import {Form} from "@/presentation/components/form/Form.jsx";
import {postService} from "@/data/network/PostService.js";
import {userStore} from "@/stores/UserStore.jsx";
import {useNavigate} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";

function MainPage() {
    const [category, setCategory] = useState('Мероприятия');
    const navigate = useNavigate();

    const { isSuccess , data, isError} = useQuery({
        queryKey: ['refreshToken'],
        queryFn: () => postService.refreshToken(),
        refetchInterval: 1 * 60 * 1000, // 10 минут в миллисекундах, периодическое обновление токена
    });

    useEffect(() => {
        if (isSuccess && data?.accessToken) {
            console.log("Получили token:", data.accessToken);
            userStore.setToken(data.accessToken);
        }
    }, [isSuccess, data])

    useEffect(() => {
        if (isError && !data) { // Редиректим только если данных нет
            console.log("Ошибка обновления токенов");
            navigate("/auth", { replace: true });
        }
    }, [isError, data, navigate])

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
                        case 'Создание формы':
                            return <Form/>;
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



