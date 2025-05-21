import {makeAutoObservable} from "mobx";

class UserStore {
    _accessToken = null;

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true });
        this._loadToken()
    }

    setToken(token) {
        console.log('Setting token:', token);
        this._accessToken = token;
        localStorage.setItem('accessToken', token);
    }

    clearAuthData() {
        this._accessToken = null;
        localStorage.removeItem('accessToken');
    }

    get accessToken() {
        return this._accessToken;
    }

    _loadToken() {
        const token = localStorage.getItem('accessToken');
        if (token) {
            this._accessToken = token;
        }
    }

}

// Создаем единственный экземпляр
const userStore = new UserStore();

// Экспортируем все необходимое
export { userStore };