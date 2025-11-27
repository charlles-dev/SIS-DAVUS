
import React, { useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useSwipe } from '../hooks/useSwipe';
import {
  LayoutDashboard,
  Package,
  History,
  ShoppingCart,
  Wrench,
  HardHat,
  Users,
  FileText,
  LogOut,
  Menu,
  X,
  MapPin,
  Settings,
  Printer,
  Sun,
  Moon,
  Brain,
  Search,
  Home
} from 'lucide-react';



const BottomNav = () => {
  const location = useLocation();
  const { toggleSidebar } = useUIStore();

  const navItems = [
    { to: '/home', icon: Home, label: 'Início' },
    { to: '/assets', icon: Wrench, label: 'Ativos' },
    { to: '/checkouts', icon: HardHat, label: 'Cautelas' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pb-safe z-40 flex justify-around items-center h-16 px-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      {navItems.map((item) => {
        const isActive = location.pathname.startsWith(item.to);
        return (
          <Link
            key={item.to}
            to={item.to}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-davus-primary' : 'text-gray-500 dark:text-gray-400'}`}
          >
            <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        );
      })}
      <button
        onClick={toggleSidebar}
        className="flex flex-col items-center justify-center w-full h-full space-y-1 text-gray-500 dark:text-gray-400"
      >
        <Menu size={20} />
        <span className="text-[10px] font-medium">Menu</span>
      </button>
    </div>
  );
};

// ... inside MainLayout return ...
<div className="flex flex-1 mb-16 md:mb-0"> {/* Add margin bottom for mobile nav */}
  {/* ... */}
  <BottomNav />
</div>
import { useAuthStore, useUIStore, useThemeStore } from '../store';
import { Button, DavusLogo } from './UI';
import { NotificationsPopover } from './Shared';
import { NetworkStatus } from './NetworkStatus';
import { CommandPalette } from './CommandPalette';
import { OfflineStatus } from './OfflineStatus';
import { ToastContainer } from './UI/Toast';
import { TourOverlay } from './UI/TourOverlay';

interface SidebarLinkProps {
  to: string;
  icon: any;
  label: string;
  onClick?: () => void;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon: Icon, label, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname.startsWith(to);

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 group relative ${isActive
        ? 'bg-davus-primary text-white'
        : 'text-gray-400 hover:bg-white/5 hover:text-white'
        }`}
    >
      <Icon className={`h-5 w-5 transition-transform group-hover:scale-105 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-white'}`} />
      <span className="relative z-10">{label}</span>
    </Link>
  );
};

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
  const { user, logout } = useAuthStore();
  const { isSidebarOpen, toggleSidebar, closeSidebar, toggleSearch } = useUIStore();

  // Mobile Gestures
  const swipeHandlers = useSwipe({
    onSwipeRight: () => {
      // Only open if swiping from the left edge (first 50px)
      // Note: useSwipe doesn't give us start position here easily without modifying it, 
      // but for now let's just allow swipe right to open if closed
      if (!isSidebarOpen) toggleSidebar();
    },
    onSwipeLeft: () => {
      if (isSidebarOpen) closeSidebar();
    }
  });

  const links = [
    { to: '/home', icon: Home, label: 'Início' },
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/inventory', icon: Package, label: 'Estoque' },
    { to: '/movements', icon: History, label: 'Movimentações' },
    { to: '/purchases', icon: ShoppingCart, label: 'Compras' },
    { to: '/assets', icon: Wrench, label: 'Patrimônio' },
    { to: '/maintenance-board', icon: Settings, label: 'Manutenção' },
    { to: '/checkouts', icon: HardHat, label: 'Cautelas' },
    { to: '/locations', icon: MapPin, label: 'Obras & Locais' },
    { to: '/bulk-print', icon: Printer, label: 'Impressão' },
    { to: '/admin', icon: Users, label: 'Usuários' },
    { to: '/admin-tools', icon: Settings, label: 'Ferramentas Admin' },
    { to: '/reports', icon: FileText, label: 'Relatórios' },
    { to: '/ai-insights', icon: Brain, label: 'Inteligência Artificial' },
  ];

  return (
    <div
      className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors duration-300"
      {...swipeHandlers}
    >
      <NetworkStatus />
      <OfflineStatus />
      <CommandPalette />
      <ToastContainer />
      <TourOverlay />

      <div className="flex flex-1">
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
            onClick={closeSidebar}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-davus-darker border-r border-white/5 transform transition-transform duration-300 ease-out md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
        >
          <div className="p-6 flex items-center gap-3 border-b border-white/5 justify-center md:justify-start">
            <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
              <DavusLogo className="h-8 w-auto brightness-0 invert" hideSubtitle />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">SIS-DAVUS</span>
            <button onClick={closeSidebar} className="ml-auto md:hidden text-gray-400 hover:text-white absolute right-4">
              <X size={20} />
            </button>
          </div>

          <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-180px)]" data-tour="sidebar">
            {links.map((link) => (
              <SidebarLink
                key={link.to}
                {...link}
                onClick={() => { if (window.innerWidth < 768) closeSidebar() }}
              />
            ))}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/5 bg-davus-darker">
            <Link to="/profile" className="flex items-center gap-3 mb-3 hover:bg-white/5 p-2 rounded-lg transition-colors group" data-tour="user-profile">
              <div className="h-9 w-9 rounded-full bg-davus-primary flex items-center justify-center text-white font-medium shadow-glow">
                {user?.full_name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium text-white truncate">{user?.full_name}</p>
                <p className="text-xs text-gray-400 truncate capitalize">{user?.role.toLowerCase()}</p>
              </div>
            </Link>
            <Button variant="ghost" size="sm" className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md h-16 border-b border-gray-200/50 dark:border-gray-800/50 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30 transition-all duration-300">
            <div className="flex items-center gap-3">
              <button onClick={toggleSidebar} className="md:hidden p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
                <Menu size={20} />
              </button>
              <h1 className="text-lg font-semibold text-davus-dark dark:text-white hidden md:block">Sistema de Gestão</h1>
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
    </div>
  );
};
