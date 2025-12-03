
import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Ghost } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-davus-light flex items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        <Ghost className="h-24 w-24 mx-auto text-gray-300" />
        <h1 className="text-4xl font-bold text-davus-dark">404</h1>
        <h2 className="text-xl font-semibold text-gray-700">Página não encontrada</h2>
        <p className="text-gray-500">
          O recurso que você está procurando pode ter sido removido ou não existe.
        </p>
        <Link to="/app/dashboard">
          <Button size="lg">Voltar ao Dashboard</Button>
        </Link>
      </div>
    </div>
  );
};

export const UnauthorizedPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-davus-light flex items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        <ShieldAlert className="h-24 w-24 mx-auto text-red-200" />
        <h1 className="text-4xl font-bold text-davus-dark">403</h1>
        <h2 className="text-xl font-semibold text-gray-700">Acesso Negado</h2>
        <p className="text-gray-500">
          Você não tem permissão para acessar esta área do sistema. Entre em contato com o administrador.
        </p>
        <Link to="/app/dashboard">
          <Button size="lg" variant="outline">Voltar</Button>
        </Link>
      </div>
    </div>
  );
};
