import axios from "axios";
import UserStore from "@/stores/UserStore.jsx";

class AxiosClient {

    axiosClient = axios.create({
        baseURL: 'http://localhost:80/', timeout: 1000, headers: {
            'Content-Type': 'application/json',
        }
    })

    async login(formData) {
        try {
            return await this.axiosClient.post('Account/Login', {
                email: formData.email,
                password: formData.password,
                device: "12345678"
            })
        } catch (error) {
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
        } catch (error) {
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