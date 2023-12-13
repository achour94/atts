import { createSlice } from '@reduxjs/toolkit';
import UserService from '../../services/UserService';

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
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        loginStart(state) {
            state.isLoading = true;
            state.error = null;
        },
        loginSuccess(state, action) {
            state.isLoading = false;
            state.isAuthenticated = action.payload.isAuthenticated;
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


export const { setAuth, loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;

export const initializeAuth = (dispatch) => {
    console.log("initializeAuth");
    if (!UserService.isInitialized()) {
        dispatch(loginStart());
        UserService.initKeycloak(() => {
            dispatch(loginSuccess({
                isAuthenticated: UserService.isLoggedIn(),
                user: UserService.getUsername(),
                token: UserService.getToken(),
            }));
        }, (error) => {
            dispatch(loginFailure(error));
        });
    }
  };

export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;