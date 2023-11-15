import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { loginSuccess, logout } from '../../features/auth/authSlice';

const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:8000/api/',
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token;
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    }
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);
    if (result.error?.status === 401) {
        console.log('sending refresh token request');
        // If the request failed due to a bad token, try to refresh it
        const refreshResult = await baseQuery('auth/refresh/', api, extraOptions);
        console.log('refresh token result:', refreshResult);
        if (refreshResult?.data) {
            const user = api.getState().auth.user;
            //store the new token in the store
            api.dispatch(loginSuccess({
                user,
                token: refreshResult.data.access,
            }));
            // retry the initial request
            console.log('retrying initial request');
            result = await baseQuery(args, api, extraOptions);
        } else {
            api.dispatch(logout());
        }
    }
    return result;
}

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({}),
});