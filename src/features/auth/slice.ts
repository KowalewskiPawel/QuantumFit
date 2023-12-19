import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthState } from './state';

const initialState = {
    token: null,
    username: null,
    uid: null,
    loginTime: null,
    loading: false,
    error: null,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setSessionState(state, action: PayloadAction<Partial<AuthState>>) {
            Object.assign(state, action.payload);
        },
    },
});

export const { setSessionState } = authSlice.actions;