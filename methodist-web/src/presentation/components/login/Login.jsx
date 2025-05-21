import {observer} from "mobx-react-lite";
import {LoginVM} from "@/presentation/components/login/LoginVM.js";
import SpacerV from "@ui/spacers/SpacerV.jsx";
import classes from  '../../pages/authorization/Authorization.module.css'
import AuthInput from "@ui/inputs/authInput/AuthInput.jsx";
import ButtonAuth from "@ui/button/buttonAuth/ButtonAuth.jsx";
import {useNavigate} from "react-router-dom";
import SpacerPX from "@ui/spacers/SpacerPX.jsx";
import {useMemo} from "react";
import {useLogin} from "@/presentation/components/login/hooks/useLogin.jsx";


export const Login = observer(() => {
    const vm = useMemo(() => new LoginVM(), [])
    //mutate - дескриптор метода авторизации с передачей formData из хука?
    const { mutate } = useLogin();
    const navigate = useNavigate();

    return (<>
        <div className={classes.formCont}>
            <div className={classes.form}>
                <h1 className={classes.titleAuth}>Войдите в аккаунт</h1>
                <SpacerPX size={26} orientation={'v'}/>
                {vm.error && (<>
                    <div className={classes.error}>{vm.error}</div>
                    <SpacerPX size={12} orientation={'v'}/>
                </>)}
                <AuthInput
                    label="Email" type="email" placeholder="user@example.com" value={vm.formData.email}
                    onChange={vm.handleChange} name="email"/>
                <SpacerPX size={12} orientation={'v'}/>
                <AuthInput
                    label="Пароль" type="password" placeholder="******" value={vm.formData.password}
                    onChange={vm.handleChange} name="password"/>
                <SpacerPX size={24} orientation={'v'}/>
                <ButtonAuth onClick={ async () => vm.logIn(navigate, mutate) }>Войти</ButtonAuth>
            </div>
        </div>
    </>)
})

