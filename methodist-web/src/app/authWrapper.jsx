import {useEffect, useState} from "react";
import {Navigate} from "react-router-dom";
import axiosClient from "@/data/AxiosClient.jsx";

/*export function AuthWrapper() {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        async function checkAuth() {
            try {
                await axiosClient.refreshToken();
                setIsAuthenticated(true);
                console.error("setIsAuthenticated(true)");
            } catch (error) {
                setIsAuthenticated(false);
                console.error(error);
                console.log("setIsAuthenticated(true)")
            } finally {
                setIsLoading(false);
                console.log("setIsLoading(false)");
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
}*/


export const AuthWrapper = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const isValid = await axiosClient.refreshToken();
                setIsAuthenticated(isValid);
            } catch (error) {
                console.log(error);
                setIsAuthenticated(false);
            }
        };

        checkAuth();
    }, []);

    if (isAuthenticated === null) {
        return <div>Loading...</div>; // или ваш лоадер
    }

    return isAuthenticated ? <Navigate to="/main" replace /> : <Navigate to="/auth" replace />;
};
