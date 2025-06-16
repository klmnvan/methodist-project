import {action, makeObservable, observable, toJS} from "mobx";

export class ProfileVM {
    profile = null
    draftProfile = {
        firstName: "",
        lastName: "",
        patronymic: "",
        phoneNumber: ""
    }
    states = ["Просмотр", "Редактирование"]
    state = this.states[0]

    constructor() {
        makeObservable(this, {
            profile: observable,
            state: observable,
            draftProfile: observable,
            handleChange: action,
            handleState: action,
            handleRemoveChanges: action,
            setProfile: action,
            updateProfile: action,
        })
    }

    updateProfile = async (mutate, queryClient) => {
        mutate(this.draftProfile, {
            onSuccess: (response) => {
                this.state = this.states[0];
                console.log(response.data);
                //тут мы говорим, что запрос с ключом profile надо синхронизировать с сервером
                //и он обновляет данные
                queryClient.invalidateQueries({
                    queryKey: ['profile'],
                    exact: true,
                });
            },
            onError: (error) => {
                console.log(error);
            }
        })
    }

    handleState = (state) => {
        this.state = state;
        if(state === this.states[1] && this.profile) {
            console.log(toJS(this.profile));
            this.draftProfile.firstName = this.profile.firstName || "";
            this.draftProfile.lastName = this.profile.lastName || "";
            this.draftProfile.patronymic = this.profile.patronymic || "";
            this.draftProfile.phoneNumber = this.profile.phoneNumber || "";
        }
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.draftProfile = {
            ...this.draftProfile,
            [name]: value
        }
    }

    handleRemoveChanges = () => {
        this.draftProfile = {
            firstName: this.profile.firstName,
            lastName: this.profile.lastName,
            patronymic: this.profile.patronymic,
            phoneNumber: this.profile.phoneNumber,
        }
    }

    setProfile(profile) {
        this.profile = profile
    }


}