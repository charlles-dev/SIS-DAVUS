import React from 'react';
import { cn } from '@/lib/utils';

export const DavusLogo: React.FC<{ className?: string, hideSubtitle?: boolean }> = ({ className, hideSubtitle }) => {
    return (
        <img
            src="/logo.png"
            alt="Davus Engenharia"
            loading="lazy"
            decoding="async"
            className={cn("object-contain", className)}
        />
    );
};
