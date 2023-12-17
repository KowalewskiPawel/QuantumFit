import type { RootState } from "../../app/store";

export type AuthState = {
    token: string | null;
    username: string | null;
    uid: string | null;
    loginTime: number | null;
    loading: boolean;
    error: string | null;
};

export const selectAuthState = (state: RootState) => state.auth;