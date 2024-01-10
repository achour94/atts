import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import clientReducer from "../features/clients/clientSlice";
import invoiceReducer from "../features/invoices/invoiceSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        client: clientReducer,
        invoice: invoiceReducer
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware(),
    devTools: process.env.NODE_ENV !== 'production',
});