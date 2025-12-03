import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const EnvCheck: React.FC = () => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-[9999] bg-slate-900 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 text-center">
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Configuração Necessária</h1>
                <p className="text-slate-600 mb-6">
                    As variáveis de ambiente do Supabase não foram encontradas.
                </p>

                <div className="text-left bg-slate-100 p-4 rounded-md mb-6 font-mono text-sm overflow-x-auto">
                    <div className="flex items-center gap-2 mb-2">
                        <StatusIcon valid={!!supabaseUrl} />
                        <span>VITE_SUPABASE_URL</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <StatusIcon valid={!!supabaseKey} />
                        <span>VITE_SUPABASE_ANON_KEY</span>
                    </div>
                </div>

                <div className="text-sm text-slate-500 text-left space-y-2">
                    <p><strong>Para resolver no Vercel:</strong></p>
                    <ol className="list-decimal pl-5 space-y-1">
                        <li>Vá para o Dashboard do seu projeto</li>
                        <li>Clique em <strong>Settings</strong> {'>'} <strong>Environment Variables</strong></li>
                        <li>Adicione as chaves acima com os valores do seu projeto Supabase</li>
                        <li>Faça um novo deploy</li>
                    </ol>
                </div>
            </div>
        </div>
    );
};

const StatusIcon = ({ valid }: { valid: boolean }) => {
    return valid ? (
        <span className="text-green-600">✓</span>
    ) : (
        <span className="text-red-600">✗</span>
    );
};
