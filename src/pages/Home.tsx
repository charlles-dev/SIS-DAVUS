import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    PlusCircle,
    Search,
    QrCode,
    AlertTriangle,
    Wrench,
    ArrowRight,
    Package,
    History as HistoryIcon
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '../components/UI';
import { useAuthStore } from '../store';
import { DashboardService } from '@/api/services';
import { DashboardSummary } from '@/types/types';
import { QRScanner } from '../components/QRScanner';

export const HomePage: React.FC = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [summary, setSummary] = useState<DashboardSummary | null>(null);
    const [isScannerOpen, setIsScannerOpen] = useState(false);

    useEffect(() => {
        DashboardService.getSummary().then(setSummary);
    }, []);

    const handleScan = (code: string) => {
        setIsScannerOpen(false);
        // Navigate to asset details or search
        // Assuming the code is the asset ID or Tag
        navigate(`/app/assets?search=${code}`);
    };

    const quickActions = [
        { label: 'Nova Cautela', icon: PlusCircle, path: '/app/checkouts', color: 'text-blue-500' },
        { label: 'Buscar Ativo', icon: Search, path: '/app/assets', color: 'text-purple-500' },
        { label: 'Escanear QR', icon: QrCode, action: () => setIsScannerOpen(true), color: 'text-davus-primary' },
        { label: 'Novo Item', icon: Package, path: '/app/inventory', color: 'text-green-500' },
    ];

    // ...

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-20 md:pb-0"> {/* Added padding bottom for mobile nav */}
            {isScannerOpen && (
                <QRScanner
                    onScan={handleScan}
                    onClose={() => setIsScannerOpen(false)}
                />
            )}

            {/* Greeting Section */}
            {/* ... */}

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4"> {/* Adjusted gap and grid for mobile */}
                {quickActions.map((action) => (
                    <Card
                        key={action.label}
                        className="hover:border-davus-primary/50 cursor-pointer transition-all hover:-translate-y-1 active:scale-95"
                        onClick={() => action.action ? action.action() : navigate(action.path!)}
                    >
                        <CardContent className="p-4 md:p-6 flex flex-col items-center justify-center text-center space-y-2 md:space-y-3">
                            <div className={`p-2 md:p-3 rounded-full bg-gray-50 dark:bg-gray-800 ${action.color}`}>
                                <action.icon size={20} className="md:w-6 md:h-6" /> {/* Responsive icon size */}
                            </div>
                            <span className="font-medium text-xs md:text-sm text-gray-700 dark:text-gray-300">{action.label}</span>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Status Overview */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                            Alertas Críticos
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {summary ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Estoque Baixo</span>
                                    <Badge variant={summary.alerts.low_stock_count > 0 ? 'destructive' : 'success'}>
                                        {summary.alerts.low_stock_count} itens
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Manutenção Atrasada</span>
                                    <Badge variant={summary.alerts.maintenance_count > 0 ? 'warning' : 'success'}>
                                        {summary.alerts.maintenance_count} ordens
                                    </Badge>
                                </div>
                            </div>
                        ) : (
                            <div className="animate-pulse space-y-3">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                            <HistoryIcon className="h-4 w-4 text-blue-500" />
                            Resumo do Dia
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {summary ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Valor em Manutenção</span>
                                    <span className="font-medium text-davus-dark dark:text-white">
                                        {summary.financial.maintenance_cost_month.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Total de Ativos</span>
                                    <span className="font-medium text-davus-dark dark:text-white">
                                        {summary.financial.total_asset_value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="animate-pulse space-y-3">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
