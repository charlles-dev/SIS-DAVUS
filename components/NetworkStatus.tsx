import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';

export const NetworkStatus: React.FC = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [showReconnected, setShowReconnected] = useState(false);

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            setShowReconnected(true);
            setTimeout(() => setShowReconnected(false), 3000);
        };
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    if (!isOnline) {
        return (
            <div className="bg-amber-500 text-white text-xs font-medium text-center py-1 sticky top-0 z-50 flex items-center justify-center gap-2">
                <WifiOff size={12} />
                Você está offline. Algumas funções podem estar indisponíveis.
            </div>
        );
    }

    if (showReconnected) {
        return (
            <div className="bg-green-500 text-white text-xs font-medium text-center py-1 sticky top-0 z-50 flex items-center justify-center gap-2">
                <Wifi size={12} />
                Conexão restabelecida.
            </div>
        );
    }

    return null;
};
