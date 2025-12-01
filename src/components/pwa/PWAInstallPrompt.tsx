import React, { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/UI';
import { motion, AnimatePresence } from 'framer-motion';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const PWAInstallPrompt: React.FC = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const isMobile = () => {
            const userAgent = window.navigator.userAgent.toLowerCase();
            return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
        };

        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            if (isMobile()) {
                setIsVisible(true);
            }
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();

        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            setDeferredPrompt(null);
            setIsVisible(false);
        }
    };

    const handleDismiss = () => {
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    className="fixed bottom-4 left-4 z-50 flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 max-w-sm"
                >
                    <div className="p-2 bg-davus-primary/10 rounded-full">
                        <Download className="w-6 h-6 text-davus-primary" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">Instalar App</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Instale o app para acesso rápido e offline.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button size="sm" onClick={handleInstallClick} className="bg-davus-primary hover:bg-davus-primary/90 text-white">
                            Instalar
                        </Button>
                        <button
                            onClick={handleDismiss}
                            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                        >
                            <X className="w-4 h-4 text-slate-400" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
