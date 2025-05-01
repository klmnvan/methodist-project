import {observer} from "mobx-react-lite";
import {useEffect, useMemo} from "react";
import {EventsVM} from "@/presentation/components/events/EventsVM.jsx";
import classes from "./Events.module.css"
import SearchInput from "@ui/inputs/searchInput/SearchInput.jsx";
import EventItem from "@/presentation/components/events/eventItem/EventItem.jsx";
import SpacerEM from "@ui/spacers/SpacerEM.jsx";

export const Events = observer(() => {
    const vm = useMemo(() => new EventsVM(), [])

    useEffect(() => {
            vm.getEvents();
    }, []);

    return (
        <>
            <div className={classes.background}>
                <SearchInput onChange={vm.handleSearch}/>
                <SpacerEM orientation={'v'} size="1"/>
                {!vm.filteredEvents.length && vm.allEvents.length ? (
                    <div>Ничего не найдено</div>
                ) : !vm.allEvents.length ? (
                    <div>Нет мероприятий</div>
                ) : (
                    <>
                        <ul>
                            {vm.currentItems.map(event => (
                                <li key={event.id} >
                                    <EventItem event={event} />
                                </li>
                            ))}
                        </ul>
                        <button onClick={() => vm.prevPage()} disabled={vm.currentPage === 1}>Предыдущая</button>
                        <button onClick={() => vm.nextPage()} disabled={vm.currentPage === vm.totalPages}>Следующая</button>
                    </>

                )}
            </div>
        </>
    )
})

