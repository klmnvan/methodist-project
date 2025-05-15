import {observer} from "mobx-react-lite";
import {useMemo} from "react";
import {LoginVM} from "@/presentation/components/login/LoginVM.jsx";
import SpacerV from "@ui/spacers/SpacerV.jsx";
import classes from  '../../pages/authorization/Authorization.module.css'
import AuthInput from "@ui/inputs/authInput/AuthInput.jsx";
import ButtonAuth from "@ui/button/buttonAuth/ButtonAuth.jsx";
import {useNavigate} from "react-router-dom";
import SpacerPX from "@ui/spacers/SpacerPX.jsx";


export const Login = observer(({onSwitch}) => {
    const formVM = useMemo(() => new LoginVM(), [])
    const navigate = useNavigate();
    return (<>
        <div className={classes.formCont}>
            <div className={classes.form}>
                <h1 className={classes.titleAuth}>Войдите в аккаунт</h1>
                {/*<SpacerV size={1} orientation={'v'}/>
                <p>
                    <span className={classes.descriptionAuth}>Ещё нет аккаунта? </span>
                    <span
                        className={`${classes.descriptionAuth} ${classes.link}`}
                        onClick={onSwitch}
                    >Создайте!</span>
                </p>*/}
                <SpacerPX size={26} orientation={'v'}/>
                <AuthInput
                    label="Email" type="email" placeholder="user@example.com" value={formVM.formData.email}
                    onChange={formVM.handleChange} name="email"/>
                <SpacerPX size={12} orientation={'v'}/>
                <AuthInput
                    label="Пароль" type="password" placeholder="******" value={formVM.formData.password}
                    onChange={formVM.handleChange} name="password"/>
                <SpacerPX size={24} orientation={'v'}/>
                <ButtonAuth onClick={() => formVM.logIn(navigate)}>Войти</ButtonAuth>
            </div>
        </div>
    </>)
})

