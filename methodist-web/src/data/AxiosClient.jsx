import axios from "axios";
import {userStore} from "@/stores/UserStore.jsx";

class AxiosClient {

    constructor() {
        this.axiosClient = axios.create({
            baseURL: 'http://localhost:80/',
            timeout: 1000,
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
        });
        this.isRefreshing = false;
        this.failedRequestsQueue = [];
        this._initializeInterceptors();
    }

    async refreshToken() {
        try {
            const response = await this.axiosClient.patch('Account/RefreshToken');
            userStore.setToken(response.data.accessToken);
            console.log("refreshToken", `Токены обновлены\nНовый access token: ${response.data.accessToken}`);
            return true;
        }
        catch (error) {
            console.error("Ошибка обновления токена:", error);
            userStore.clearAuthData();
            window.dispatchEvent(new CustomEvent('authFailed'));
            throw error;
        }
    }

    _initializeInterceptors() {
        // Добавляем accessToken в заголовки
        this.axiosClient.interceptors.request.use(config => {
            if (userStore.accessToken) {
                config.headers.Authorization = `Bearer ${userStore.accessToken}`;
            }
            return config;
        });

        // Обработка 401 ошибок
        this.axiosClient.interceptors.response.use(
            response => response,
            async error => {
                const originalRequest = error.config;

                if (error.response?.status === 401 && !originalRequest._retry) {
                    if (this.isRefreshing) {
                        return new Promise((resolve, reject) => {
                            this.failedRequestsQueue.push({ resolve, reject });
                        }).then(() => this.axiosClient(originalRequest));
                    }

                    originalRequest._retry = true;
                    this.isRefreshing = true;

                    try {
                        await this.refreshToken();
                        this.failedRequestsQueue.forEach(prom => prom.resolve());
                        originalRequest.headers.Authorization = `Bearer ${userStore.accessToken}`;
                        return this.axiosClient(originalRequest);
                    } catch (refreshError) {
                        this.failedRequestsQueue.forEach(prom => prom.reject(refreshError));
                        return Promise.reject(refreshError);
                    } finally {
                        this.isRefreshing = false;
                        this.failedRequestsQueue = [];
                    }
                }
                return Promise.reject(error);
            }
        );
    }

    async login(formData) {
        try {
            const response =  await this.axiosClient.post('Account/Login', {
                email: formData.email,
                password: formData.password
            }, {
                withCredentials: true
            });
            console.log('Успешный логин. Куки есть');
            return response;
        }
        catch (error) {
            if (error.response && error.response.data && error.response.data.errors) {
                const errors = error.response.data.errors;
                const firstErrorArray = Object.values(errors)[0];
                const firstErrorMessage = firstErrorArray ? firstErrorArray[0] : 'Неизвестная ошибка';
                throw new Error(firstErrorMessage); // Выбрасываем ошибку с сообщением
            } else {
                throw new Error('Неизвестная ошибка');
            }
        }
    }

    async getEvents() {
        try {
            return await this.axiosClient.get('Event/GetByIdProfile')
        }
        catch (error) {
            console.error(error);
            if (error.response && error.response.data && error.response.data.errors) {
                const errors = error.response.data.errors;
                const firstErrorArray = Object.values(errors)[0];
                const firstErrorMessage = firstErrorArray ? firstErrorArray[0] : 'Неизвестная ошибка';
                throw new Error(firstErrorMessage); // Выбрасываем ошибку с сообщением
            } else {
                throw new Error('Неизвестная ошибка');
            }
        }
    }

}

const httpClient = new AxiosClient();
export default httpClient;

