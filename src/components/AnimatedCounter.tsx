import React, { useEffect, useRef } from 'react';
import { useInView, useMotionValue, useSpring } from 'framer-motion';

interface AnimatedCounterProps {
    value: number;
    format?: 'currency' | 'decimal' | 'integer';
    className?: string;
    color?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
    value,
    format = 'integer',
    className = '',
    color
}) => {
    const ref = useRef<HTMLSpanElement>(null);
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, {
        damping: 50,
        stiffness: 100,
    });
    const isInView = useInView(ref, { once: true, margin: "-10px" });

    useEffect(() => {
        if (isInView) {
            motionValue.set(value);
        }
    }, [motionValue, value, isInView]);

    useEffect(() => {
        springValue.on("change", (latest) => {
            if (ref.current) {
                let formatted = '';
                if (format === 'currency') {
                    formatted = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(latest);
                } else if (format === 'decimal') {
                    formatted = latest.toFixed(1);
                } else {
                    formatted = Math.round(latest).toString();
                }
                ref.current.textContent = formatted;
            }
        });
    }, [springValue, format]);

    // Determine color based on value if not provided
    const textColor = color || (value < 0 ? 'text-red-500' : 'text-inherit');

    return (
        <span
            ref={ref}
            className={`font-variant-numeric: tabular-nums ${textColor} ${className}`}
        />
    );
};
