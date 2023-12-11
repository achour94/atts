import { apiSlice } from "../../app/api/apiSlice";

export const invoiceApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getInvoices: builder.query({
            query: ({ params }) => ({
                url: `invoice?${params}`,
                method: 'GET',
            }),
        }),
    }),
});

export const { useGetInvoicesQuery } = invoiceApiSlice;