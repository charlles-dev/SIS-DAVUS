import React, { useEffect, useState } from 'react';
import { api } from '@/lib/axios';
import { toast } from 'sonner';
import { ConstructionLoader } from '../ConstructionLoader';

interface ServerAwakeGuardProps {
    children: React.ReactNode;
}

export const ServerAwakeGuard: React.FC<ServerAwakeGuardProps> = ({ children }) => {
    const [isAwake, setIsAwake] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const checkServer = async () => {
            const start = Date.now();
            try {
                await api.get('/health/');
                setIsAwake(true);
            } catch (error) {
                console.error('Server check failed:', error);
                // Proceed anyway, maybe offline or error will be handled by components
                setIsAwake(true);
            } finally {
                const duration = Date.now() - start;
                if (duration > 2000) {
                    toast.info('Conectando ao servidor seguro...');
                }
                if (duration > 10000) {
                    toast.warning('Servidor em wake-up, aguarde...');
                }
                setIsChecking(false);
            }
        };

        checkServer();
    }, []);

    if (isChecking) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-[#181a1c]">
                <ConstructionLoader />
            </div>
        );
    }

    return <>{children}</>;
};
