import { create } from 'zustand';

interface UIState {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
    closeSidebar: () => void;
    isSearchOpen: boolean;
    toggleSearch: () => void;
    setSearchOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
    isSidebarOpen: false,
    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    closeSidebar: () => set({ isSidebarOpen: false }),
    isSearchOpen: false,
    toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
    setSearchOpen: (open) => set({ isSearchOpen: open }),
}));
