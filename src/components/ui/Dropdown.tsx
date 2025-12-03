import React, { useState, useRef, useEffect, ButtonHTMLAttributes } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface DropdownProps {
    trigger: React.ReactNode;
    children: React.ReactNode;
    align?: 'left' | 'right';
}

export const Dropdown: React.FC<DropdownProps> = ({ trigger, children, align = 'right' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">{trigger}</div>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className={cn(
                            "absolute z-50 mt-2 w-56 origin-top-right rounded-xl border border-gray-100 bg-white shadow-xl focus:outline-none dark:bg-gray-900 dark:border-gray-800",
                            align === 'right' ? 'right-0' : 'left-0'
                        )}
                    >
                        <div className="p-1.5" role="menu" aria-orientation="vertical">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

interface DropdownItemProps extends ButtonHTMLAttributes<HTMLButtonElement> { }
export const DropdownItem: React.FC<DropdownItemProps> = ({ className, children, ...props }) => (
    <button
        className={cn(
            "relative flex w-full cursor-pointer select-none items-center rounded-lg px-3 py-2 text-sm outline-none transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
            "dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus:bg-gray-800",
            className
        )}
        role="menuitem"
        onClick={(e) => {
            props.onClick?.(e);
        }}
        {...props}
    >
        {children}
    </button>
);
