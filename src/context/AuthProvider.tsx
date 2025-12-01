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
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        let mounted = true;

        const initializeAuth = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();

                if (session?.user) {
                    // Fetch profile to get role and status
                    const { data: profile, error } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', session.user.id)
                        .single();

                    if (error || !profile) {
                        console.error('Error fetching profile:', error);
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
                    // No session, ensure store is cleared
                    logout();
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
                logout();
            } finally {
                if (mounted) setLoading(false);
            }
        };

        initializeAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
                // Logic handled by initializeAuth mostly, but good for fresh logins
                // We can re-fetch profile here to be safe or rely on the login component to have set it.
                // For persistence, initializeAuth does the heavy lifting on load.
                // This listener is more for when the user explicitly logs in/out in the current tab.

                // However, to avoid double fetching, we might just let the login component handle the initial store set
                // and this listener just ensures consistency.
                // But for simplicity and robustness, let's just ensure we have the profile.
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

    return (
        <AuthContext.Provider value={{ loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
