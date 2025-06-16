import {observer} from "mobx-react-lite";
import {useEffect, useState} from "react";
import classes from "./Events.module.css"
import SearchInput from "@ui/inputs/searchInput/SearchInput.jsx";
import EventItem from "@/presentation/components/events/eventItem/EventItem.jsx";
import {IconEvent} from "@ui/icons/IconEvent.jsx";
import SpacerPX from "@ui/spacers/SpacerPX.jsx";
import FilterSelector from "@ui/selectors/filterSelector/FilterSelector.jsx";
import {EventVM} from "@/presentation/components/events/EventVM.js";
import {IconCommission} from "@ui/icons/IconCommission.jsx";
import {IconProfile} from "@ui/icons/IconProfile.jsx";
import SortSelector from "@ui/selectors/sortSelector/SortSelector.jsx";
import SpacerV from "@ui/spacers/SpacerV.jsx";
import icon_arrow from "@images/icon_arrow.svg"
import {useStore} from "@/presentation/providers/AppStoreProvider.jsx";
import DateRangeSelector from "@ui/selectors/dateRangeSelector/DateRangeSelector.jsx";
import {IconCalendar} from "@ui/icons/IconCalendar.jsx";
import {EventDialog} from "@/presentation/components/events/eventDialog/EventDialog.jsx";

export const Events = observer(() => {

    const [vm] = useState(new EventVM());
    const { events, categories, commissions } = useStore()
    const [selectedEventId, setSelectedEventId] = useState(null);
    const selectedEvent = events.find(event => event.id === selectedEventId);

    //#region Use Effects
    useEffect(() => {
        if(events) { vm.setEvents(events) }
    }, [vm, events])

    useEffect(() => {
        if(categories) { vm.setCategories(categories) }
    }, [categories, vm])

    useEffect(() => {
        if(commissions) { vm.setCommissions(commissions) }
    }, [commissions, vm])

    useEffect(() => {
        if(events) {
            const teachers = [
                ...new Map(
                    events
                        .filter(event => {
                            if (!event.profile || !event.profile.mc) return false
                            if (vm.filters.commission !== 'all')
                                return event.profile.mc.id === vm.filters.commission
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
            vm.setTeachers(teachers)
        }
    }, [vm, events, vm.filters.commission])
    //#endregion

    return(
        <div className={classes.background}>
            <div className={classes.rowSearch}>
                <SearchInput value={vm.search} onChange={(e) => vm.setSearch(e.target.value)}/>
                <FilterSelector
                    title="Форма работы"
                    icon={<IconEvent/>}
                    selectedValue={vm.filters.category}
                    options={vm.categories}
                    onChange={(e) => vm.setCategory(e)}
                />
                <FilterSelector
                    title="Комиссия"
                    icon={<IconCommission/>}
                    selectedValue={vm.filters.commission}
                    options={vm.commissions}
                    onChange={(e) => vm.setCommission(e)}
                />
                <FilterSelector
                    title="Преподаватель"
                    icon={<IconProfile/>}
                    selectedValue={vm.filters.teacher}
                    options={vm.teachers}
                    onChange={(e) => vm.setTeacher(e)}
                />
                <DateRangeSelector
                    title="Диапазон дат"
                    icon={<IconCalendar />}
                    selectedValue={vm.filters.dateRange}
                    options={vm.dates}
                    onChange={(range) => vm.setDateRange(range)}
                />
            </div>
            <div className={classes.title}>Список мероприятий</div>
            <SpacerPX orientation={"v"} size={8}/>
            <div className={classes.rowSorts}>
                <div className={classes.totalPage}>
                    Найдено <span className={classes.count}>{vm.filteredEvents.length}</span> записей
                </div>
                <SortSelector
                    title="Сортировка: "
                    selectedValue={vm.filters.sorting}
                    options={vm.sorts}
                    onChange={(e) => vm.setSorting(e)}
                />
            </div>
            {vm.currentItems?.length === 0 ? (
                <div>
                    {/*<ImageNotFound />*/}
                    <SpacerPX orientation={"v"} size={24}/>
                    <p className={classes.totalPage}>{'Нет мероприятий'}</p>
                </div>
            ) : (
                <>
                    <div className={classes.eventsGrid}>
                        {vm.currentItems?.map(event => (
                            <EventItem key={event.id} event={event} onClick={() => setSelectedEventId(event.id)}/>
                        ))}
                    </div>
                    {/* Пагинация */}
                    <div className={classes.navigationButtons}>
                        <button className={classes.btnContainer} onClick={() => vm.prevPage()} disabled={vm.currentPage === 1}>
                            <img src={icon_arrow} className={classes.imageInButton} alt="button" style={{transform: 'rotate(180deg)'}}/>
                        </button>
                        <SpacerV orientation="h" size={1}/>
                        <div>{vm.currentPage}</div>
                        <SpacerV orientation="h" size={1}/>
                        <button className={classes.btnContainer} onClick={() => vm.nextPage()} disabled={vm.currentPage === vm.totalPages}>
                            <img src={icon_arrow} className={classes.imageInButton} alt="button"/>
                        </button>
                    </div>
                </>
            )}
            {selectedEvent && (
                <EventDialog event={selectedEvent} onClose={() => setSelectedEventId(null)}/>
            )}
        </div>

    )
})

