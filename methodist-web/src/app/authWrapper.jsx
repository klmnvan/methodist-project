import {useEffect, useState} from "react";
import {Navigate} from "react-router-dom";
import axiosClient from "@/data/AxiosClient.jsx";

export function AuthWrapper() {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        async function checkAuth() {
            try {
                await axiosClient.refreshToken();
                setIsAuthenticated(true);
            } catch (error) {
                setIsAuthenticated(false);
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }

        checkAuth();

        // Обработчик события при неудачной авторизации (401 ошибка)
        const handleAuthFailed = () => {
            setIsAuthenticated(false);
        };

        window.addEventListener('authFailed', handleAuthFailed);

        return () => {
            window.removeEventListener('authFailed', handleAuthFailed);
        };
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return isAuthenticated ? <Navigate to="/main" replace /> : <Navigate to="/auth" replace />;
}
