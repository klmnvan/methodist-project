import {observer} from "mobx-react-lite";
import {useEffect, useState} from "react";
import classes from "./Events.module.css"
import SearchInput from "@ui/inputs/searchInput/SearchInput.jsx";
import EventItem from "@/presentation/components/events/eventItem/EventItem.jsx";
import {IconEvent} from "@ui/icons/IconEvent.jsx";
import SpacerPX from "@ui/spacers/SpacerPX.jsx";
import FilterSelector from "@ui/selectors/filterSelector/FilterSelector.jsx";
import {useQuery} from "@tanstack/react-query";
import {postService} from "@/data/network/PostService.js";
import {eventStore, EventStore} from "@/presentation/components/events/EventStore.js";
import {userStore} from "@/stores/UserStore.jsx";
import {IconCommission} from "@ui/icons/IconCommission.jsx";
import {IconProfile} from "@ui/icons/IconProfile.jsx";
import SortSelector from "@ui/selectors/sortSelector/SortSelector.jsx";
import SpacerV from "@ui/spacers/SpacerV.jsx";
import icon_arrow from "@images/icon_arrow.svg"

export const Events = observer(() => {

    //#region React Queries
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
    //#endregion

    //#region Use Effects
    useEffect(() => {
        if(events) { eventStore.setEvents(events) }
    }, [events, eventStore])

    useEffect(() => {
        if(categories) { eventStore.setCategories(categories) }
    }, [categories, eventStore])

    useEffect(() => {
        if(commissions) { eventStore.setCommissions(commissions) }
    }, [commissions, eventStore])

    useEffect(() => {
        if(events) {
            const teachers = [
                ...new Map(
                    events
                        .filter(event => {
                            if (!event.profile || !event.profile.mc) return false
                            if (eventStore.filters.commission !== 'all')
                                return event.profile.mc.id === eventStore.filters.commission
                            return true
                        })
                        .map(event => [
                            event.profile.id,
                            {
                                id: event.profile.id,
                                name: `${event.profile.lastName} ${event.profile.firstName} ${event.profile.patronymic}`
                            }
                        ])
                ).values()
            ];
            eventStore.setTeachers(teachers)
        }
    }, [eventStore, events, eventStore.filters.commission])
    //#endregion

    return(
        <div className={classes.background}>
            <div className={classes.rowSearch}>
                <SearchInput value={eventStore.search} onChange={(e) => eventStore.setSearch(e.target.value)}/>
                <FilterSelector
                    title="Категории"
                    icon={<IconEvent/>}
                    selectedValue={eventStore.filters.category}
                    options={eventStore.categories}
                    onChange={(e) => eventStore.setCategory(e)}
                />
                <FilterSelector
                    title="Комиссия"
                    icon={<IconCommission/>}
                    selectedValue={eventStore.filters.commission}
                    options={eventStore.commissions}
                    onChange={(e) => eventStore.setCommission(e)}
                />
                <FilterSelector
                    title="Преподаватель"
                    icon={<IconProfile/>}
                    selectedValue={eventStore.filters.teacher}
                    options={eventStore.teachers}
                    onChange={(e) => eventStore.setTeacher(e)}
                />
            </div>
            <div className={classes.title}>Список мероприятий</div>
            <SpacerPX orientation={"v"} size={8}/>
            <div className={classes.rowSorts}>
                <div className={classes.totalPage}>
                    Найдено <span className={classes.count}>{eventStore.filteredEvents.length}</span> записей
                </div>
                <SortSelector
                    title="Сортировка: "
                    selectedValue={eventStore.filters.sorting}
                    options={eventStore.sorts}
                    onChange={(e) => eventStore.setSorting(e)}
                />
            </div>
            {eventStore.currentItems?.length === 0 ? (
                <div>
                    {/*<ImageNotFound />*/}
                    <SpacerPX orientation={"v"} size={24}/>
                    <p className={classes.totalPage}>{'Нет мероприятий'}</p>
                </div>
            ) : (
                <>
                    <div className={classes.eventsGrid}>
                        {eventStore.currentItems?.map(event => (
                            <EventItem key={event.id} event={event} />
                        ))}
                    </div>
                    {/* Пагинация */}
                    <div className={classes.navigationButtons}>
                        <button className={classes.btnContainer} onClick={() => eventStore.prevPage()} disabled={eventStore.currentPage === 1}>
                            <img src={icon_arrow} className={classes.imageInButton} alt="button" style={{transform: 'rotate(180deg)'}}/>
                        </button>
                        <SpacerV orientation="h" size={1}/>
                        <div>{eventStore.currentPage}</div>
                        <SpacerV orientation="h" size={1}/>
                        <button className={classes.btnContainer} onClick={() => eventStore.nextPage()} disabled={eventStore.currentPage === eventStore.totalPages}>
                            <img src={icon_arrow} className={classes.imageInButton} alt="button"/>
                        </button>
                    </div>
                </>
            )}
        </div>
    )
})

