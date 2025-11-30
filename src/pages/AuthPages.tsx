
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input, Card, CardContent } from '../components/UI';
import { AuthService } from '@/api/services';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await AuthService.resetPassword(email);
    setIsLoading(false);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-davus-light flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="h-16 w-16 bg-davus-primary rounded-lg flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 shadow-lg">
            D
          </div>
          <h1 className="text-2xl font-bold text-davus-dark">Recuperação de Senha</h1>
        </div>

        <Card className="shadow-xl">
          <CardContent className="pt-6">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-sm text-gray-600 text-center mb-4">
                  Digite seu e-mail cadastrado. Enviaremos um link para você redefinir sua senha.
                </p>
                <Input
                  label="E-mail"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                  Enviar Link
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <h3 className="text-lg font-semibold">Verifique seu e-mail</h3>
                <p className="text-sm text-gray-600">
                  Se o e-mail <strong>{email}</strong> estiver cadastrado, você receberá as instruções em breve.
                </p>
              </div>
            )}
            <div className="mt-6 text-center">
              <Link to="/login" className="text-sm text-davus-primary hover:underline">
                Voltar para Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
