import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/index.css'
import Auth from '@/views/auth/Auth.jsx'
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Registration from "@/views/registration/Registration.jsx";
import TestView from "@/views/test/TestView.jsx";
import {MethodistThemeProvider as MethodistThemeProvider} from "@/utils/MethodistThemeProvider.jsx";

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <MethodistThemeProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Navigate to="/regist" replace />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/regist" element={<Registration />} />
                    <Route path="/test" element={<TestView />} />
                </Routes>
            </BrowserRouter>
        </MethodistThemeProvider>
    </StrictMode>
)
