import React from 'react';
import { motion } from 'framer-motion';

interface TableSkeletonProps {
    rows?: number;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({ rows = 5 }) => {
    return (
        <div className="w-full overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
            <table className="w-full">
                <tbody>
                    {Array.from({ length: rows }).map((_, i) => (
                        <tr key={i} className="border-b border-gray-100 dark:border-gray-800/50 last:border-0">
                            <td className="p-4">
                                <div className="relative overflow-hidden rounded bg-gray-200 dark:bg-[#2b2b2b] h-4 w-[60%]">
                                    <Shimmer />
                                </div>
                            </td>
                            <td className="p-4">
                                <div className="relative overflow-hidden rounded bg-gray-200 dark:bg-[#2b2b2b] h-4 w-[80%]">
                                    <Shimmer />
                                </div>
                            </td>
                            <td className="p-4">
                                <div className="relative overflow-hidden rounded bg-gray-200 dark:bg-[#2b2b2b] h-4 w-[40%]">
                                    <Shimmer />
                                </div>
                            </td>
                            <td className="p-4">
                                <div className="relative overflow-hidden rounded bg-gray-200 dark:bg-[#2b2b2b] h-4 w-[50%]">
                                    <Shimmer />
                                </div>
                            </td>
                            <td className="p-4">
                                <div className="relative overflow-hidden rounded bg-gray-200 dark:bg-[#2b2b2b] h-4 w-[30%]">
                                    <Shimmer />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const Shimmer = () => {
    return (
        <motion.div
            className="absolute inset-0 -translate-x-full"
            style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)'
            }}
            animate={{
                translateX: ['-100%', '100%']
            }}
            transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: "linear"
            }}
        />
    );
};
