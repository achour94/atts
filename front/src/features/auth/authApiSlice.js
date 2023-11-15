import { apiSlice } from "../../app/api/apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation({
            query: ({ username, password }) => ({
                url: 'auth/login/',
                method: 'POST',
                body: { username, password },
            }),
        }),
        logout: builder.mutation({
            query: () => ({
                url: 'auth/logout/',
                method: 'POST',
            }),
        }),
        register: builder.mutation({
            query: ({ username, password }) => ({
                url: 'auth/register/',
                method: 'POST',
                body: { username, password },
            }),
        }),
    }),
});

export const { useLoginMutation, useLogoutMutation, useRegisterMutation } = authApiSlice;