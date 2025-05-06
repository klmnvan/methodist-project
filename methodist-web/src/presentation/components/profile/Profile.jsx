import {observer} from "mobx-react-lite";
import classes from "@/presentation/components/profile/Profile.module.css";
import {ProfileVM} from "@/presentation/components/profile/ProfileVM.jsx";
import {useEffect, useMemo} from "react";
import avatar from "@images/avatar_default.png"
import SpacerV from "@ui/spacers/SpacerV.jsx";
import {formatDateDDMMYYYY} from "@/data/converters/FormatDateDDMMYYYY.jsx";
import ButtonSmallWidth from "@ui/button/buttonSmall/ButtonSmallWidth.jsx";
import {useNavigate} from "react-router-dom";

export const Profile = observer(() => {
    const vm = useMemo(() => new ProfileVM(), [])
    const navigate = useNavigate();

    useEffect(() => {
        vm.getProfile();
    }, []);

    return (
        <>
            <div className={classes.background}>
                <div className={classes.rowTitles}>
                    <div className={classes.title}>Профиль</div>
                    <ButtonSmallWidth onClick={() => vm.logOut(navigate)}>Выйти</ButtonSmallWidth>
                </div>
                <SpacerV orientation={"v"} size={2}/>
                <div className={classes.mainRow}>
                    <div className={classes.avatarContainer}>
                        <img className={classes.avatar} src={avatar} alt="avatar" />
                    </div>
                    <div className={classes.formContainer}>
                        <div className={classes.formTitle}>
                            {vm.profile ? `${vm.profile.firstName} ${vm.profile.patronymic} ${vm.profile.lastName}` : null}
                        </div>
                        <div className={classes.formTitle}>
                            {vm.profile ? `Методическая комиссия: ${vm.profile.mc ? vm.profile.mc.name : null} ` : null}
                        </div>
                        <div className={classes.formTitle}>
                            {vm.profile ? `Дата регистрации: ${formatDateDDMMYYYY(vm.profile.сreatedAt)} ` : null}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
})



