import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/lib/utils';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange, className }) => {
    if (totalPages <= 1) return null;

    return (
        <div className={cn("flex items-center justify-end space-x-2 py-4", className)}>
            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="h-9 px-3"
            >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Anterior
            </Button>
            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium px-2">
                Página <span className="text-davus-primary font-bold">{currentPage}</span> de {totalPages}
            </div>
            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="h-9 px-3"
            >
                Próxima
                <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
        </div>
    );
};
