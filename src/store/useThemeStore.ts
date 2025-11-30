import { create } from 'zustand';

interface ThemeState {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    setTheme: (theme: 'light' | 'dark') => void;
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
    setTheme: (theme: 'light' | 'dark') => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        set({ theme });
    },
    initTheme: () => {
        const stored = localStorage.getItem('theme') as 'light' | 'dark';
        if (stored) {
            if (stored === 'dark') document.documentElement.classList.add('dark');
            else document.documentElement.classList.remove('dark');
            set({ theme: stored });
        } else {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            if (systemTheme === 'dark') document.documentElement.classList.add('dark');
            else document.documentElement.classList.remove('dark');
            set({ theme: systemTheme });
        }
    }
}));
