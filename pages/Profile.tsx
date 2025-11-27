import React, { useState } from 'react';
import { User, Lock } from 'lucide-react';
import { Button, Input, Card, CardContent, CardHeader, CardTitle } from '../components/UI';
import { useAuthStore } from '../store';
import { AuthService } from '../services';
import { toast } from 'sonner';

export const ProfilePage: React.FC = () => {
  const { user, login } = useAuthStore();
  const [profileData, setProfileData] = useState({ full_name: user?.full_name || '', email: 'email@exemplo.com' });
  const [passData, setPassData] = useState({ current: '', new: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Mock update
      const updatedUser = await AuthService.updateProfile({ full_name: profileData.full_name });
      // Update local store via login action (simulating a refresh)
      login({ token: 'same', user: updatedUser });
      toast.success('Perfil atualizado com sucesso!');
    } catch (e) {
      toast.error('Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handlePassChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passData.new !== passData.confirm) {
      toast.warning('As senhas não conferem');
      return;
    }
    setLoading(true);
    try {
      await AuthService.changePassword(passData.current, passData.new);
      toast.success('Senha alterada com sucesso!');
      setPassData({ current: '', new: '', confirm: '' });
    } catch (e) {
      toast.error('Erro ao alterar senha');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-davus-dark dark:text-white">Meu Perfil</h2>
        <p className="text-gray-500 dark:text-gray-400">Gerencie suas informações e segurança.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Dados Pessoais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User size={20} className="text-davus-primary" />
              Dados Pessoais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <Input
                label="Nome Completo"
                value={profileData.full_name}
                onChange={e => setProfileData({ ...profileData, full_name: e.target.value })}
              />
              <Input
                label="E-mail"
                type="email"
                value={profileData.email}
                disabled
                className="bg-gray-100 dark:bg-gray-800"
              />
              <div className="pt-2">
                <Button type="submit" isLoading={loading}>Salvar Alterações</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Segurança */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock size={20} className="text-davus-primary" />
              Alterar Senha
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePassChange} className="space-y-4">
              <Input
                label="Senha Atual"
                type="password"
                value={passData.current}
                onChange={e => setPassData({ ...passData, current: e.target.value })}
                required
              />
              <Input
                label="Nova Senha"
                type="password"
                value={passData.new}
                onChange={e => setPassData({ ...passData, new: e.target.value })}
                required
              />
              <Input
                label="Confirmar Nova Senha"
                type="password"
                value={passData.confirm}
                onChange={e => setPassData({ ...passData, confirm: e.target.value })}
                required
              />
              <div className="pt-2">
                <Button type="submit" variant="outline" isLoading={loading}>Atualizar Senha</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};