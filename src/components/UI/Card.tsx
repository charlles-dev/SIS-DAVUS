import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

export const Card: React.FC<HTMLMotionProps<"div">> = ({ className, children, ...props }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={cn(
            "rounded-xl border border-gray-100 bg-white text-davus-dark shadow-soft hover:shadow-lg transition-all duration-300",
            "dark:bg-gray-900/50 dark:border-gray-800 dark:text-gray-100 backdrop-blur-sm",
            className
        )}
        {...props}
    >
        {children}
    </motion.div>
);

export const CardHeader: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => (
    <div className={cn("flex flex-col space-y-1.5 p-6", className)}>{children}</div>
);

export const CardTitle: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => (
    <h3 className={cn("text-lg font-semibold leading-none tracking-tight", className)}>{children}</h3>
);

export const CardDescription: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => (
    <p className={cn("text-sm text-gray-500 dark:text-gray-400", className)}>{children}</p>
);

export const CardContent: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => (
    <div className={cn("p-6 pt-0", className)}>{children}</div>
);

export const CardFooter: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => (
    <div className={cn("flex items-center p-6 pt-0", className)}>{children}</div>
);
