import {makeAutoObservable} from "mobx";

class UserStore {
    _accessToken = null;

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true });
    }

    setToken(token) {
        console.log('Setting token:', token);
        this._accessToken = token;
    }

    clearAuthData() {
        this._accessToken = null;
    }

    get isAuthenticated() {
        const authState = !!this._accessToken;
        console.log('Current auth state:', authState);
        return authState;
    }

    get accessToken() {
        return this._accessToken;
    }

}

// Создаем единственный экземпляр
const userStore = new UserStore();


// Экспортируем все необходимое
export { userStore };