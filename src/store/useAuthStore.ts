import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, LoginResponse } from '@/types/types';

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (data: LoginResponse) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            login: (data) => set({
                user: data.user,
                token: data.token,
                isAuthenticated: true
            }),
            logout: () => set({
                user: null,
                token: null,
                isAuthenticated: false
            }),
        }),
        {
            name: 'auth-storage',
            version: 1,
            migrate: (persistedState: any, version: number) => {
                if (version === 0) {
                    // Force reset for version 0 to clear potentially corrupted state
                    return {
                        user: null,
                        token: null,
                        isAuthenticated: false
                    };
                }
                return persistedState as AuthState;
            },
        }
    )
);
