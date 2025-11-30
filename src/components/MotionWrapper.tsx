import React from 'react';
import { motion } from 'framer-motion';

interface MotionWrapperProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'fade' | 'slide' | 'scale';
}

export const MotionWrapper: React.FC<MotionWrapperProps> = ({
    children,
    className,
    variant = 'fade'
}) => {
    const variants = {
        fade: {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
        },
        slide: {
            initial: { opacity: 0, x: 20 },
            animate: { opacity: 1, x: 0 },
            exit: { opacity: 0, x: -20 },
        },
        scale: {
            initial: { opacity: 0, scale: 0.95 },
            animate: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 0.95 },
        }
    };

    return (
        <motion.div
            initial={variants[variant].initial}
            animate={variants[variant].animate}
            exit={variants[variant].exit}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <MotionWrapper variant="fade" className="w-full h-full">
            {children}
        </MotionWrapper>
    );
};
