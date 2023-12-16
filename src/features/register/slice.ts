import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RegisterState } from './state';

const initialState = {
    username: null,
    email: null,
    password: null,
    sex: null,
    height: null,
    weight: null,
    yearOfBirth: null,
    lifeStyle: null,
    aim: null,
    exerciseFrequency: null,
    photos: null,
    gymExperience: null,
    loading: false,
};

export const registerSlice = createSlice({
    name: 'register',
    initialState,
    reducers: {
        setRegisterState(state, action: PayloadAction<Partial<RegisterState>>) {
            Object.assign(state, action.payload);
        },
    },
});

export const { setRegisterState } = registerSlice.actions;