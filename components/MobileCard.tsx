import React from 'react';
import { Card, CardContent, Badge, Button } from './UI';
import { Edit, Trash2, ArrowRightLeft, Eye } from 'lucide-react';

interface MobileCardProps {
    title: string;
    subtitle?: string;
    status?: string;
    statusVariant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'success' | 'warning' | 'info';
    image?: string;
    details: { label: string; value: string | number }[];
    actions?: React.ReactNode;
    onClick?: () => void;
}

export const MobileCard: React.FC<MobileCardProps> = ({
    title,
    subtitle,
    status,
    statusVariant = 'default',
    image,
    details,
    actions,
    onClick
}) => {
    return (
        <Card className="mb-4 md:hidden active:scale-[0.99] transition-transform" onClick={onClick}>
            <CardContent className="p-4">
                <div className="flex gap-4">
                    {image && (
                        <div className="h-16 w-16 flex-shrink-0 rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden">
                            <img src={image} alt={title} className="h-full w-full object-cover" />
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white truncate pr-2">{title}</h3>
                            {status && <Badge variant={statusVariant} className="flex-shrink-0">{status}</Badge>}
                        </div>
                        {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{subtitle}</p>}

                        <div className="space-y-1">
                            {details.map((detail, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                    <span className="text-gray-500 dark:text-gray-400">{detail.label}:</span>
                                    <span className="font-medium text-gray-900 dark:text-gray-200">{detail.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {actions && (
                    <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-2">
                        {actions}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
