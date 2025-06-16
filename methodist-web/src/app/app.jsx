// Основной компонент приложения
import {AppStoreProvider, useStore} from "@/presentation/providers/AppStoreProvider.jsx";
import {HashRouter, Route, Router, Routes} from "react-router-dom";
import AuthorizationPage from "@/presentation/pages/authorization/AuthorizationPage.jsx";
import MainPage from "@/presentation/pages/main/MainPage.jsx";
import Auth from "@/presentation/pages/auth/Auth.jsx";
import {AuthWrapper} from "@/app/authWrapper.jsx";
import {QueryClient, QueryClientProvider, useQueryClient} from "@tanstack/react-query";
import {useEffect} from "react";

const queryClient = new QueryClient();

export function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AppStoreProvider>
                <QueryClientInitializer>
                    <HashRouter>
                        <Routes>
                            <Route path="/" element={<AuthWrapper/>}/>
                            {/*<Route path="/" element={<Navigate to="/auth" replace />}/>*/}
                            <Route path="/auth" element={<AuthorizationPage/>}/>
                            <Route path="/main" element={<MainPage/>}/>
                            <Route path="/a" element={<Auth/>}/>
                        </Routes>
                    </HashRouter>
                </QueryClientInitializer>
            </AppStoreProvider>
        </QueryClientProvider>
    );
}

export const QueryClientInitializer = ({ children }) => {
    const queryClient = useQueryClient();
    const store = useStore();

    useEffect(() => {
        store.setQueryClient(queryClient);
    }, [queryClient, store]);

    return children;
};