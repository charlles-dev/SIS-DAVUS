import React from 'react';
import { motion } from 'framer-motion';

interface DashboardIntroProps {
    children: React.ReactNode;
}

export const DashboardIntro: React.FC<DashboardIntroProps> = ({ children }) => {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            className="w-full h-full"
        >
            {/* Laser Line Intro */}
            <motion.div
                className="fixed top-0 left-0 h-[2px] bg-[#ff5d38] z-50 pointer-events-none"
                initial={{ width: 0, opacity: 1 }}
                animate={{ width: '100%', opacity: 0 }}
                transition={{ duration: 0.8, ease: "circOut", opacity: { delay: 0.6, duration: 0.2 } }}
            />

            {/* Content Reveal */}
            <motion.div
                variants={{
                    hidden: { opacity: 0, scale: 0.98 },
                    visible: {
                        opacity: 1,
                        scale: 1,
                        transition: {
                            delay: 0.4,
                            duration: 0.5,
                            ease: "easeOut",
                            staggerChildren: 0.1
                        }
                    }
                }}
                className="w-full h-full"
            >
                {children}
            </motion.div>
        </motion.div>
    );
};
