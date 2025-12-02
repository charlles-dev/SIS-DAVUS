import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/useAuthStore';
import { UserRole } from '@/types/types';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

interface AuthContextType {
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ loading: true });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { login, logout, user } = useAuthStore();
    // Optimistic loading: if we have a user, don't show loading screen
    const [loading, setLoading] = useState(!user);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        let mounted = true;

        const initializeAuth = async () => {
            console.log('Auth: Initializing...');
            try {
                console.log('Auth: Getting session...');
                const { data: { session } } = await supabase.auth.getSession();
                console.log('Auth: Session retrieved', session ? 'User found' : 'No user');

                if (session?.user) {
                    // Fetch profile to get role and status
                    const { data: profile, error } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', session.user.id)
                        .single();

                    if (error) {
                        console.error('Error fetching profile:', error);
                        // Do NOT logout on generic errors (network, etc)
                        // Just warn and potentially let the app run with limited info or retry
                        toast.error('Erro ao carregar perfil. Algumas funcionalidades podem estar indisponíveis.');
                    } else if (!profile) {
                        // Profile explicitly missing (deleted)
                        console.error('Profile not found for user');
                        await supabase.auth.signOut();
                        logout();
                    } else if (!profile.is_active) {
                        // User is inactive, force logout
                        await supabase.auth.signOut();
                        logout();
                        toast.error('Sua conta foi desativada. Entre em contato com o administrador.');
                    } else {
                        // Sync store
                        login({
                            token: session.access_token,
                            user: {
                                id: profile.id,
                                username: profile.username || session.user.email || '',
                                full_name: profile.full_name || '',
                                role: profile.role as UserRole,
                                is_active: profile.is_active,
                                must_change_password: profile.must_change_password,
                                cpf: profile.cpf
                            }
                        });
                    }
                } else {
                    if (user && user.id) {
                        setLoading(false);
                        return;
                    }
                    logout();
                }
            } catch (error: any) {
                console.error('Auth initialization error:', error);
                if (user && user.id) {
                    // If we have a cached user, let them in even if verification failed
                    setLoading(false);
                } else {
                    logout();
                }
            } finally {
                if (mounted) setLoading(false);
            }
        };

        initializeAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();

                if (profile && profile.is_active) {
                    login({
                        token: session.access_token,
                        user: {
                            id: profile.id,
                            username: profile.username || session.user.email || '',
                            full_name: profile.full_name || '',
                            role: profile.role as UserRole,
                            is_active: profile.is_active,
                            must_change_password: profile.must_change_password,
                            cpf: profile.cpf
                        }
                    });
                }
            } else if (event === 'SIGNED_OUT') {
                logout();
            }
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, [login, logout]);

    // Real-time subscription for profile changes (e.g. deactivation)
    useEffect(() => {
        if (!user?.id) return;

        const channel = supabase
            .channel(`public:profiles:id=eq.${user.id}`)
            .on(
                'postgres_changes',
                {
                    event: '*', // Listen to all events (UPDATE, DELETE)
                    schema: 'public',
                    table: 'profiles',
                    filter: `id=eq.${user.id}`,
                },
                async (payload) => {
                    if (payload.eventType === 'DELETE') {
                        // User deleted
                        toast.error('Sua conta foi removida.');
                        await supabase.auth.signOut();
                        logout();
                    } else if (payload.eventType === 'UPDATE') {
                        const newProfile = payload.new as any;
                        if (!newProfile.is_active) {
                            // User deactivated
                            toast.error('Sua conta foi desativada.');
                            await supabase.auth.signOut();
                            logout();
                        } else {
                            // Update local user info if other fields changed
                            login({
                                token: (await supabase.auth.getSession()).data.session?.access_token || '',
                                user: {
                                    ...user,
                                    full_name: newProfile.full_name,
                                    role: newProfile.role,
                                    is_active: newProfile.is_active,
                                    must_change_password: newProfile.must_change_password
                                }
                            });
                        }
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user?.id, logout, login, user]);

    // Show slow connection message if loading takes too long
    const [showSlowConnectionMsg, setShowSlowConnectionMsg] = useState(false);

    useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (loading) {
            timeout = setTimeout(() => {
                setShowSlowConnectionMsg(true);
            }, 10000); // Show message after 10s
        }
        return () => clearTimeout(timeout);
    }, [loading]);

    const handleReset = () => {
        console.warn('User triggered manual reset (reload only)');
        window.location.reload();
    };

    const handleLogoutAndClear = async () => {
        console.warn('User triggered manual logout and clear');
        localStorage.clear();
        await supabase.auth.signOut();
        logout();
        window.location.reload();
    };

    return (
        <AuthContext.Provider value={{ loading }}>
            {loading ? (
                <div className="flex flex-col items-center justify-center h-screen bg-gray-50 dark:bg-gray-900 gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-davus-primary"></div>
                    <div className="text-center px-4">
                        <p className="text-gray-600 dark:text-gray-400 font-medium">Carregando...</p>
                        {showSlowConnectionMsg && (
                            <div className="mt-4 flex flex-col items-center gap-3 animate-fade-in-up">
                                <p className="text-sm text-amber-600 dark:text-amber-500">
                                    A conexão está lenta ou o servidor não está respondendo.
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleReset}
                                        className="px-4 py-2 bg-davus-primary text-white rounded-lg text-sm font-medium hover:bg-davus-primary/90 transition-colors shadow-sm"
                                    >
                                        Tentar Novamente
                                    </button>
                                    <button
                                        onClick={handleLogoutAndClear}
                                        className="px-4 py-2 bg-white dark:bg-gray-800 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shadow-sm"
                                    >
                                        Sair e Limpar Dados
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};
