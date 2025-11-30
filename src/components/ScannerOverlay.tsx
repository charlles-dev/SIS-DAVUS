import React from 'react';
import { motion } from 'framer-motion';

interface ScannerOverlayProps {
    isFound?: boolean;
}

export const ScannerOverlay: React.FC<ScannerOverlayProps> = ({ isFound = false }) => {
    return (
        <div className="relative w-full h-full min-h-[400px] bg-black/60 flex items-center justify-center overflow-hidden">
            {/* Focus Area */}
            <div className="relative w-64 h-64">
                {/* Brackets */}
                <Bracket position="top-left" isFound={isFound} />
                <Bracket position="top-right" isFound={isFound} />
                <Bracket position="bottom-left" isFound={isFound} />
                <Bracket position="bottom-right" isFound={isFound} />

                {/* Laser */}
                {!isFound && (
                    <motion.div
                        className="absolute left-0 right-0 h-0.5 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]"
                        animate={{ top: ['0%', '100%', '0%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                )}

                {/* Found Indicator */}
                {isFound && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 border-2 border-green-500/50 bg-green-500/10 flex items-center justify-center"
                    >
                        <span className="text-green-500 font-mono font-bold tracking-widest text-xl">
                            TARGET ACQUIRED
                        </span>
                    </motion.div>
                )}
            </div>

            {/* Grid Overlay */}
            <div
                className="absolute inset-0 pointer-events-none opacity-10"
                style={{
                    backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}
            />
        </div>
    );
};

const Bracket = ({ position, isFound }: { position: string, isFound: boolean }) => {
    const color = isFound ? '#22c55e' : '#ff5d38';
    const style: React.CSSProperties = {
        position: 'absolute',
        width: '20px',
        height: '20px',
        borderColor: color,
        borderWidth: '4px',
        transition: 'all 0.3s ease'
    };

    if (position.includes('top')) style.top = 0;
    if (position.includes('bottom')) style.bottom = 0;
    if (position.includes('left')) {
        style.left = 0;
        style.borderLeftStyle = 'solid';
    } else {
        style.borderLeftStyle = 'none';
    }
    if (position.includes('right')) {
        style.right = 0;
        style.borderRightStyle = 'solid';
    } else {
        style.borderRightStyle = 'none';
    }
    if (position.includes('top')) style.borderTopStyle = 'solid';
    else style.borderTopStyle = 'none';
    if (position.includes('bottom')) style.borderBottomStyle = 'solid';
    else style.borderBottomStyle = 'none';

    return (
        <motion.div
            style={style}
            animate={!isFound ? { scale: [1, 1.1, 1] } : { scale: 1 }}
            transition={{ duration: 1.5, repeat: Infinity }}
        />
    );
};
