import {observer} from "mobx-react-lite";
import {useMemo} from "react";
import {LoginVM} from "@/presentation/components/login/LoginVM.jsx";
import SpacerV from "@ui/spacers/SpacerV.jsx";
import ButtonAuth from "@ui/button/ButtonAuth.jsx";
import classes from  '../../pages/authorization/Authorization.module.css'
import AuthInput from "@ui/inputs/authInput/AuthInput.jsx";


export const Login = observer(({onSwitch}) => {
    const formVM = useMemo(() => new LoginVM(), [])
    return (<>
        <div className={classes.formCont}>
            <div className={classes.form}>
                <h1 className={classes.titleAuth}>Войдите в аккаунт.</h1>
                {/*<SpacerV size={1} orientation={'v'}/>
                <p>
                    <span className={classes.descriptionAuth}>Ещё нет аккаунта? </span>
                    <span
                        className={`${classes.descriptionAuth} ${classes.link}`}
                        onClick={onSwitch}
                    >Создайте!</span>
                </p>*/}
                <SpacerV size={3} orientation={'v'}/>
                <AuthInput
                    label="Email" type="email" placeholder="user@example.com" value={formVM.formData.email}
                    onChange={formVM.handleChange} name="email"/>
                <SpacerV size={1} orientation={'v'}/>
                <AuthInput
                    label="Пароль" type="password" placeholder="******" value={formVM.formData.password}
                    onChange={formVM.handleChange} name="password"/>
                <SpacerV size={2} orientation={'v'}/>
                <ButtonAuth onClick={formVM.logIn}>Войти</ButtonAuth>
            </div>
        </div>
    </>)
})

