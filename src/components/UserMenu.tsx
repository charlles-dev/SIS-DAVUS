import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User as UserIcon, Settings } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { Dropdown, DropdownItem } from './ui/Dropdown';
import { supabase } from '@/lib/supabase';

export const UserMenu: React.FC = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut();
        } catch (error) {
            console.error('Error signing out:', error);
        } finally {
            logout();
        }
    };

    if (!user) return null;

    return (
        <Dropdown
            trigger={
                <div className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <div className="h-8 w-8 rounded-full bg-davus-primary flex items-center justify-center text-white font-medium shadow-sm">
                        {user.full_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="hidden md:block text-left mr-1">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-200 leading-none">{user.full_name.split(' ')[0]}</p>
                    </div>
                </div>
            }
        >
            <div className="px-2 py-1.5 mb-1 border-b border-gray-100 dark:border-gray-800 md:hidden">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.full_name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate capitalize">{user.role.toLowerCase()}</p>
            </div>

            <DropdownItem onClick={() => navigate('/app/profile')}>
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Meu Perfil</span>
            </DropdownItem>

            <DropdownItem onClick={handleLogout} className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/10">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
            </DropdownItem>
        </Dropdown>
    );
};
