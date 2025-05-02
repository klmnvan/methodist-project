import {observer} from "mobx-react-lite";
import {useEffect, useMemo} from "react";
import {EventsVM} from "@/presentation/components/events/EventsVM.jsx";
import classes from "./Events.module.css"
import SearchInput from "@ui/inputs/searchInput/SearchInput.jsx";
import EventItem from "@/presentation/components/events/eventItem/EventItem.jsx";
import SpacerEM from "@ui/spacers/SpacerEM.jsx";
import SpacerV from "@ui/spacers/SpacerV.jsx";
import icon_arrow from "@images/icon_arrow.svg";

export const Events = observer(() => {
    const vm = useMemo(() => new EventsVM(), [])

    useEffect(() => {
            vm.getEvents();
    }, []);

    return (
        <>
            <div className={classes.background}>
                {/*Строка поиска*/}
                <SearchInput onChange={vm.handleSearch}/>
                <SpacerEM orientation={'v'} size="1"/>
                {/*Список мероприятий*/}
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
                        <SpacerEM orientation={'v'} size="1"/>
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
            </div>
        </>
    )
})

