import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import authReducer from "../features/auth/authSlice";
import clientReducer from "../features/clients/clientSlice";
import invoiceReducer from "../features/invoices/invoiceSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        client: clientReducer,
        invoice: invoiceReducer
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: process.env.NODE_ENV !== 'production',
});