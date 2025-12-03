import React from 'react';
import { cn } from '@/lib/utils';

export const Table: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <div className="relative w-full overflow-auto rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
        <table className={cn("w-full caption-bottom text-sm text-gray-700 dark:text-gray-300", className)}>{children}</table>
    </div>
);

export const TableHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <thead className="[&_tr]:border-b bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm dark:border-gray-700 sticky top-0 z-10">{children}</thead>
);

export const TableRow: React.FC<React.HTMLAttributes<HTMLTableRowElement>> = ({ children, className, ...props }) => (
    <tr className={cn("border-b transition-colors hover:bg-gray-50/50 data-[state=selected]:bg-gray-100 dark:border-gray-800 dark:hover:bg-gray-800/50", className)} {...props}>{children}</tr>
);

export const TableHead: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <th className={cn("h-12 px-4 text-left align-middle font-semibold text-gray-600 dark:text-gray-400 [&:has([role=checkbox])]:pr-0", className)}>{children}</th>
);

export const TableCell: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({ children, className, ...props }) => (
    <td className={cn("px-4 py-3 align-middle [&:has([role=checkbox])]:pr-0", className)} {...props}>{children}</td>
);
