import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // O CSS que criamos antes
import App from './App';
import { AppProvider } from './context/AppContext'; // 1. Importe o AppProvider

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        {/* 2. Envolva o App com o AppProvider */}
        <AppProvider>
            <App/>
        </AppProvider>
    </React.StrictMode>
);
