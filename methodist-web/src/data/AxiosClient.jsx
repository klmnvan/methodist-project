import axios from "axios";
import UserStore from "@/stores/UserStore.jsx";

class AxiosClient {

    axiosClient = axios.create({
        baseURL: 'http://localhost:80/',
        timeout: 1000,
        headers: {
            'Content-Type': 'application/json',
        },
        withCredentials: true,
    })

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
            return await this.axiosClient.get('Event/GetByIdProfile', {
                headers: {
                    'Authorization': `Bearer ${UserStore.token}`
                },
            })
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

    async checkAuthState() {
        try {
            // 1. Проверяем, есть ли access-токен
            const hasAccessToken = await this.checkAccessToken();

            if (hasAccessToken) {
                return true; // Пользователь авторизован
            }

            // 2. Проверяем refresh-токен
            const refreshValid = await this.validateRefreshToken();

            if (refreshValid) {
                // 3. Если refresh-токен валиден, обновляем access
                await this.refreshAccessToken();
                return true;
            }

            return false;
        } catch (error) {
            console.error('Auth check failed:', error);
            return false;
        }
    }

    async checkAccessToken() {
        try {
            // Проверяем валидность access-токена
            await this.axiosClient.post('Account/ValidateRefreshToken', { withCredentials: true });
            console.log("true")
            return true;
        } catch (error) {
            console.log("false")
            return false;
        }
    }

    async validateRefreshToken() {
        try {
            const response = await this.axiosClient.post(
                'Account/ValidateRefreshToken',
                {},
                { withCredentials: true }
            );
            return response.data.isValid;
        } catch (error) {
            return false;
        }
    }

    async refreshAccessToken() {
        try {
            const response = await this.axiosClient.post(
                'Account/RefreshToken',
                {},
                { withCredentials: true }
            );
            return true;
        } catch (error) {
            console.error('Token refresh failed:', error);
            throw error;
        }
    }


}

const httpClient = new AxiosClient();
export default httpClient;

