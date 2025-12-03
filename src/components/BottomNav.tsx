import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Home,
    LayoutDashboard,
    Package,
    Wrench,
    ShoppingCart,
    MapPin,
    History,
    HardHat,
    Settings,
    Printer,
    Users,
    FileText,
    Menu,
    X,
    ChevronUp
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

interface NavItem {
    label: string;
    icon: any;
    to: string;
    roles: string[];
}

interface NavGroup {
    id: string;
    label: string;
    icon: any;
    items: NavItem[];
}

export const BottomNav: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuthStore();
    const [activeGroup, setActiveGroup] = useState<string | null>(null);
    const navRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (navRef.current && !navRef.current.contains(event.target as Node)) {
                setActiveGroup(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const navGroups: NavGroup[] = [
        {
            id: 'home',
            label: 'Início',
            icon: Home,
            items: [
                { label: 'Início', icon: Home, to: '/app/home', roles: ['ADMIN', 'MANAGER', 'OPERATOR'] },
                { label: 'Dashboard', icon: LayoutDashboard, to: '/app/dashboard', roles: ['ADMIN', 'MANAGER', 'OPERATOR'] },
            ]
        },
        {
            id: 'resources',
            label: 'Recursos',
            icon: Package,
            items: [
                { label: 'Estoque', icon: Package, to: '/app/inventory', roles: ['ADMIN', 'MANAGER', 'OPERATOR'] },
                { label: 'Patrimônio', icon: Wrench, to: '/app/assets', roles: ['ADMIN', 'MANAGER', 'OPERATOR'] },
                { label: 'Compras', icon: ShoppingCart, to: '/app/purchases', roles: ['ADMIN', 'MANAGER', 'OPERATOR'] },
                { label: 'Obras & Locais', icon: MapPin, to: '/app/locations', roles: ['ADMIN', 'MANAGER', 'OPERATOR'] },
            ]
        },
        {
            id: 'operations',
            label: 'Operações',
            icon: History,
            items: [
                { label: 'Movimentações', icon: History, to: '/app/movements', roles: ['ADMIN', 'MANAGER', 'OPERATOR'] },
                { label: 'Cautelas', icon: HardHat, to: '/app/checkouts', roles: ['ADMIN', 'MANAGER', 'OPERATOR'] },
                { label: 'Manutenção', icon: Settings, to: '/app/maintenance-board', roles: ['ADMIN', 'MANAGER', 'OPERATOR'] },
                { label: 'Impressão', icon: Printer, to: '/app/bulk-print', roles: ['ADMIN', 'MANAGER', 'OPERATOR'] },
            ]
        },
        {
            id: 'admin',
            label: 'Admin',
            icon: Users,
            items: [
                { label: 'Usuários', icon: Users, to: '/app/admin', roles: ['ADMIN'] },
                { label: 'Relatórios', icon: FileText, to: '/app/reports', roles: ['ADMIN', 'MANAGER'] },
                { label: 'Ferramentas', icon: Settings, to: '/app/admin-tools', roles: ['ADMIN'] },
            ]
        }
    ];

    const handleGroupClick = (groupId: string) => {
        if (navigator.vibrate) navigator.vibrate(10);
        if (activeGroup === groupId) {
            setActiveGroup(null);
        } else {
            setActiveGroup(groupId);
        }
    };

    const handleItemClick = (to: string) => {
        if (navigator.vibrate) navigator.vibrate(10);
        navigate(to);
        setActiveGroup(null);
    };

    const isGroupActive = (group: NavGroup) => {
        return group.items.some(item => location.pathname.startsWith(item.to));
    };

    return (
        <div ref={navRef} className="fixed bottom-0 left-0 right-0 z-50 md:hidden" role="navigation" aria-label="Navegação inferior">
            {/* Sub-menu Overlay */}
            <AnimatePresence>
                {activeGroup && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute bottom-20 left-4 right-4 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden"
                    >
                        <div className="p-2 grid grid-cols-2 gap-2">
                            {navGroups.find(g => g.id === activeGroup)?.items
                                .filter(item => user && item.roles.includes(user.role))
                                .map((item) => (
                                    <button
                                        key={item.to}
                                        onClick={() => handleItemClick(item.to)}
                                        className={`flex flex-col items-center justify-center p-3 rounded-xl transition-colors ${location.pathname.startsWith(item.to)
                                            ? 'bg-davus-primary/10 text-davus-primary'
                                            : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
                                            }`}
                                    >
                                        <item.icon size={24} className="mb-2" />
                                        <span className="text-xs font-medium">{item.label}</span>
                                    </button>
                                ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Bar */}
            <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 pb-safe px-4 py-2 flex justify-between items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]" role="menubar">
                {navGroups.map((group) => {
                    const isActive = isGroupActive(group);
                    const isOpen = activeGroup === group.id;

                    // Filter out groups that have no visible items for the current user
                    const hasVisibleItems = group.items.some(item => user && item.roles.includes(user.role));
                    if (!hasVisibleItems) return null;

                    return (
                        <button
                            key={group.id}
                            onClick={() => handleGroupClick(group.id)}
                            className={`relative flex flex-col items-center justify-center w-16 h-14 rounded-xl transition-all duration-300 ${isActive || isOpen ? 'text-davus-primary' : 'text-gray-500 dark:text-gray-400'
                                }`}
                            role="menuitem"
                            aria-haspopup="true"
                            aria-expanded={isOpen}
                            aria-label={`Abrir seção ${group.label}`}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="bottom-nav-indicator"
                                    className="absolute inset-0 bg-davus-primary/10 rounded-xl shadow-[0_0_15px_rgba(249,115,22,0.3)]"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            )}

                            <div className="relative z-10 flex flex-col items-center">
                                <group.icon size={24} strokeWidth={isActive || isOpen ? 2.5 : 2} />
                                <span className="text-[10px] font-medium mt-1" aria-hidden>{group.label}</span>
                            </div>

                            {/* Active Dot for sub-items */}
                            {isActive && !isOpen && (
                                <span className="absolute top-2 right-3 w-2 h-2 bg-davus-primary rounded-full ring-2 ring-white dark:ring-gray-900" />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
