import React from 'react';
import { motion } from 'framer-motion';

export const ConstructionLoader: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[300px] bg-[#181a1c] p-8 rounded-xl">
            <div className="relative w-32 h-32 mb-8">
                <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full overflow-visible"
                >
                    {/* Hexagon Path */}
                    <motion.path
                        d="M50 10 L90 30 L90 70 L50 90 L10 70 L10 30 Z"
                        fill="none"
                        stroke="#e87350"
                        strokeWidth="2"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{
                            duration: 2,
                            ease: "easeInOut",
                            repeat: Infinity,
                            repeatType: "reverse"
                        }}
                    />

                    {/* Inner Structure Lines */}
                    <motion.path
                        d="M50 10 L50 90 M10 30 L90 70 M90 30 L10 70"
                        fill="none"
                        stroke="#e87350"
                        strokeWidth="1"
                        strokeOpacity="0.5"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{
                            duration: 2.5,
                            ease: "easeInOut",
                            repeat: Infinity,
                            repeatType: "reverse",
                            delay: 0.5
                        }}
                    />

                    {/* Glowing Core */}
                    <motion.circle
                        cx="50"
                        cy="50"
                        r="5"
                        fill="#ff5d38"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: [0, 1.5, 0], opacity: [0, 1, 0] }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                </svg>

                {/* Glow Effect */}
                <div className="absolute inset-0 bg-[#ff5d38] blur-3xl opacity-10 animate-pulse" />
            </div>

            <motion.p
                className="text-[#e87350] font-mono text-sm tracking-widest uppercase"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
            >
                Construindo o ambiente...
            </motion.p>
        </div>
    );
};
