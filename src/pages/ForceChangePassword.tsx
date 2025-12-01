import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { AuthService } from '@/api/services';
import { Button, Input, Card, CardContent } from '@/components/UI';
import { toast } from 'sonner';
import { Lock } from 'lucide-react';

export const ForceChangePasswordPage: React.FC = () => {
    const navigate = useNavigate();
    const user = useAuthStore(state => state.user);
    const logout = useAuthStore(state => state.logout);

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error('As senhas não coincidem');
            return;
        }

        if (password.length < 6) {
            toast.error('A senha deve ter no mínimo 6 caracteres');
            return;
        }

        setLoading(true);
        try {
            await AuthService.changePassword(password, password); // Supabase update doesn't need old password for admin/force change usually, but checking service
            // Actually AuthService.changePassword calls supabase.auth.updateUser({ password: newPass }) which works for logged in user

            toast.success('Senha alterada com sucesso!');
            navigate('/app/home');
        } catch (error: any) {
            console.error('Change password error:', error);
            const errorMessage = error.message || 'Erro ao alterar senha';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
            <Card className="w-full max-w-md">
                <CardContent className="pt-6 space-y-6">
                    <div className="text-center space-y-2">
                        <div className="mx-auto w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                            <Lock className="w-6 h-6 text-yellow-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Alteração de Senha Necessária</h1>
                        <p className="text-gray-500 dark:text-gray-400">
                            Por segurança, você precisa alterar sua senha antes de continuar.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            type="password"
                            label="Nova Senha"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            placeholder="********"
                        />
                        <Input
                            type="password"
                            label="Confirme a Nova Senha"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            required
                            placeholder="********"
                        />

                        <div className="space-y-2">
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? 'Alterando...' : 'Alterar Senha e Entrar'}
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                className="w-full"
                                onClick={() => { logout(); navigate('/login'); }}
                            >
                                Sair
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};
