import React, { useEffect } from 'react';
import { motion, Variants } from 'framer-motion';

interface WelcomeAnimationProps {
    onComplete: () => void;
}

const WelcomeAnimation: React.FC<WelcomeAnimationProps> = ({ onComplete }) => {

    // Orchestration:
    // 0s - 3s: Draw lines (Blueprint)
    // 3s - 5s: Fade in fills (Construction)
    // 5s - 7s: Show Text (Branding)
    // 7s - 8s: Hold
    // 8s: Trigger onComplete -> Exit animation starts

    const containerVariants: Variants = {
        hidden: { opacity: 1 },
        visible: {
            opacity: 1,
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.5
            }
        },
        exit: {
            y: "-100vh",
            transition: {
                duration: 1.2,
                ease: [0.22, 1, 0.36, 1], // Cubic bezier for smooth "lift off"
                when: "afterChildren"
            }
        }
    };

    const pathVariants: Variants = {
        hidden: { pathLength: 0, opacity: 0 },
        visible: {
            pathLength: 1,
            opacity: 1,
            transition: {
                duration: 3,
                ease: "easeInOut"
            }
        }
    };

    const fillVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delay: 2.5, // Start fading in before lines are fully done for smoothness
                duration: 2,
                ease: "easeOut"
            }
        }
    };

    const textVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                delay: 4.5, // Wait for construction to settle
                duration: 1,
                ease: "easeOut"
            }
        }
    };

    const pulseVariants: Variants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: [0, 0.4, 0],
            scale: [0.9, 1.2, 1.4],
            transition: {
                delay: 3,
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    useEffect(() => {
        console.log("WelcomeAnimation v2 mounted");
        // The total duration of the entrance sequence is roughly 5.5s (4.5s delay + 1s duration).
        // We hold for a bit longer to let the user read the text.
        const totalDuration = 8000;

        const timer = setTimeout(() => {
            console.log("WelcomeAnimation sequence complete. Triggering exit.");
            onComplete();
        }, totalDuration);

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#181a1c] overflow-hidden"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={containerVariants}
        >
            <div className="relative w-64 h-64 md:w-96 md:h-96">
                <svg
                    viewBox="0 0 200 200"
                    className="w-full h-full drop-shadow-[0_0_15px_rgba(220,119,89,0.3)]"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <linearGradient id="structureGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#e87350" />
                            <stop offset="100%" stopColor="#ff5d38" />
                        </linearGradient>
                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>

                    {/* Group for the main structure */}
                    <g transform="translate(100, 100) scale(0.8)">

                        {/* Filled shapes - appear after lines */}
                        <motion.g variants={fillVariants}>
                            {/* Top Face */}
                            <polygon points="0,-60 52,-30 0,0 -52,-30" fill="url(#structureGradient)" opacity="0.9" />
                            {/* Right Face */}
                            <polygon points="52,-30 52,30 0,60 0,0" fill="url(#structureGradient)" opacity="0.7" />
                            {/* Left Face */}
                            <polygon points="-52,-30 0,0 0,60 -52,30" fill="url(#structureGradient)" opacity="0.5" />

                            {/* Inner Cube / Detail for "Impossible" feel */}
                            <polygon points="0,-15 15,-7.5 0,0 -15,-7.5" fill="#fff" fillOpacity="0.2" />
                        </motion.g>

                        {/* Wireframe Lines */}
                        <motion.g
                            stroke="#dc7759"
                            strokeWidth="1.5"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            {/* Outer Hexagon outline */}
                            <motion.path variants={pathVariants} d="M0,-60 L52,-30 L52,30 L0,60 L-52,30 L-52,-30 Z" />

                            {/* Y Shape inside to form cube */}
                            <motion.path variants={pathVariants} d="M0,0 L0,60 M0,0 L-52,-30 M0,0 L52,-30" />

                            {/* Architectural details / inner lines */}
                            <motion.path variants={pathVariants} d="M-26,-45 L-26,-15 L0,0" />
                            <motion.path variants={pathVariants} d="M26,-45 L26,-15 L0,0" />
                            <motion.path variants={pathVariants} d="M0,30 L26,15" />
                            <motion.path variants={pathVariants} d="M0,30 L-26,15" />

                            {/* Floating elements to give "Blueprint" feel */}
                            <motion.circle cx="-60" cy="-40" r="2" fill="#dc7759" variants={pathVariants} />
                            <motion.circle cx="60" cy="40" r="2" fill="#dc7759" variants={pathVariants} />

                            <motion.path
                                variants={pathVariants}
                                d="M-70,50 L70,50"
                                strokeDasharray="4 4"
                                strokeOpacity="0.5"
                            />
                        </motion.g>
                    </g>
                </svg>

                {/* Pulse Effect Overlay */}
                <motion.div
                    variants={pulseVariants}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-davus-fillStart blur-3xl pointer-events-none"
                />
            </div>

            <motion.div
                className="mt-8 text-center z-10"
                variants={textVariants}
            >
                <h1 className="font-display font-bold text-5xl tracking-[0.2em] text-white mb-2">
                    DAVUS
                </h1>
                <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-davus-line to-transparent opacity-50" />
                <p className="font-sans text-davus-line text-sm tracking-widest mt-2 uppercase opacity-70">
                    Engenharia & Construção
                </p>
            </motion.div>
        </motion.div>
    );
};

export { WelcomeAnimation };