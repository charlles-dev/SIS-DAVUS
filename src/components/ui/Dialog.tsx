import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/lib/utils';

interface DialogProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    className?: string;
}

export const Dialog: React.FC<DialogProps> = ({ isOpen, onClose, title, children, className }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className={cn(
                            "z-50 w-full max-w-lg scale-100 gap-4 border bg-white p-6 opacity-100 shadow-2xl sm:rounded-xl md:w-full max-h-[90vh] overflow-y-auto dark:bg-gray-900 dark:border-gray-800",
                            className
                        )}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="dialog-title"
                    >
                        <div className="flex flex-col space-y-1.5 text-center sm:text-left mb-6">
                            <div className="flex items-center justify-between">
                                <h2 id="dialog-title" className="text-xl font-semibold leading-none tracking-tight text-gray-900 dark:text-gray-100">{title}</h2>
                                <button
                                    onClick={onClose}
                                    className="rounded-full p-1 opacity-70 ring-offset-white transition-all hover:opacity-100 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-davus-primary focus:ring-offset-2 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800"
                                >
                                    <X className="h-5 w-5" />
                                    <span className="sr-only">Close</span>
                                </button>
                            </div>
                        </div>
                        <div className="text-gray-700 dark:text-gray-300">
                            {children}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'primary' | 'destructive';
    isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    variant = 'primary',
    isLoading
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="z-50 w-full max-w-sm scale-100 gap-4 border bg-white p-6 opacity-100 shadow-2xl rounded-xl dark:bg-gray-900 dark:border-gray-800"
                    >
                        <div className="flex flex-col space-y-3 text-center sm:text-left">
                            <div className="flex items-center gap-3 text-lg font-semibold leading-none tracking-tight text-gray-900 dark:text-gray-100">
                                <div className={cn("p-2 rounded-full", variant === 'destructive' ? "bg-red-100 text-red-600 dark:bg-red-900/30" : "bg-blue-100 text-blue-600 dark:bg-blue-900/30")}>
                                    <AlertTriangle className="h-5 w-5" />
                                </div>
                                {title}
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{description}</p>
                        </div>
                        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-8">
                            <Button variant="outline" onClick={onClose} className="mt-2 sm:mt-0" disabled={isLoading}>
                                {cancelText}
                            </Button>
                            <Button variant={variant} onClick={onConfirm} isLoading={isLoading}>
                                {confirmText}
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
