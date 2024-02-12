import { createSlice } from '@reduxjs/toolkit';
import UserService from '../../services/UserService';

const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    roles: [],
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
            state.roles = action.payload.roles;
        },
        loginFailure(state, action) {
            state.isLoading = false;
            state.error = action.payload;
        },
        logout(state) {
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
            state.roles = [];
            state.error = null;
        },
    },
});


export const { setAuth, loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;

export const initializeAuth = (dispatch) => {
    if (!UserService.isInitialized()) {
        dispatch(loginStart());
        UserService.initKeycloak(() => {
            console.log(UserService.getTokenParsed())
            dispatch(loginSuccess({
                isAuthenticated: UserService.isLoggedIn(),
                user: UserService.getUsername(),
                token: UserService.getToken(),
                roles: UserService.getRoles(),
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
export const selectUserRoles = (state) => state.auth.roles;