import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/app/index.css'
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {MethodistThemeProvider as MethodistThemeProvider} from "@/presentation/providers/MethodistThemeProvider.jsx";
import AuthorizationPage from "@/presentation/pages/authorization/AuthorizationPage.jsx";
import MainPage from "@/presentation/pages/main/MainPage.jsx";
import Auth from "@/presentation/pages/auth/Auth.jsx";

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <MethodistThemeProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Navigate to="/main" replace />} />
                    <Route path="/auth" element={<AuthorizationPage />} />
                    <Route path="/main" element={<MainPage />} />
                    <Route path="/a" element={<Auth />} />
                </Routes>
            </BrowserRouter>
        </MethodistThemeProvider>
    </StrictMode>
)
