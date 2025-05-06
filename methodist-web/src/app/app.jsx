// Основной компонент приложения
import {MethodistThemeProvider} from "@/presentation/providers/MethodistThemeProvider.jsx";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import AuthorizationPage from "@/presentation/pages/authorization/AuthorizationPage.jsx";
import MainPage from "@/presentation/pages/main/MainPage.jsx";
import Auth from "@/presentation/pages/auth/Auth.jsx";
import {AuthWrapper} from "@/app/authWrapper.jsx";

export function App() {
    return (
        <MethodistThemeProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<AuthWrapper/>}/>
                   {/*<Route path="/" element={<Navigate to="/auth" replace />}/>*/}
                    <Route path="/auth" element={<AuthorizationPage/>}/>
                    <Route path="/main" element={<MainPage/>}/>
                    <Route path="/a" element={<Auth/>}/>
                </Routes>
            </BrowserRouter>
        </MethodistThemeProvider>
    );
}