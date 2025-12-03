import React, { InputHTMLAttributes } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(({ className, label, ...props }, ref) => {
    return (
        <label className="flex items-center space-x-2.5 cursor-pointer select-none group">
            <div className="relative">
                <input
                    type="checkbox"
                    className="peer h-5 w-5 shrink-0 rounded border border-gray-300 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-davus-primary/50 disabled:cursor-not-allowed disabled:opacity-50 appearance-none checked:bg-davus-primary checked:border-davus-primary dark:border-gray-600 dark:bg-gray-800 transition-all"
                    ref={ref}
                    {...props}
                />
                <Check className="h-3.5 w-3.5 text-white absolute top-[3px] left-[3px] opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" strokeWidth={3} />
            </div>
            <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 dark:text-gray-300 group-hover:text-davus-primary dark:group-hover:text-davus-accent transition-colors">
                {label}
            </span>
        </label>
    );
});

Checkbox.displayName = "Checkbox";
