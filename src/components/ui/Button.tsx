import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    isLoading?: boolean;
    children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    className,
    variant = 'primary',
    size = 'md',
    isLoading,
    children,
    disabled,
    ...props
}) => {
    const variants = {
        primary: 'bg-gradient-to-r from-davus-primary to-davus-secondary text-white hover:shadow-glow hover:-translate-y-0.5 shadow-md dark:from-davus-primary dark:to-davus-secondary border-0',
        secondary: 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-750',
        outline: 'border-2 border-davus-primary/20 text-davus-primary hover:bg-davus-primary/5 hover:border-davus-primary/50 dark:border-davus-primary/30 dark:text-davus-accent',
        ghost: 'text-gray-600 hover:bg-gray-100 hover:text-davus-primary dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-davus-accent',
        destructive: 'bg-red-500 text-white hover:bg-red-600 shadow-sm hover:shadow-red-500/20',
        link: 'text-davus-primary underline-offset-4 hover:underline decoration-2 p-0 h-auto',
    };

    const sizes = {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 py-2 text-sm',
        lg: 'h-12 px-8 text-base',
        icon: 'h-10 w-10 p-0 flex items-center justify-center',
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
                'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-davus-primary/50 disabled:pointer-events-none disabled:opacity-50',
                variants[variant],
                sizes[size],
                className
            )}
            disabled={isLoading || disabled}
            aria-busy={isLoading ? true : undefined}
            aria-disabled={isLoading || disabled ? true : undefined}
            type={(props as any).type ?? 'button'}
            {...props}
        >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {children}
        </motion.button>
    );
};
