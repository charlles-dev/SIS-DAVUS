import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface TourStep {
    target: string; // data-tour attribute value
    title: string;
    content: string;
    position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

const TOUR_STEPS: TourStep[] = [
    {
        target: 'sidebar',
        title: 'Navegação Principal',
        content: 'Aqui você encontra acesso rápido a todos os módulos do sistema, como Estoque, Patrimônio e Relatórios.',
        position: 'right'
    },
    {
        target: 'search-btn',
        title: 'Busca Global',
        content: 'Pressione Ctrl+K ou clique aqui para buscar rapidamente por qualquer coisa no sistema.',
        position: 'bottom'
    },
    {
        target: 'theme-toggle',
        title: 'Modo Escuro',
        content: 'Prefere trabalhar à noite? Alterne entre os modos claro e escuro aqui.',
        position: 'bottom'
    },
    {
        target: 'notifications',
        title: 'Notificações',
        content: 'Fique por dentro das últimas atualizações e alertas importantes.',
        position: 'bottom'
    },
    {
        target: 'user-profile',
        title: 'Seu Perfil',
        content: 'Gerencie sua conta e faça logout aqui.',
        position: 'top'
    }
];

interface TourContextType {
    isActive: boolean;
    currentStepIndex: number;
    currentStep: TourStep;
    startTour: () => void;
    endTour: () => void;
    nextStep: () => void;
    prevStep: () => void;
    skipTour: () => void;
    totalSteps: number;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export const TourProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isActive, setIsActive] = useState(false);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    useEffect(() => {
        const hasSeenTour = localStorage.getItem('hasSeenTour');
        if (!hasSeenTour) {
            // Small delay to ensure UI is ready
            setTimeout(() => {
                setIsActive(true);
            }, 1000);
        }
    }, []);

    const startTour = useCallback(() => {
        setIsActive(true);
        setCurrentStepIndex(0);
    }, []);

    const endTour = useCallback(() => {
        setIsActive(false);
        localStorage.setItem('hasSeenTour', 'true');
    }, []);

    const skipTour = useCallback(() => {
        endTour();
    }, [endTour]);

    const nextStep = useCallback(() => {
        if (currentStepIndex < TOUR_STEPS.length - 1) {
            setCurrentStepIndex((prev) => prev + 1);
        } else {
            endTour();
        }
    }, [currentStepIndex, endTour]);

    const prevStep = useCallback(() => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex((prev) => prev - 1);
        }
    }, [currentStepIndex]);

    return (
        <TourContext.Provider
            value={{
                isActive,
                currentStepIndex,
                currentStep: TOUR_STEPS[currentStepIndex],
                startTour,
                endTour,
                nextStep,
                prevStep,
                skipTour,
                totalSteps: TOUR_STEPS.length
            }}
        >
            {children}
        </TourContext.Provider>
    );
};

export const useTour = () => {
    const context = useContext(TourContext);
    if (context === undefined) {
        throw new Error('useTour must be used within a TourProvider');
    }
    return context;
};
