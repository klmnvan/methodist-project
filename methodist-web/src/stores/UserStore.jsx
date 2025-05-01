import {makeAutoObservable} from "mobx";
import {jwtDecode} from "jwt-decode";

class UserStore {
    token = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidXNlckBleGFtcGxlLmNvbSIsImdpdmVuX25hbWUiOiJ1c2VyQGV4YW1wbGUuY29tIiwicm9sZSI6IlRlYWNoZXIiLCJ1bmlxdWVfbmFtZSI6InVzZXJAZXhhbXBsZS5jb20iLCJuYW1laWQiOiIwMTk2MDAyMy1kNDA1LTdmN2ItOTljNS02NjRmMjU4ZDc0YmEiLCJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJuYmYiOjE3NDU2NzIyNDIsImV4cCI6MTc0NTY3MzQ0MiwiaWF0IjoxNzQ1NjcyMjQyLCJpc3MiOiJNZXRob2Rpc3RfQVBJIiwiYXVkIjoiTWV0aG9kaXN0X0FwcHMifQ.eLbGLJMwbqFL-8rxcRgYKtsfuw06kK-i8r7HrtdZaM0ve2HGnyPZOeZluex-i6UjmfIgmFwoAgFWDcBWePYQRA";

    constructor() {
        makeAutoObservable(this);
    }

    tokenIsValid() {
        const decoded = jwtDecode(this.token);
        console.log(decoded);
        const currentTime = Math.floor(Date.now() / 1000); // Текущее время в секундах
        if (decoded.exp < currentTime) {
            console.log("Токен истек");
            return false
        } else {
            console.log("Токен действителен");
        }
        if (decoded.iss !== "Methodist_API") {
            console.log("Неверный издатель токена");
            return false
        }
        if (decoded.aud !== "Methodist_Apps") {
            console.log("Неверная аудитория токена");
            return false
        }
        return true
    }

    setToken(newToken) {
        this.token = newToken;
        localStorage.setItem('token', newToken); // Сохраняем токен в localStorage
    }

    clearToken() {
        this.token = null;
        localStorage.removeItem('token'); // Удаляем токен из localStorage
    }

    loadToken() {
        const savedToken = localStorage.getItem('token');
        if (savedToken) {
            this.token = savedToken; // Загружаем токен из localStorage при инициализации
        }
    }

}

const userStore = new UserStore();
userStore.loadToken(); // Загружаем токен при создании store
export default userStore;
