import {observer} from "mobx-react-lite";
import classes from "./Form.module.css"
import {ToggleBtnStat} from "@ui/toggleButtons/toggleBtnStat/ToggleBtnStat.jsx";
import {useEffect, useMemo} from "react";
import {FormVM} from "@/presentation/components/form/FormVM.jsx";
import SpacerPX from "@ui/spacers/SpacerPX.jsx";
import ProfileInput from "@ui/inputs/profileInput/ProfileInput.jsx";
import {DatePicker} from "@ui/datePicker/datePicker/DatePicker.jsx";
import {Button} from "@mui/material";
import ButtonAuth from "@ui/button/buttonAuth/ButtonAuth.jsx";
import {EventSelector} from "@/presentation/components/form/eventSelector/EventSelector.jsx";

export const Form = observer(() => {

    const vm = useMemo(() => new FormVM(), [])

    useEffect(() => {
        vm.getValuesForms();
    }, [vm])

    return(
        <div className={classes.background}>

            <div className={classes.container}>
                <div className={classes.title}>Создание формы</div>
                <SpacerPX size={12} orientation={"v"}/>
                <div className={classes.titleInput}>Форма работы</div>
                <SpacerPX size={12} orientation={"v"}/>
                <ToggleBtnStat currentValue={vm.currentMode} values={vm.modes} onChange={ vm.selectMode }/>
                <SpacerPX size={20} orientation={"v"}/>
                {vm.currentMode === vm.modes[0] && (
                  <>
                      <EventSelector
                          label="Форма участия"
                          defaultValues={vm.participationForms}
                          defaultIsExists = {false}
                          onSelect={(value) => vm.handleSelect('formOfParticipation', value)}
                      />
                      <SpacerPX size={12} orientation={"v"}/>
                      <ProfileInput
                          label="Название мероприятия"
                          type="text"
                          name="name"
                          placeholder = "Название"
                          value={vm.event.name}
                          onChange={vm.handleInput}
                      />
                      <SpacerPX size={12} orientation={"v"}/>
                      <EventSelector
                          label="Форма мероприятия"
                          defaultValues={vm.eventForms}
                          onSelect={(value) => vm.handleSelect('formOfEvent', value)}
                      />
                      <SpacerPX size={12} orientation={"v"}/>
                      <EventSelector
                          label="Cтатус мероприятия"
                          defaultValues={vm.statuses}
                          onSelect={(value) => vm.handleSelect('status', value)}
                      />
                      <SpacerPX size={12} orientation={"v"}/>
                      <EventSelector
                          label="Результат"
                          defaultValues={vm.results}
                          onSelect={(value) => vm.handleSelect('result', value)}
                      />
                  </>
                )}
                {vm.currentMode === vm.modes[1] && (
                    <>
                        <ProfileInput
                            label="Название мероприятия"
                            type="text"
                            name="name"
                            placeholder = "Название"
                            value={vm.event.name}
                            onChange={vm.handleInput}
                        />
                        <SpacerPX size={12} orientation={"v"}/>
                        <EventSelector
                            label="Форма мероприятия"
                            defaultValues={vm.eventForms}
                            onSelect={(value) => vm.handleSelect('formOfEvent', value)}
                        />
                        <SpacerPX size={12} orientation={"v"}/>
                        <ProfileInput
                            label="Место проведения"
                            type={"text"}
                            name="location"
                            placeholder = "ГБПОУ НГК"
                            value={vm.event.location}
                            onChange={vm.handleInput}
                        />
                        <SpacerPX size={12} orientation={"v"}/>
                        <EventSelector
                            label="Cтатус мероприятия"
                            defaultValues={vm.statuses}
                            onSelect={(value) => vm.handleSelect('status', value)}
                        />
                        <SpacerPX size={12} orientation={"v"}/>
                        <EventSelector
                            label="Результат"
                            defaultValues={vm.results}
                            onSelect={(value) => vm.handleSelect('result', value)}
                        />
                    </>
                )}
                {vm.currentMode === vm.modes[2] && (
                    <>
                        <ProfileInput
                            label="Место прохождения"
                            type={"text"}
                            name="location"
                            placeholder = "ГБПОУ НГК"
                            value={vm.event.location}
                            onChange={vm.handleInput}
                        />
                        <SpacerPX size={12} orientation={"v"}/>
                        <ProfileInput
                            label="Количество часов"
                            type="text"
                            inputMode="numeric"
                            name="quantityOfHours"
                            value={vm.event.quantityOfHours}
                            onChange={(e) => {
                                const newValue = vm.handleQuantityInput(e.target.value);
                                e.target.value = newValue; // Синхронизируем значение
                            }}
                            title="Только положительные целые числа"
                            maxLength={10}
                        />
                    </>
                )}
                {vm.currentMode === vm.modes[3] && (
                    <>
                        <ProfileInput
                            label="Название"
                            type="text"
                            name="name"
                            placeholder = "Название"
                            value={vm.event.name}
                            onChange={vm.handleInput}
                        />
                        <SpacerPX size={12} orientation={"v"}/>
                        <ProfileInput
                            label="Вид"
                            type="text"
                            name="type"
                            placeholder = "Вид"
                            value={vm.event.type}
                            onChange={vm.handleInput}
                        />
                        <SpacerPX size={12} orientation={"v"}/>
                        <ProfileInput
                            label="Место публикации"
                            type="text"
                            name="location"
                            placeholder = "Сайт/ название сборника"
                            value={vm.event.location}
                            onChange={vm.handleInput}
                        />
                    </>
                )}
                <SpacerPX size={12} orientation={"v"}/>
                <div className={classes.label}>Дата мероприятия</div>
                <DatePicker
                    selectedDate={vm.event.dateOfEvent}
                    handleDateSelect={vm.handleDateSelect}
                />
                <SpacerPX size={20} orientation={"v"}/>
                <ButtonAuth onClick={vm.createForm}>Создать</ButtonAuth>
            </div>

        </div>
    )

})