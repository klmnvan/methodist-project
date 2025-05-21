import {useEffect, useState} from "react";
import {Navigate} from "react-router-dom";
import {postService} from "@/data/network/PostService.js";
import {userStore} from "@/stores/UserStore.jsx";

export const AuthWrapper = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const refreshToken = async () => {
            try {
                const response = await postService.refreshToken();
                if (response.data?.accessToken) {
                    userStore.setToken(response.data.accessToken);
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                setIsAuthenticated(false);
            }
        };
        refreshToken();
    }, []);

    if (isAuthenticated === null) {
        return <div>Loading...</div>;
    }

    return isAuthenticated ? <Navigate to="/main" replace /> : <Navigate to="/auth" replace />;
};
