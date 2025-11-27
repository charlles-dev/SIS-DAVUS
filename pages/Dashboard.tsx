
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AlertTriangle, DollarSign, Wrench, MapPin, Settings, Layout } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Button, Dialog, Checkbox } from '../components/UI';
import { DashboardService } from '../services';
import { DashboardSummary } from '../types';

const StatCard = ({ title, value, icon: Icon, color, description }: { title: string; value: string | number; icon: any; color: string; description?: string }) => (
  <Card>
    <CardContent className="p-4 md:p-6">
      <div className="flex items-center justify-between space-y-0 pb-2">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <Icon className={`h-4 w-4 ${color}`} />
      </div>
      <div className="flex flex-col mt-2">
        <div className="text-2xl font-bold text-davus-dark dark:text-gray-100">{value}</div>
        {description && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{description}</p>}
      </div>
    </CardContent>
  </Card>
);

interface WidgetConfig {
  id: string;
  label: string;
  visible: boolean;
}

const DEFAULT_WIDGETS: WidgetConfig[] = [
  { id: 'lowStock', label: 'Estoque Baixo', visible: true },
  { id: 'maintenance', label: 'Em Manutenção', visible: true },
  { id: 'totalValue', label: 'Patrimônio Total', visible: true },
  { id: 'monthlyCost', label: 'Custo Mensal', visible: true },
  { id: 'locationChart', label: 'Gráfico por Obra', visible: true },
  { id: 'recentAlerts', label: 'Alertas Recentes', visible: true },
];

export const DashboardPage: React.FC = () => {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [widgets, setWidgets] = useState<WidgetConfig[]>(() => {
    const saved = localStorage.getItem('dashboard_widgets');
    return saved ? JSON.parse(saved) : DEFAULT_WIDGETS;
  });
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);

  useEffect(() => {
    DashboardService.getSummary().then(setData);
  }, []);

  useEffect(() => {
    localStorage.setItem('dashboard_widgets', JSON.stringify(widgets));
  }, [widgets]);

  const toggleWidget = (id: string) => {
    setWidgets(prev => prev.map(w => w.id === id ? { ...w, visible: !w.visible } : w));
  };

  const isVisible = (id: string) => widgets.find(w => w.id === id)?.visible;

  if (!data) return <div className="p-8 text-center text-gray-500 dark:text-gray-400">Carregando indicadores...</div>;

  const chartData = data.location_distribution;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-davus-dark dark:text-white">Dashboard</h2>
          <p className="text-gray-500 dark:text-gray-400">Visão geral operacional de hoje.</p>
        </div>
        <Button variant="outline" onClick={() => setIsCustomizeOpen(true)}>
          <Layout className="mr-2 h-4 w-4" />
          Personalizar
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isVisible('lowStock') && (
          <StatCard
            title="Estoque Baixo"
            value={data.alerts.low_stock_count}
            icon={AlertTriangle}
            color={data.alerts.low_stock_count > 0 ? "text-red-500" : "text-green-500"}
            description="Itens abaixo do mínimo"
          />
        )}
        {isVisible('maintenance') && (
          <StatCard
            title="Em Manutenção"
            value={data.alerts.maintenance_count}
            icon={Wrench}
            color="text-orange-500"
            description="Ordens abertas"
          />
        )}
        {isVisible('totalValue') && (
          <StatCard
            title="Patrimônio Total"
            value={data.financial.total_asset_value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            icon={DollarSign}
            color="text-emerald-600 dark:text-emerald-400"
            description="Valor acumulado de ativos"
          />
        )}
        {isVisible('monthlyCost') && (
          <StatCard
            title="Custo Mensal"
            value={data.financial.maintenance_cost_month.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            icon={DollarSign}
            color="text-davus-primary"
            description="Manutenção (Mês atual)"
          />
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {isVisible('locationChart') && (
          <Card className={`col-span-4 ${!isVisible('recentAlerts') ? 'lg:col-span-7' : ''}`}>
            <CardHeader>
              <CardTitle>Ativos por Obra</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" strokeOpacity={0.2} />
                    <XAxis
                      dataKey="location"
                      stroke="#9ca3af"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#9ca3af"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value}`}
                    />
                    <Tooltip
                      cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                      contentStyle={{
                        borderRadius: '8px',
                        border: 'none',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                        backgroundColor: '#1f2937', // dark-gray-800
                        color: '#f3f4f6'
                      }}
                      itemStyle={{ color: '#f3f4f6' }}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#dc7759' : '#9ca3af'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {isVisible('recentAlerts') && (
          <Card className={`col-span-3 ${!isVisible('locationChart') ? 'lg:col-span-7' : ''}`}>
            <CardHeader>
              <CardTitle>Alertas Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="h-9 w-9 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none text-davus-dark dark:text-gray-200">Cimento CP II</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Estoque atual: 450 SC (Mín: 500)</p>
                  </div>
                  <div className="ml-auto font-medium text-red-600 dark:text-red-400 text-xs bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded">Crítico</div>
                </div>
                <div className="flex items-center">
                  <div className="h-9 w-9 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                    <Wrench className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none text-davus-dark dark:text-gray-200">Martelete Rompedor</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Manutenção agendada vencida</p>
                  </div>
                  <div className="ml-auto font-medium text-orange-600 dark:text-orange-400 text-xs bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded">Atraso</div>
                </div>
                <div className="flex items-center">
                  <div className="h-9 w-9 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none text-davus-dark dark:text-gray-200">Betoneira 400L</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Transferência para BAHARI</p>
                  </div>
                  <div className="ml-auto font-medium text-blue-600 dark:text-blue-400 text-xs bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">Novo</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog
        isOpen={isCustomizeOpen}
        onClose={() => setIsCustomizeOpen(false)}
        title="Personalizar Dashboard"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Selecione os widgets que deseja visualizar no seu dashboard.</p>
          <div className="grid grid-cols-1 gap-3">
            {widgets.map(widget => (
              <Checkbox
                key={widget.id}
                label={widget.label}
                checked={widget.visible}
                onChange={() => toggleWidget(widget.id)}
              />
            ))}
          </div>
          <div className="flex justify-end pt-4">
            <Button onClick={() => setIsCustomizeOpen(false)}>Concluir</Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
