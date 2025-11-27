import React, { useEffect, useState, useRef } from 'react';
import { useTour } from '../../context/TourContext';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';

export const TourOverlay: React.FC = () => {
    const { isActive, currentStep, nextStep, prevStep, skipTour, currentStepIndex, totalSteps } = useTour();
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (isActive) {
            const updateRect = () => {
                const element = document.querySelector(`[data-tour="${currentStep.target}"]`);
                if (element) {
                    setTargetRect(element.getBoundingClientRect());
                    setIsReady(true);
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                } else {
                    setIsReady(false);
                }
            };

            // Initial check
            updateRect();

            // Check again after a short delay to allow for animations/rendering
            const timer = setTimeout(updateRect, 300);

            // Handle resize
            window.addEventListener('resize', updateRect);

            return () => {
                clearTimeout(timer);
                window.removeEventListener('resize', updateRect);
            };
        }
    }, [isActive, currentStep]);

    if (!isActive || !isReady || !targetRect) return null;

    // Calculate tooltip position
    const getTooltipStyle = () => {
        const gap = 12;
        const tooltipWidth = 320;
        // This is an estimation, actual height depends on content. 
        // For robust positioning we might need a ref on the tooltip itself, but let's try simple logic first.

        let top = 0;
        let left = 0;

        switch (currentStep.position) {
            case 'bottom':
                top = targetRect.bottom + gap;
                left = targetRect.left + (targetRect.width / 2) - (tooltipWidth / 2);
                break;
            case 'top':
                top = targetRect.top - gap - 150; // approximate height
                left = targetRect.left + (targetRect.width / 2) - (tooltipWidth / 2);
                break;
            case 'right':
                top = targetRect.top + (targetRect.height / 2) - 75;
                left = targetRect.right + gap;
                break;
            case 'left':
                top = targetRect.top + (targetRect.height / 2) - 75;
                left = targetRect.left - gap - tooltipWidth;
                break;
            case 'center':
            default:
                top = window.innerHeight / 2 - 100;
                left = window.innerWidth / 2 - 160;
                break;
        }

        // Boundary checks (basic)
        if (left < 10) left = 10;
        if (left + tooltipWidth > window.innerWidth - 10) left = window.innerWidth - tooltipWidth - 10;
        if (top < 10) top = 10;

        return { top, left, width: tooltipWidth };
    };

    const tooltipStyle = getTooltipStyle();

    return (
        <div className="fixed inset-0 z-[100] pointer-events-none">
            {/* Backdrop with hole */}
            <div className="absolute inset-0 bg-black/50 transition-all duration-500"
                style={{
                    clipPath: `polygon(
               0% 0%, 0% 100%, 
               ${targetRect.left}px 100%, 
               ${targetRect.left}px ${targetRect.top}px, 
               ${targetRect.right}px ${targetRect.top}px, 
               ${targetRect.right}px ${targetRect.bottom}px, 
               ${targetRect.left}px ${targetRect.bottom}px, 
               ${targetRect.left}px 100%, 
               100% 100%, 100% 0%
             )`
                }}
            />

            {/* Highlight Border */}
            <div
                className="absolute border-2 border-davus-primary rounded-lg transition-all duration-300 ease-out shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]"
                style={{
                    top: targetRect.top - 4,
                    left: targetRect.left - 4,
                    width: targetRect.width + 8,
                    height: targetRect.height + 8,
                }}
            />

            {/* Tooltip */}
            <div
                className="absolute bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-5 pointer-events-auto transition-all duration-300 animate-fade-in-up border border-gray-200 dark:border-gray-700"
                style={tooltipStyle}
            >
                <button
                    onClick={skipTour}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                    <X size={16} />
                </button>

                <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{currentStep.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                        {currentStep.content}
                    </p>
                </div>

                <div className="flex items-center justify-between mt-4">
                    <div className="flex gap-1">
                        {Array.from({ length: totalSteps }).map((_, i) => (
                            <div
                                key={i}
                                className={`h-1.5 rounded-full transition-all duration-300 ${i === currentStepIndex ? 'w-6 bg-davus-primary' : 'w-1.5 bg-gray-200 dark:bg-gray-700'}`}
                            />
                        ))}
                    </div>

                    <div className="flex gap-2">
                        {currentStepIndex > 0 && (
                            <button
                                onClick={prevStep}
                                className="px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                Voltar
                            </button>
                        )}
                        <button
                            onClick={nextStep}
                            className="flex items-center gap-1 px-4 py-1.5 text-sm font-medium bg-davus-primary text-white hover:bg-davus-secondary rounded-lg transition-colors shadow-lg shadow-davus-primary/20"
                        >
                            {currentStepIndex === totalSteps - 1 ? 'Concluir' : 'Próximo'}
                            {currentStepIndex < totalSteps - 1 && <ChevronRight size={14} />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
