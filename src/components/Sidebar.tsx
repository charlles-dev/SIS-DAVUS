import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
    X,
    MapPin,
    Settings,
    Printer,
    Brain,
    Home,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useUIStore } from '../store/useUIStore';
import { DavusLogo } from '@/components/ui/DavusLogo';
import { Button } from '@/components/ui/Button';

export const Sidebar: React.FC = () => {
    const { user, logout } = useAuthStore();
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = React.useState(false);



    const links = [
        { to: '/app/home', icon: Home, label: 'Início', roles: ['ADMIN', 'MANAGER', 'OPERATOR'] },
        { to: '/app/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['ADMIN', 'MANAGER', 'OPERATOR'] },
        { to: '/app/inventory', icon: Package, label: 'Estoque', roles: ['ADMIN', 'MANAGER', 'OPERATOR'] },
        { to: '/app/movements', icon: History, label: 'Movimentações', roles: ['ADMIN', 'MANAGER', 'OPERATOR'] },
        { to: '/app/purchases', icon: ShoppingCart, label: 'Compras', roles: ['ADMIN', 'MANAGER', 'OPERATOR'] },
        { to: '/app/assets', icon: Wrench, label: 'Patrimônio', roles: ['ADMIN', 'MANAGER', 'OPERATOR'] },
        { to: '/app/maintenance-board', icon: Settings, label: 'Manutenção', roles: ['ADMIN', 'MANAGER', 'OPERATOR'] },
        { to: '/app/checkouts', icon: HardHat, label: 'Cautelas', roles: ['ADMIN', 'MANAGER', 'OPERATOR'] },
        { to: '/app/locations', icon: MapPin, label: 'Obras & Locais', roles: ['ADMIN', 'MANAGER', 'OPERATOR'] },
        { to: '/app/bulk-print', icon: Printer, label: 'Impressão', roles: ['ADMIN', 'MANAGER', 'OPERATOR'] },
        { to: '/app/admin', icon: Users, label: 'Usuários', roles: ['ADMIN'] },
        { to: '/app/admin-tools', icon: Settings, label: 'Ferramentas Admin', roles: ['ADMIN'] },
        { to: '/app/reports', icon: FileText, label: 'Relatórios', roles: ['ADMIN', 'MANAGER'] },
    ];

    const filteredLinks = links.filter(link => user && link.roles.includes(user.role));

    const sidebarVariants = {
        open: { width: 250, transition: { duration: 0.3, ease: "easeInOut" as const } },
        collapsed: { width: 80, transition: { duration: 0.3, ease: "easeInOut" as const } }
    };

    return (
        <>
            {/* Sidebar Container */}
            <motion.aside
                className={`hidden md:flex sticky top-0 left-0 z-50 h-screen bg-white dark:bg-[#181a1c] border-r border-gray-200 dark:border-[#2b2b2b] flex-col transition-colors duration-300`}
                variants={sidebarVariants}
                animate={isCollapsed ? 'collapsed' : 'open'}
                initial='open'
                role="navigation"
                aria-label="Menu principal"
            >
                {/* Header */}
                <div className={`p-4 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} border-b border-gray-200 dark:border-[#2b2b2b] transition-colors duration-300`}>
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="bg-gray-100 dark:bg-white/10 p-2 rounded-lg backdrop-blur-sm shrink-0 transition-colors duration-300">
                            <DavusLogo className="h-6 w-auto dark:brightness-0 dark:invert" hideSubtitle />
                        </div>
                        {!isCollapsed && (
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-gray-900 dark:text-white font-bold text-lg tracking-tight whitespace-nowrap"
                            >
                                SIS-DAVUS
                            </motion.span>
                        )}
                    </div>
                </div>

                {/* Navigation */}
                <nav id="sidebar-nav" className="flex-1 overflow-y-auto py-4 px-2 space-y-1 custom-scrollbar" aria-label="Navegação de módulos">
                    {filteredLinks.map((link) => {
                        const isActive = location.pathname.startsWith(link.to);
                        return (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`relative flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors duration-200 group ${isActive ? 'text-gray-900 dark:text-white bg-gray-100 dark:bg-white/5' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2b2b2b] hover:text-gray-900 dark:hover:text-white'}`}
                                aria-current={isActive ? 'page' : undefined}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="active-nav-indicator"
                                        className="absolute left-0 top-0 bottom-0 w-1 bg-[#ff5d38] rounded-r-full"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    />
                                )}
                                <link.icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-[#ff5d38]' : 'text-gray-500 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white'}`} />
                                {!isCollapsed && (
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="whitespace-nowrap"
                                    >
                                        {link.label}
                                    </motion.span>
                                )}
                            </Link>
                        );
                    })}
                </nav>


                {/* Footer / User Profile */}
                <div className="p-4 border-t border-gray-200 dark:border-[#2b2b2b] bg-white dark:bg-[#181a1c] transition-colors duration-300">
                    <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''} mb-3`}>
                        <div className="h-9 w-9 rounded-full bg-[#ff5d38] flex items-center justify-center text-white font-medium shadow-glow shrink-0">
                            {user?.full_name.charAt(0)}
                        </div>
                        {!isCollapsed && (
                            <div className="flex-1 min-w-0 overflow-hidden">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.full_name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate capitalize">{user?.role.toLowerCase()}</p>
                            </div>
                        )}
                    </div>

                    {!isCollapsed ? (
                        <Button variant="ghost" size="sm" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-500/10" onClick={logout}>
                            <LogOut className="h-4 w-4 mr-2" />
                            Sair
                        </Button>
                    ) : (
                        <button onClick={logout} className="w-full flex justify-center text-red-600 hover:text-red-700 p-2 rounded hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-500/10">
                            <LogOut className="h-5 w-5" />
                        </button>
                    )}
                </div>

                {/* Collapse Toggle (Desktop Only) */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 bg-white dark:bg-[#2b2b2b] text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-full p-1 border border-gray-200 dark:border-[#181a1c] shadow-lg z-50 transition-colors duration-300"
                    aria-label={isCollapsed ? 'Expandir menu' : 'Recolher menu'}
                    aria-expanded={!isCollapsed}
                    aria-controls="sidebar-nav"
                >
                    {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>
            </motion.aside>
        </>
    );
};
