import React, { useId } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { value: string; label: string }[];
    placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ className, label, error, options, placeholder, ...props }, ref) => {
    const selectId = useId();
    const id = (props as any).id ?? selectId;

    return (
        <div className="w-full space-y-1.5">
            {label && (
                <label
                    htmlFor={id}
                    className="text-sm font-medium text-gray-700 dark:text-gray-200 leading-none"
                >
                    {label}
                </label>
            )}
            <div className="relative">
                <select
                    className={cn(
                        "flex h-11 w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-davus-primary/50 focus-visible:border-davus-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all shadow-sm",
                        "dark:bg-gray-900/50 dark:border-gray-700 dark:text-gray-100 dark:ring-offset-gray-900",
                        error ? "border-red-500" : "",
                        className
                    )}
                    id={id}
                    aria-invalid={error ? true : undefined}
                    ref={ref}
                    {...props}
                >
                    {placeholder && <option value="" disabled>{placeholder}</option>}
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50 pointer-events-none dark:text-gray-400" />
            </div>
            {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
        </div>
    );
});

Select.displayName = "Select";
