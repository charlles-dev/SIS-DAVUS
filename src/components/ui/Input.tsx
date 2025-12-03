import React, { useId } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface InputProps extends Omit<HTMLMotionProps<"input">, "ref"> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, label, error, icon, ...props }, ref) => {
    const inputId = useId();
    const id = (props as any).id ?? inputId;

    return (
        <div className="w-full space-y-1.5">
            {label && (
                <label
                    htmlFor={id}
                    className="text-sm font-medium text-gray-700 dark:text-gray-200 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    {label}
                </label>
            )}
            <div className="relative">
                <motion.input
                    whileFocus={{ scale: 1.005 }}
                    className={cn(
                        "flex h-11 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-davus-primary/50 focus-visible:border-davus-primary transition-all shadow-sm",
                        "dark:bg-gray-900/50 dark:border-gray-700 dark:text-gray-100 dark:placeholder:text-gray-500 dark:ring-offset-gray-950 dark:focus-visible:ring-davus-primary/40",
                        error ? "border-red-500 focus-visible:ring-red-500/50" : "",
                        icon ? "pl-10" : "",
                        className
                    )}
                    id={id}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? `${id}-error` : undefined}
                    ref={ref}
                    {...props}
                />
                {icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        {icon}
                    </div>
                )}
            </div>
            {error && (
                <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    id={`${id}-error`}
                    className="text-xs text-red-500 font-medium flex items-center gap-1"
                >
                    {error}
                </motion.p>
            )}
        </div>
    );
});

Input.displayName = "Input";
