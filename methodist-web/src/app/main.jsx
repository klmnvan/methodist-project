import {StrictMode, useEffect, useState} from 'react'
import { createRoot } from 'react-dom/client'
import '@/app/index.css'
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {MethodistThemeProvider as MethodistThemeProvider} from "@/presentation/providers/MethodistThemeProvider.jsx";
import AuthorizationPage from "@/presentation/pages/authorization/AuthorizationPage.jsx";
import MainPage from "@/presentation/pages/main/MainPage.jsx";
import Auth from "@/presentation/pages/auth/Auth.jsx";
import AxiosClient from "@/data/AxiosClient.jsx";

function AuthWrapper() {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const authValid = await AxiosClient.checkAuthState();
                setIsAuthenticated(authValid);
            } catch (error) {
                console.error('Authentication check failed:', error);
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };
        checkAuth();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return isAuthenticated ? <Navigate to="/main" replace /> : <Navigate to="/auth" replace />;
}

// Основной компонент приложения
function App() {
    return (
        <MethodistThemeProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<AuthWrapper />} />
                    <Route path="/auth" element={<AuthorizationPage />} />
                    <Route path="/main" element={<MainPage />} />
                    <Route path="/a" element={<Auth />} />
                </Routes>
            </BrowserRouter>
        </MethodistThemeProvider>
    );
}

// Рендеринг приложения
createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App />
    </StrictMode>
);
