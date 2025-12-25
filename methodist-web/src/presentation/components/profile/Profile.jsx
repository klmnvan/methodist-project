import {observer} from "mobx-react-lite";
import classes from "@/presentation/components/profile/Profile.module.css";
import {ProfileVM} from "@/presentation/components/profile/ProfileVM.js";
import {useEffect, useMemo} from "react";
import {useNavigate} from "react-router-dom";
import SpacerPX from "@ui/spacers/SpacerPX.jsx";
import ProfileFormViewer from "@ui/inputs/profileFormViewer/ProfileFormViewer.jsx";
import AxiosClient from "@/data/AxiosClient.jsx";
import default_icon from "@images/default_image.svg"
import ButtonIconSmall from "@ui/button/buttonIconSmall/ButtonIconSmall.jsx";
import {IconLogOut} from "@ui/icons/IconLogOut.jsx";
import {IconProfileInButton} from "@ui/icons/IconProfileInButton.jsx";
import {IconSettings} from "@ui/icons/IconSettings.jsx";
import ProfileInput from "@ui/inputs/profileInput/ProfileInput.jsx";
import ButtonAuth from "@ui/button/buttonAuth/ButtonAuth.jsx";
import {postService} from "@/data/network/PostService.js";
import {useStore} from "@/presentation/providers/AppStoreProvider.jsx";
import {useMutation} from "@tanstack/react-query";

export const Profile = observer(() => {
    const vm = useMemo(() => new ProfileVM(), [])
    const navigate = useNavigate();
    const { profile, queryClient } = useStore()

    const { mutate } = useMutation({
        mutationKey: 'update profile',
        mutationFn: (newProfile) => postService.updateProfile(newProfile),
    })
    
    const { mutate: logOut, isSuccess } = useMutation({
        mutationKey: 'logOut',
        mutationFn: () => postService.logOut(),
    })

    /*logOut = async (navigate) => {
        try {
            const response = await httpClient.logOut();
            console.log(response.data);
            userStore.clearAuthData();
            // Создаем и диспатчим кастомное событие
            navigate("/auth", { replace: true })
        } catch (error) {
            console.log(error);
        }
    }*/
    
    useEffect(() => {
        if(isSuccess) {
            navigate("/auth", { replace: true })
        }
    }, [isSuccess, navigate])

    useEffect(() => {
        if(profile) vm.setProfile(profile)
    }, [profile, vm]);

    return (
        <>
            <div className={classes.background}>
                <div className={classes.leftColumn}>
                    <div className={classes.avatarContainer}>
                        {vm.profile && vm.profile.imageUrl ? (
                            <img
                                src={`${postService.BASE_URL}Profile/Uploads/${vm.profile.imageUrl}`}
                                alt={vm.profile.lastName}
                                className={classes.avatar}
                            />) :
                            (
                                <img
                                    className={`${classes.none}`}
                                    alt={"default_avatar"}
                                    src={default_icon}
                                />
                            )
                        }
                    </div>
                    <div className={classes.comission}>
                        {`Комиссия ${(vm.profile && vm.profile.mc && vm.profile.mc.name) || "не указана"}`}
                    </div>

                    <SpacerPX orientation={"v"} size={50}/>
                    <ButtonIconSmall
                        onClick={() => vm.handleState(vm.states[0])}
                        children={vm.states[0]}
                        {...(vm.state === vm.states[0] ? {
                            background: "var(--color-primary)",
                            color: "white"
                        } : {})}
                        icon={<IconProfileInButton/>}/>
                    <SpacerPX orientation={"v"} size={12}/>
                    <ButtonIconSmall
                        onClick={() => vm.handleState(vm.states[1])}
                        children={vm.states[1]}
                        {...(vm.state === vm.states[1] ? {
                            background: "var(--color-primary)",
                            color: "white"
                        } : {})}
                        icon={<IconSettings/>}/>
                    <SpacerPX orientation={"v"} size={24}/>
                    <ButtonIconSmall onClick={() => logOut()} children={"Выйти"} background={"var(--color-error)"} color="white" icon={<IconLogOut/>}/>
                </div>
                <div className={classes.rightColumn}>
                    <div className={classes.hint}>Роли</div>
                    <SpacerPX orientation={'v'} size={8}/>
                    <div className={classes.rolesContainer}>
                        {vm.profile && vm.profile.roles && vm.profile.roles.map((role, index) => (
                            <div className={classes.role} key={index}>
                                {role}
                            </div>
                        ))}
                    </div>
                    <div className={classes.title}>Персональная информация</div>

                    {vm.state === vm.states[0] && (<>
                        <ProfileFormViewer
                            label="Фамилия"
                            value={vm.profile && vm.profile.lastName}
                        />
                        <SpacerPX orientation={'v'} size={20}/>
                        <ProfileFormViewer
                            label="Имя"
                            value={vm.profile && vm.profile.firstName}
                        />
                        <SpacerPX orientation={'v'} size={20}/>
                        <ProfileFormViewer
                            label="Отчество"
                            value={vm.profile && vm.profile.patronymic}
                        />
                        <SpacerPX orientation={'v'} size={20}/>
                        <ProfileFormViewer
                            label="Номер телефона"
                            value={vm.profile && vm.profile.phoneNumber}
                        />
                    </>)}
                    {vm.state === vm.states[1] && (<>
                        <ProfileInput
                            label={"Фамилия"}
                            type={"text"}
                            name="lastName"
                            value={vm.draftProfile.lastName}
                            onChange={vm.handleChange}/>
                        <SpacerPX orientation={'v'} size={20}/>
                        <ProfileInput
                            label={"Имя"}
                            type={"text"}
                            name="firstName"
                            value={vm.draftProfile.firstName}
                            onChange={vm.handleChange}/>
                        <SpacerPX orientation={'v'} size={20}/>
                        <ProfileInput
                            label={"Отчество"}
                            type={"text"}
                            name="patronymic"
                            value={vm.draftProfile.patronymic}
                            onChange={vm.handleChange}/>
                        <SpacerPX orientation={'v'} size={20}/>
                        <ProfileInput
                            label={"Номер телефона"}
                            type={"text"}
                            name="phoneNumber"
                            value={vm.draftProfile.phoneNumber}
                            onChange={vm.handleChange}/>
                        <SpacerPX orientation={'v'} size={60}/>
                        <div className={classes.rowButtonsEdit}>
                            <ButtonAuth
                                style={{background: "color-mix(in srgb, var(--color-primary) 20%, transparent)"}}
                                onClick={() => vm.handleRemoveChanges()}
                            >Отменить изменения</ButtonAuth>
                            <ButtonAuth
                                onClick={() => vm.updateProfile(mutate, queryClient)}
                            >Сохранить изменения</ButtonAuth>
                        </div>
                    </>)}
                </div>
            </div>
        </>
    )
})



