import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    History,
    ShoppingCart,
    Wrench,
    HardHat,
    Users,
    FileText,
    Brain,
    Search,
    Moon,
    Sun,
    LogOut,
    MapPin,
    Printer,
    Settings,
    X
} from 'lucide-react';
import { useThemeStore, useAuthStore, useUIStore } from '../store';

export const CommandPalette: React.FC = () => {
    const { isSearchOpen, setSearchOpen, toggleSearch } = useUIStore();
    const navigate = useNavigate();
    const { toggleTheme, theme } = useThemeStore();
    const { logout } = useAuthStore();
    const [query, setQuery] = useState('');

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                toggleSearch();
            }
            if (e.key === 'Escape' && isSearchOpen) {
                setSearchOpen(false);
            }
        };

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, [toggleSearch, isSearchOpen, setSearchOpen]);

    useEffect(() => {
        if (isSearchOpen) {
            setQuery('');
        }
    }, [isSearchOpen]);

    const runCommand = (command: () => void) => {
        setSearchOpen(false);
        command();
    };

    const items = [
        { label: 'Dashboard', icon: LayoutDashboard, action: () => navigate('/app/dashboard'), group: 'Navegação' },
        { label: 'Estoque', icon: Package, action: () => navigate('/app/inventory'), group: 'Navegação' },
        { label: 'Movimentações', icon: History, action: () => navigate('/app/movements'), group: 'Navegação' },
        { label: 'Compras', icon: ShoppingCart, action: () => navigate('/app/purchases'), group: 'Navegação' },
        { label: 'Patrimônio', icon: Wrench, action: () => navigate('/app/assets'), group: 'Navegação' },
        { label: 'Cautelas', icon: HardHat, action: () => navigate('/app/checkouts'), group: 'Navegação' },
        { label: 'Obras & Locais', icon: MapPin, action: () => navigate('/app/locations'), group: 'Navegação' },
        { label: 'Impressão', icon: Printer, action: () => navigate('/app/bulk-print'), group: 'Navegação' },
        { label: 'Usuários', icon: Users, action: () => navigate('/app/admin'), group: 'Navegação' },
        { label: 'Relatórios', icon: FileText, action: () => navigate('/app/reports'), group: 'Navegação' },
        { label: 'Inteligência Artificial', icon: Brain, action: () => navigate('/app/ai-insights'), group: 'Navegação' },
        { label: 'Alternar Tema', icon: theme === 'dark' ? Sun : Moon, action: toggleTheme, group: 'Ações' },
        { label: 'Configurações', icon: Settings, action: () => navigate('/app/profile'), group: 'Ações' },
        { label: 'Sair do Sistema', icon: LogOut, action: logout, group: 'Ações', className: 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20' },
    ];

    const filteredItems = useMemo(() => {
        if (!query) return items;
        return items.filter(item => item.label.toLowerCase().includes(query.toLowerCase()));
    }, [query, items]);

    if (!isSearchOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] px-4">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => setSearchOpen(false)} />

            <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden animate-fade-in-up">
                <div className="flex items-center border-b border-gray-200 dark:border-gray-800 px-4 py-3">
                    <Search className="w-5 h-5 text-gray-500 mr-3" />
                    <input
                        autoFocus
                        type="text"
                        placeholder="O que você procura?..."
                        className="flex-1 bg-transparent outline-none text-gray-800 dark:text-gray-100 placeholder:text-gray-400 text-lg"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button onClick={() => setSearchOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <X size={20} />
                    </button>
                </div>

                <div className="max-h-[300px] overflow-y-auto p-2 scrollbar-thin">
                    {filteredItems.length === 0 ? (
                        <div className="py-8 text-center text-gray-500">
                            Nenhum resultado encontrado.
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {filteredItems.map((item, index) => (
                                <button
                                    key={index}
                                    onClick={() => runCommand(item.action)}
                                    className={`w-full flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-lg transition-colors text-left
                    ${item.className || 'text-gray-700 dark:text-gray-200 hover:bg-davus-primary/10 hover:text-davus-primary dark:hover:bg-davus-primary/20'}
                  `}
                                >
                                    <item.icon className="w-5 h-5 opacity-70" />
                                    {item.label}
                                    {item.group && <span className="ml-auto text-xs text-gray-400 font-normal">{item.group}</span>}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800 text-xs text-gray-400 flex justify-between">
                    <span>Use as setas para navegar</span>
                    <span>ESC para fechar</span>
                </div>
            </div>
        </div>
    );
};
