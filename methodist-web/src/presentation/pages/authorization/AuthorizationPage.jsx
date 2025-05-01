import {observer} from "mobx-react-lite";
import {useEffect, useRef, useState} from "react";
import {OnBoardVM} from "@/presentation/components/onBoard/OnBoardVM.jsx";
import classes from "@/presentation/pages/authorization/Authorization.module.css";
import {Login} from "@/presentation/components/login/Login.jsx";
import {OnBoard} from "@/presentation/components/onBoard/OnBoard.jsx";
import {Registration} from "@/presentation/components/regist/Registration.jsx";

function AuthorizationPage() {
    const [authMode, setAuthMode] = useState('login');
    const onBoardVM = useRef(new OnBoardVM()).current;

    function switchMode() {
        setAuthMode(prev => prev === 'login' ? 'register' : 'login');
    }

    useEffect(() => {
        //userStore.tokenIsValid()
    }, []);

    return (
        <div className={classes.background}>
            {authMode === 'login' && (<div className={classes.formCont}>
                <Login onSwitch={switchMode}/>
            </div>)}
            <div className={classes.onBoardCont}>
                <OnBoard onBoardVM={onBoardVM}/>
            </div>
            {authMode === 'register' && (<div className={classes.formCont}>
                <Registration onSwitch={switchMode}/>
            </div>)}
        </div>
    )
}

const ObservedAuthorization = observer(AuthorizationPage)
export default ObservedAuthorization;