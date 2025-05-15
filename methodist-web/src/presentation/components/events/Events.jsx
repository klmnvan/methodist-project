import {observer} from "mobx-react-lite";
import {useEffect, useMemo} from "react";
import {EventsVM} from "@/presentation/components/events/EventsVM.jsx";
import classes from "./Events.module.css"
import SearchInput from "@ui/inputs/searchInput/SearchInput.jsx";
import EventItem from "@/presentation/components/events/eventItem/EventItem.jsx";
import SpacerEM from "@ui/spacers/SpacerEM.jsx";
import SpacerV from "@ui/spacers/SpacerV.jsx";
import icon_arrow from "@images/icon_arrow.svg"
import {ImageNotFound} from "@ui/icons/ImageNotFound.jsx";
import {IconEvent} from "@ui/icons/IconEvent.jsx";
import {IconProfile} from "@ui/icons/IconProfile.jsx";
import SpacerPX from "@ui/spacers/SpacerPX.jsx";
import FilterSelector from "@ui/selectors/filterSelector/FilterSelector.jsx";
import SortSelector from "@ui/selectors/sortSelector/SortSelector.jsx";

export const Events = observer(() => {
    const vm = useMemo(() => new EventsVM(), [])

    useEffect(() => {
            vm.getEvents();
    }, []);

    return(
        <div className={classes.background}>
            <div className={classes.rowSearch}>
                <SearchInput onChange={vm.handleSearch}/>
                <FilterSelector
                    title="Категории"
                    icon={<IconEvent/>}
                    selectedValue={vm.selectedType}
                    options={vm.types}
                    onChange={(e) => vm.handleTypeChange(e)}
                />
                <FilterSelector
                    title="Преподаватель"
                    icon={<IconProfile/>}
                    selectedValue={vm.selectProfile}
                    options={vm.profiles}
                    onChange={(e) => vm.handleProfileChange(e)}
                />
            </div>
            <div className={classes.title}>Список мероприятий</div>
            <SpacerPX orientation={"v"} size={8}/>
            <div className={classes.rowSorts}>
                <div className={classes.totalPage}>
                    Найдено <span className={classes.count}>{vm.totalItems}</span> записей
                </div>
                <SortSelector
                    title="Сортировка: "
                    selectedValue={vm.selectSort}
                    options={vm.sorts}
                    onChange={(e) => vm.handleSortChange(e)}
                />
            </div>
            {vm.filteredEvents.length === 0 ? (
                <div>
                    {/*<ImageNotFound />*/}
                    <SpacerPX orientation={"v"} size={24}/>
                    <p>{vm.allEvents.length === 0 ? 'Нет мероприятий' : 'Ничего не найдено'}</p>
                </div>
            ) : (
                <>
                    <div className={classes.eventsGrid}>
                        {vm.currentItems.map(event => (
                            <EventItem key={event.id} event={event} />
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
        </div>
    )
})

