import React from 'react';
import { motion } from 'framer-motion';

interface ScannerOverlayProps {
    isFound?: boolean;
}

export const ScannerOverlay: React.FC<ScannerOverlayProps> = ({ isFound = false }) => {
    return (
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center z-20">
            {/* Dark overlay with cutout is handled by parent or CSS masking, 
                but here we provide the visual guides */}

            {/* Focus Area Container */}
            <div className="relative w-72 h-72 sm:w-80 sm:h-80">

                {/* Corner Brackets */}
                <Bracket position="top-left" isFound={isFound} />
                <Bracket position="top-right" isFound={isFound} />
                <Bracket position="bottom-left" isFound={isFound} />
                <Bracket position="bottom-right" isFound={isFound} />

                {/* Scanning Laser */}
                {!isFound && (
                    <motion.div
                        className="absolute left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-davus-primary to-transparent shadow-[0_0_15px_rgba(249,115,22,0.8)]"
                        animate={{ top: ['10%', '90%', '10%'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />
                )}

                {/* Found Indicator */}
                {isFound && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        <div className="glass px-6 py-3 rounded-xl border border-green-500/30 bg-green-500/10 backdrop-blur-md shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                            <span className="text-green-500 font-mono font-bold tracking-widest text-lg flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                TARGET ACQUIRED
                            </span>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Helper Text */}
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8 text-white/80 text-center font-medium px-8 drop-shadow-md max-w-xs"
            >
                {isFound ? "Processando código..." : "Posicione o código QR dentro da área marcada"}
            </motion.p>
        </div>
    );
};

const Bracket = ({ position, isFound }: { position: string, isFound: boolean }) => {
    const color = isFound ? '#22c55e' : 'var(--davus-primary)'; // Green or Primary Orange

    const style: React.CSSProperties = {
        position: 'absolute',
        width: '40px',
        height: '40px',
        borderColor: color,
        borderWidth: '4px',
        borderRadius: '4px', // Slight rounding
        transition: 'all 0.3s ease',
        boxShadow: isFound ? '0 0 15px rgba(34, 197, 94, 0.4)' : '0 0 10px rgba(249, 115, 22, 0.3)'
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
            animate={!isFound ? { scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] } : { scale: 1, opacity: 1 }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
    );
};
