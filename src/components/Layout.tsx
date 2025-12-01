import React, { useEffect } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import {
  Search,
  Sun,
  Moon
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useUIStore } from '../store/useUIStore';
import { useThemeStore } from '../store/useThemeStore';
import { NotificationsPopover } from './Shared';
import { NetworkStatus } from './NetworkStatus';
import { CommandPalette } from './CommandPalette';
import { OfflineStatus } from './OfflineStatus';
import { ToastContainer } from './UI/Toast';
import { TourOverlay } from './UI/TourOverlay';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme, initTheme } = useThemeStore();

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  return (
    <button
      onClick={toggleTheme}
      className="p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 rounded-full transition-colors"
      title={theme === 'light' ? "Mudar para Modo Escuro" : "Mudar para Modo Claro"}
    >
      {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
};

export const MainLayout: React.FC = () => {
  const { toggleSearch } = useUIStore();
  const location = useLocation();

  return (
    <div
      className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors duration-300"
    >
      <NetworkStatus />
      <OfflineStatus />
      <CommandPalette />
      <ToastContainer />
      <TourOverlay />

      <div className="flex flex-1">
        {/* Sidebar Component - Hidden on mobile via CSS in Sidebar.tsx */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-0">
          {/* Header */}
          <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md h-16 border-b border-gray-200/50 dark:border-gray-800/50 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30 transition-all duration-300">
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-semibold text-davus-dark dark:text-white block">Sistema de Gestão</h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                data-tour="search-btn"
                onClick={toggleSearch}
                className="p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 rounded-full transition-colors mr-1"
                title="Buscar (Ctrl+K)"
              >
                <Search size={20} />
              </button>
              <div data-tour="theme-toggle">
                <ThemeToggle />
              </div>
              <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1"></div>
              <div data-tour="notifications">
                <NotificationsPopover />
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-x-hidden py-4 md:py-8">
            <div className="app-container">
              <div className="space-y-6">
                <Outlet />
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Bottom Navigation for Mobile */}
      <BottomNav />
    </div>
  );
};
