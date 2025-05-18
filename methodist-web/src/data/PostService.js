import axios from "axios";

class PostService {
    private BASE_URL = "http://localhost:8080/"

    private client = axios.create({
        baseURL: this.BASE_URL,
        timeout: 1000,
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
    });

    getEvents() {
        return this.client.get('Event/GetEvents')
    }

    getProfile() {
        return this.client.get('Profile/GetProfile')
    }

    logOut() {
        return this.client.delete('Account/Logout')
    }

    updateProfile(newProfile) {
        return this.client.patch('Profile/UpdatePart', newProfile)
    }

}

export const postService = new PostService();