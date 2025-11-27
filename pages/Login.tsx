
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store';
import { AuthService } from '../services';
import { Button, Input, Card, CardContent, DavusLogo } from '../components/UI';
import { toast } from 'sonner';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await AuthService.login(username);
      login(response);
      navigate('/');
    } catch (error) {
      toast.error('Login falhou. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-davus-light dark:bg-gray-950 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 flex flex-col items-center">
          <DavusLogo className="h-16 w-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 mt-2">Sistema de Controle de Estoque e Patrimônio</p>
        </div>

        <Card className="shadow-xl border-t-4 border-t-davus-primary dark:border-t-davus-primary">
          <CardContent className="pt-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-center text-gray-800 dark:text-gray-200">Acesso ao Sistema</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Usuário (CPF ou E-mail)"
                placeholder="Digite seu usuário..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <Input
                type="password"
                label="Senha"
                placeholder="********"
                defaultValue="123456" // Demo convenience
                required
              />
              <Button type="submit" className="w-full mt-2" size="lg" isLoading={loading}>
                Acessar
              </Button>
            </form>
            <div className="mt-6 text-center">
              <a href="#" className="text-sm text-davus-primary hover:underline">Esqueci minha senha</a>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-gray-400 mt-8">
          &copy; 2025 Davus Engenharia. Versão 1.3
        </p>
      </div>
    </div>
  );
};
