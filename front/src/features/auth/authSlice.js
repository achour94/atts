import { createSlice } from '@reduxjs/toolkit';
import keycloak from '../../keycloak-config';

const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth(state, action) {
            state.isAuthenticated = action.payload.isAuthenticated;
            state.token = action.payload.token;
        },
        loginStart(state) {
            state.isLoading = true;
            state.error = null;
        },
        loginSuccess(state, action) {
            state.isLoading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        loginFailure(state, action) {
            state.isLoading = false;
            state.error = action.payload;
        },
        logout(state) {
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
        },
    },
});

export const initKeycloack = (dispatch) => {
    keycloak.init({ onLoad: 'login-required' }).then((authenticated) => {
        if (authenticated) {
            keycloak.updateToken(30).then(() => {
                dispatch(setAuth({ isAuthenticated: authenticated, token: keycloak.token }));
            });
        } else {
            dispatch(setAuth({ isAuthenticated: authenticated, token: null }));
        }
    });
}

export const { setAuth, loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;