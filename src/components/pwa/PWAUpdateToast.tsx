import React, { useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { toast } from 'sonner';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/UI';

export const PWAUpdateToast: React.FC = () => {
    const {
        needRefresh: [needRefresh, setNeedRefresh],
        updateServiceWorker,
    } = useRegisterSW({
        onRegistered(r) {
            console.log('SW Registered: ' + r);
        },
        onRegisterError(error) {
            console.log('SW registration error', error);
        },
    });

    useEffect(() => {
        if (needRefresh) {
            toast.custom((t) => (
                <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 w-full max-w-md">
                    <div className="p-2 bg-blue-500/10 rounded-full">
                        <RefreshCw className="w-6 h-6 text-blue-500 animate-spin-slow" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">Nova atualização disponível</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Recarregue para aplicar as mudanças.</p>
                    </div>
                    <Button
                        size="sm"
                        onClick={() => updateServiceWorker(true)}
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                        Atualizar
                    </Button>
                </div>
            ), {
                duration: Infinity,
                position: 'bottom-right',
                id: 'pwa-update-toast'
            });
        }
    }, [needRefresh, updateServiceWorker]);

    return null;
};
