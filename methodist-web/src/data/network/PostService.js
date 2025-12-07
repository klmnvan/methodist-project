import axios from "axios";
import {userStore} from "@/stores/UserStore.jsx";

class PostService {
    //BASE_URL = "https://iis.ngknn.ru/ngknn/КлимычеваАА/API/"
    BASE_URL = 'http://localhost:80/'

    client = axios.create({
        baseURL: this.BASE_URL,
        timeout: 5000,
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
    });

    constructor() {
        //добавление access токена в запросы
        this.client.interceptors.request.use(config => {
            if (userStore.accessToken) {
                config.headers.Authorization = `Bearer ${userStore.accessToken}`;
            }
            return config;
        });

        //обработка ошибки 401
        this.client.interceptors.response.use(
            (response) => response, //когда ответ успешный, просто возвращаем его
            (error) => { //когда приходит ошибка
                //если ошибка авторизации
                if(error.response && error.response.status === 401
                    && error.config.url !== 'Account/Login'
                    && error.config.url !== 'Account/RefreshToken') {
                    console.error("Ошибка 401: Unauthorized", error)
                    this.autoRefreshToken()
                    return
                }
                //если какая-то другая ошибка, возвращаем её, чтобы обработать далее
                return Promise.reject(error);
            }
        )

    }

    async autoRefreshToken() {
        const response = await this.client.patch('Account/RefreshToken')
        userStore.setToken(response.data.accessToken)
    }

    refreshToken() {
        return this.client.patch('Account/RefreshToken');
    }

    getEvents() {
        return this.client.get('Event/GetEvents')
    }

    getCommissions() {
        return this.client.get('MK/GetAll')
    }

    getTypesOfEvent() {
        return this.client.get('Event/GetTypeOfEvents')
    }

    getResultFile(fileName) {
        return this.client.get(`Event/Uploads/${fileName}`)
    }

    getProfile() {
        return this.client.get('Profile/GetProfile')
    }

    login(formData) {
        return this.client.post('Account/Login', formData)
    }

    logOut() {
        return this.client.delete('Account/Logout')
    }

    updateProfile(newProfile) {
        return this.client.patch('Profile/UpdatePart', newProfile)
    }

    updateEvent(event, id) {
        console.log(id)
        return this.client.patch('Event/UpdatePart', event, {
            headers: {
                "EventId": id
            }
        })
    }

    deleteEvent(id) {
        return this.client.delete('Event/Remove', {
            headers: {
              "EventId": id
            }
        })
    }

    uploadFiles(files, idEvent) {
        const formData = new FormData();

        files.forEach(file => {
            formData.append('files', file);
        });

        return this.client.post('Event/UploadFiles', formData, {
            headers: {
                'idEvent': idEvent,
                'Content-Type': 'multipart/form-data'
            },
            transformRequest: (data) => data,
        });
    }

    createEvent(eventData) {
        return this.client.post('Event/Create', eventData);
    }

}

export const postService = new PostService();