import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import '@/app/index.css'
import {App} from "@/app/app.jsx";

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App />
    </StrictMode>
);
