import {observer} from "mobx-react-lite";
import {useMemo} from "react";
import {RegistrationVM} from "@/presentation/components/regist/RegistrationVM.jsx";
import SpacerV from "@ui/spacers/SpacerV.jsx";
import classes from  '../../pages/authorization/Authorization.module.css'
import ButtonAuth from "@ui/button/ButtonAuth.jsx";
import AuthInput from "@ui/inputs/authInput/AuthInput.jsx";

export const Registration = observer(({onSwitch}) => {
    const formVM = useMemo(() => new RegistrationVM(), [])
    return (<>
        <div className={classes.form}>
            <h1 className={classes.titleAuth}>Создайте новый аккаунт.</h1>
            <SpacerV size={1} orientation={'v'}/>
            <p>
                <span className={classes.descriptionAuth}>Уже есть аккаунт? </span>
                <span
                    className={`${classes.descriptionAuth} ${classes.link}`}
                    onClick={onSwitch}
                >Авторизуйтесь!</span>
            </p>
            <SpacerV size={3} orientation={'v'}/>
            <AuthInput
                label="Фамилия" placeholder="Иванов" value={formVM.formData.surname}
                onChange={formVM.handleChange} name="surname"/>
            <SpacerV size={1} orientation={'v'}/>
            <AuthInput
                label="Имя" placeholder="Иван" value={formVM.formData.name}
                onChange={formVM.handleChange} name="name"/>
            <SpacerV size={1} orientation={'v'}/>
            <AuthInput
                label="Отчество" placeholder="Иванович" value={formVM.formData.patronymic}
                onChange={formVM.handleChange} name="patronymic"/>
            <SpacerV size={1} orientation={'v'}/>
            <AuthInput
                label="Email" type="email" placeholder="user@example.com" value={formVM.formData.email}
                onChange={formVM.handleChange} name="email"/>
            <SpacerV size={1} orientation={'v'}/>
            <AuthInput
                label="Пароль" type="password" placeholder="******" value={formVM.formData.password}
                onChange={formVM.handleChange} name="password"/>
            <SpacerV size={1} orientation={'v'}/>
            <AuthInput
                label="Подтвердите пароль" type="password" placeholder="******"
                value={formVM.formData.confirmPassword}
                onChange={formVM.handleChange} name="confirmPassword"/>
            <SpacerV size={2} orientation='v'/>
            <ButtonAuth onClick={formVM.handleButtonClick}>Создать</ButtonAuth>
        </div>
    </>)
})