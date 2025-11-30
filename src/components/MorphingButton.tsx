import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2, AlertCircle } from 'lucide-react';

interface MorphingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    status: 'idle' | 'loading' | 'success' | 'error';
    children: React.ReactNode;
}

export const MorphingButton: React.FC<MorphingButtonProps> = ({ status, children, className, ...props }) => {
    return (
        <motion.button
            layout
            disabled={status === 'loading'}
            initial={false}
            animate={{
                width: status === 'loading' || status === 'success' ? 48 : 'auto',
                backgroundColor:
                    status === 'success' ? '#22c55e' :
                        status === 'error' ? '#ef4444' :
                            '#ff5d38',
                borderRadius: status === 'loading' || status === 'success' ? 50 : 8
            }}
            transition={{
                layout: { duration: 0.3, type: 'spring', stiffness: 500, damping: 30 },
                backgroundColor: { duration: 0.2 }
            }}
            className={`relative flex items-center justify-center h-12 px-6 text-white font-medium overflow-hidden ${className}`}
            {...(status === 'error' ? {
                animate: { x: [0, -5, 5, -5, 5, 0] },
                transition: { duration: 0.4 }
            } : {})}
            {...props as any}
        >
            <AnimatePresence mode="wait">
                {status === 'idle' && (
                    <motion.span
                        key="idle"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        {children}
                    </motion.span>
                )}
                {status === 'loading' && (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                    >
                        <Loader2 className="w-6 h-6 animate-spin" />
                    </motion.div>
                )}
                {status === 'success' && (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                    >
                        <Check className="w-6 h-6" />
                    </motion.div>
                )}
                {status === 'error' && (
                    <motion.span
                        key="error"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2"
                    >
                        <AlertCircle className="w-5 h-5" />
                        Tentar Novamente
                    </motion.span>
                )}
            </AnimatePresence>
        </motion.button>
    );
};
