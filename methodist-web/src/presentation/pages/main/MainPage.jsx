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
import {useStore} from "@/presentation/providers/AppStoreProvider.jsx";

function MainPage() {
    const [category, setCategory] = useState('Мероприятия');
    const navigate = useNavigate();
    const { setEvents, setCategories, setCommissions, setProfile, setParticipationForms,
        setResults, setEventForms, setStatuses} = useStore()
    
    //#region React Queries
    const { isSuccess , data, isError} = useQuery({
        queryKey: ['refreshToken'],
        queryFn: () => postService.refreshToken(),
        refetchInterval: 10 * 60 * 1000, // 10 минут в миллисекундах, периодическое обновление токена
    });

    const { data: events } = useQuery({
        queryKey: ["events"],
        queryFn: () => postService.getEvents(),
        select: (data) => data.data,
        refetchInterval: 30 * 1000, //раз в 30 сек обновляем список
        enabled: !!userStore.accessToken,
    })

    const { data: categories } = useQuery({
        queryKey: ["categories"],
        queryFn: () => postService.getTypesOfEvent(),
        select: (data) => data.data,
        enabled: !!userStore.accessToken,
    })

    const { data: commissions } = useQuery({
        queryKey: ["commissions"],
        queryFn: () => postService.getCommissions(),
        select: (data) => data.data,
        enabled: !!userStore.accessToken,
    })

    const { data: participationForms } = useQuery({
        queryKey: ["participationForms"],
        queryFn: () => postService.client.get('FormValues/GetParticipationForms'),
        select: (data) => data.data,
        enabled: !!userStore.accessToken,
    })

    const { data: eventForms } = useQuery({
        queryKey: ["eventForms"],
        queryFn: () => postService.client.get('FormValues/GetEventForms'),
        select: (data) => data.data,
        enabled: !!userStore.accessToken,
    })

    const { data: statuses } = useQuery({
        queryKey: ["statuses"],
        queryFn: () => postService.client.get('FormValues/GetEventStatuses'),
        select: (data) => data.data,
        enabled: !!userStore.accessToken,
    })

    const { data: results } = useQuery({
        queryKey: ["results"],
        queryFn: () => postService.client.get('FormValues/GetEventResults'),
        select: (data) => data.data,
        enabled: !!userStore.accessToken,
    })

    const { data: profile } = useQuery({
        queryKey: ["profile"],
        queryFn: () => postService.getProfile(),
        select: (data) => data.data,
        refetchInterval: 60 * 1000, //раз в 30 сек обновляем список
        enabled: !!userStore.accessToken,
    })
    //#endregion

    //#region Use Effects
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

    useEffect(() => {
        if(events) {
            console.log(events);
            setEvents(events)
        }
    }, [events, setEvents])

    useEffect(() => {
        if(categories) { setCategories(categories) }
    }, [categories, setCategories])

    useEffect(() => {
        if(commissions) { setCommissions(commissions) }
    }, [commissions, setCommissions])

    useEffect(() => {
        if(results) { setResults(results) }
    }, [results, setResults])

    useEffect(() => {
        if(participationForms) { setParticipationForms(participationForms) }
    }, [participationForms, setParticipationForms])

    useEffect(() => {
        if(eventForms) { setEventForms(eventForms) }
    }, [eventForms, setEventForms])

    useEffect(() => {
        if(statuses) { setStatuses(statuses) }
    }, [statuses, setStatuses])

    useEffect(() => {
        if(profile) { setProfile(profile) }
    }, [profile, setProfile])
    //#endregion
    
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



