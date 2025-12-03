import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps {
    variant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'success' | 'warning' | 'info';
    children: React.ReactNode;
    className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'default', children, className }) => {
    const variants = {
        default: "border-transparent bg-davus-primary/10 text-davus-primary hover:bg-davus-primary/20 dark:bg-davus-primary/20 dark:text-davus-accent",
        secondary: "border-transparent bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300",
        outline: "text-gray-600 border border-gray-200 dark:text-gray-400 dark:border-gray-700",
        destructive: "border-transparent bg-red-500/10 text-red-600 hover:bg-red-500/20 dark:bg-red-900/30 dark:text-red-400",
        success: "border-transparent bg-emerald-500/10 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
        warning: "border-transparent bg-amber-500/10 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
        info: "border-transparent bg-blue-500/10 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    };

    return (
        <div className={cn(
            "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2",
            variants[variant],
            className
        )}>
            {children}
        </div>
    );
};
