import {observer} from "mobx-react-lite";
import React, {useEffect, useState} from "react";
import {StatisticsVM} from "@/presentation/components/statistics/StatisticsVM.js";
import classes from "./Statistics.module.css";
import {CustomDatePicker} from "@ui/datePicker/customDatePicker/CustomDatePicker.jsx";
import {PieChart} from "@/presentation/components/statistics/pieChart/PieChart.jsx";
import {ToggleBtnStat} from "@ui/toggleButtons/toggleBtnStat/ToggleBtnStat.jsx";
import SearchInput from "@ui/inputs/searchInput/SearchInput.jsx";
import SpacerPX from "@ui/spacers/SpacerPX.jsx";
import ButtonAuth from "@ui/button/buttonAuth/ButtonAuth.jsx";
import icon_tick from "@images/icon_tick.svg"
import {useStore} from "@/presentation/providers/AppStoreProvider.jsx";

export const Statistics = observer(() => {
    const [vm] = useState(() => new StatisticsVM());
    const { events, commissions } = useStore()

    useEffect(() => {
        if(events) {
            vm.setEvents(events)
            const teachers = [
                ...new Map(
                    events
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
    }, [events, vm])

    useEffect(() => {
        if(commissions) {
            vm.setCommissions(commissions)
        }
    }, [commissions, vm])

    return (
        <div className={classes.background}>
            <div className={classes.leftColumn}>
                <div className={classes.modes}>
                    <ToggleBtnStat values={vm.modes} currentValue={vm.settings.mode} onChange={vm.setMode}/>
                    <SpacerPX orientation="v" size={12}/>
                    <div style={{width:'100%'}}>
                        <SearchInput onChange={vm.onSearch} background={"var(--color-bg)"}/>
                    </div>
                    <div className={classes.scrollableListContainer}>
                        {vm.settings.mode === vm.modes[1] && vm.teachers && (
                            vm.filteredTeachers.map(teacher => (
                                <>
                                    <div
                                        key={teacher.id}
                                        className={classes.searchItem}
                                        onClick={() => {vm.selectTeacher(teacher.id)}}>
                                        {teacher.name}
                                        <SpacerPX orientation="h" size={4}/>
                                        <div className={classes.icon}>
                                            {vm.settings.teacher && vm.settings.teacher === teacher.id && (
                                                <img src={icon_tick} alt={""} />
                                            )}
                                        </div>
                                    </div>
                                </>
                            ))
                        )}
                        {vm.settings.mode === vm.modes[0] && vm.commissions && (
                            vm.filteredCommissions.map(commission => (
                                <>
                                    <div
                                        key={commission.id}
                                        className={classes.searchItem}
                                        onClick={() => {vm.selectCommission(commission.id)}}>
                                        {commission.name}
                                        <SpacerPX orientation="h" size={4}/>
                                        <div className={classes.icon}>
                                            {vm.settings.commission && vm.settings.commission === commission.id && (
                                                <img src={icon_tick} alt={""} />
                                            )}
                                        </div>
                                    </div>
                                </>
                            ))
                        )}
                        {!vm.teachers && (
                            <div className={classes.noItems}>
                                Нет данных
                            </div>
                        )}
                    </div>
                </div>
                <div className={classes.datePicker}>
                    <CustomDatePicker rangeValue={vm.settings.dateRange} handleSetDateRange={vm.setDateRange}
                                      bg = "var(--color-bg)"/>
                    <SpacerPX orientation="v" size={12}/>
                    <div className={classes.buttons}>
                        <ButtonAuth onClick={() => vm.calcData()}>Применить</ButtonAuth>
                    </div>
                </div>
            </div>
            <div className={classes.rightColumn}>
                <div className={classes.report}>
                    <div className={classes.title}>Отчёт за период</div>
                    <div className={classes.period}>
                        {vm.displayedDateRange.start && (
                            <>
                                <div className={classes.displayDate}>
                                    {new Date(vm.displayedDateRange.start).toLocaleDateString()}
                                </div>
                                {vm.displayedDateRange.end &&
                                    <>
                                        -
                                        <div className={classes.displayDate}>
                                            {new Date(vm.displayedDateRange.end).toLocaleDateString()}
                                        </div>
                                    </>

                                }
                                {!vm.displayedDateRange.end}
                            </>
                        )}
                    </div>
                </div>
                <PieChart data={vm.data}/>
            </div>
        </div>
    )
})

