import { createSlice } from '@reduxjs/toolkit';

interface Invoice {
    id: number;
    client: any;
    proforma: boolean;
    creationDate: Date;
    fileUri: string;
    startPeriod: Date;
    endPeriod: Date;
    httAmount: number;
    tva: number;
    ttcAmount: number;
    invoiceNumber: number;
    consumptions: Array<any>;
}

const initialState = {
    invoices: [] as Invoice[],
};

const invoiceSlice = createSlice({
    name: 'invoices',
    initialState,
    reducers: {
        setInvoices(state, action) {
            state.invoices = {...action.payload.invoices};
        }
    },
});


export const { setInvoices } = invoiceSlice.actions;

export default invoiceSlice.reducer;

export const selectInvoice = (state: any, id: number) => {
    return state.invoices.invoices.find((invoice: Invoice) => invoice.id === id);
};