import { create } from 'zustand';

interface ThemeState {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    initTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
    theme: (localStorage.getItem('theme') as 'light' | 'dark') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'),
    toggleTheme: () => {
        const newTheme = get().theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);

        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        set({ theme: newTheme });
    },
    initTheme: () => {
        const stored = localStorage.getItem('theme') as 'light' | 'dark';
        if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
            set({ theme: 'dark' });
        } else {
            document.documentElement.classList.remove('dark');
            set({ theme: 'light' });
        }
    }
}));
