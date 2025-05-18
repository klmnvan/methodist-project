import axios from "axios";
import {userStore} from "@/stores/UserStore.jsx";

class AxiosClient {

    BASE_URL = 'https://iis.ngknn.ru/ngknn/КлимычеваАА/API/'

    constructor() {
        this.BASE_URL = 'https://iis.ngknn.ru/ngknn/КлимычеваАА/API/'
        this.axiosClient = axios.create({
            baseURL: this.BASE_URL,
            timeout: 1000,
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
        });
        this.isRefreshing = false;
        this.failedRequestsQueue = [];
        this._initializeInterceptors();
    }

    async validateRefreshToken() {
        try {
            console.log("Проверяю refresh token");
            const response = await axios(
                {
                    url: 'https://iis.ngknn.ru/ngknn/КлимычеваАА/API/Account/ValidateWebRefreshToken',
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                }
            )
            return response.data;
        }
        catch (error) {
            console.error(error);
            return false;
        }
    }

    async refreshToken() {
        try {
            if(await this.validateRefreshToken()) {
                console.log("зашёл в refresh token");
                const response = await this.axiosClient.patch('Account/RefreshToken');
                userStore.setToken(response.data.accessToken);
                console.log("refreshToken", `Токены обновлены\nНовый access token: ${response.data.accessToken}`);
                return true;
            }
            else {
                console.log("ну пиздец")
            }
        }
        catch (error) {
            console.error("Ошибка обновления токена:", error);
            userStore.clearAuthData();
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
                console.error("Перехватил 401", error);
                const originalRequest = error.config;

                if (error.response?.status === 401 && !originalRequest._retry) {
                    console.log("Запуск refresh token");
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
            return await this.axiosClient.get('Event/GetEvents')
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

    async getProfile() {
        try {
            return await this.axiosClient.get('Profile/GetProfile')
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

    async logOut() {
        try {
            return await this.axiosClient.delete('Account/Logout')
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

    async updateProfile(newProfile) {
        try {
            return await this.axiosClient.patch('Profile/UpdatePart', newProfile);
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

