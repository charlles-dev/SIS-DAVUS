import React, { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';

export const OfflineStatus: React.FC = () => {
    const [isOffline, setIsOffline] = useState(!navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    if (!isOffline) return null;

    return (
        <div className="bg-red-500 text-white px-4 py-2 text-sm font-medium flex items-center justify-center gap-2 animate-slide-in">
            <WifiOff size={16} />
            <span>Você está offline. Algumas funcionalidades podem estar indisponíveis.</span>
        </div>
    );
};
