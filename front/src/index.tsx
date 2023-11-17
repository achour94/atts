import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import { store } from './app/store'
import { Provider } from 'react-redux'

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import UserService from './services/UserService';



const rootElement = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(rootElement);
const renderApp = () => root.render(
    // <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <Routes>
                    <Route path="/*" element={
                        < App />
                    } />
                </Routes>
            </BrowserRouter>
        </Provider>
    // </React.StrictMode>
);

UserService.initKeycloak(renderApp);