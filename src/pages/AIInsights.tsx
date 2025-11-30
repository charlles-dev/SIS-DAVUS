import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Zap,
  Package,
  Wrench
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/UI';

// Simulated Data
const maintenanceData = [
  { month: 'Jan', failures: 4, predicted: 5 },
  { month: 'Fev', failures: 3, predicted: 4 },
  { month: 'Mar', failures: 2, predicted: 3 },
  { month: 'Abr', failures: 5, predicted: 4 },
  { month: 'Mai', failures: 3, predicted: 3 },
  { month: 'Jun', failures: 1, predicted: 2 },
];

const inventoryHealthData = [
  { name: 'Saudável', value: 70, color: '#10B981' },
  { name: 'Atenção', value: 20, color: '#F59E0B' },
  { name: 'Crítico', value: 10, color: '#EF4444' },
];

const predictions = [
  {
    id: 1,
    title: 'Manutenção Preventiva Necessária',
    description: 'O equipamento "Betoneira 320L" apresenta padrão de vibração anormal. Falha prevista em 48h.',
    type: 'warning',
    confidence: 92,
    icon: Wrench
  },
  {
    id: 2,
    title: 'Otimização de Estoque',
    description: 'Consumo de Cimento CP-II acima da média. Sugerimos antecipar compra em 3 dias.',
    type: 'info',
    confidence: 88,
    icon: Package
  },
  {
    id: 3,
    title: 'Eficiência Energética',
    description: 'Pico de consumo detectado no Setor B. Possível equipamento ligado fora de horário.',
    type: 'alert',
    confidence: 75,
    icon: Zap
  }
];

export const AIInsightsPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Brain className="h-8 w-8 text-davus-primary" />
            Insights de IA
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Análise preditiva e recomendações inteligentes para sua obra.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-davus-primary/10 text-davus-primary px-3 py-1 rounded-full text-sm font-medium">
          <Zap className="h-4 w-4" />
          <span>IA Ativa • Modelo v2.4</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Precisão do Modelo</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">94.2%</h3>
              </div>
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600 dark:text-green-400">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>+2.1% vs mês anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Economia Projetada</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">R$ 12.450</h3>
              </div>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              <span>Evitada por manutenção preventiva</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Alertas Críticos</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">3</h3>
              </div>
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <div className="mt-4 text-sm text-orange-600 dark:text-orange-400">
              <span>Requer atenção imediata</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Predictive Maintenance Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Previsão de Falhas vs Real</CardTitle>
            <CardDescription>Comparativo de falhas de equipamentos nos últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={maintenanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                  <XAxis dataKey="month" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Line type="monotone" dataKey="failures" name="Falhas Reais" stroke="#EF4444" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="predicted" name="Previsão IA" stroke="#3B82F6" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* AI Recommendations List */}
        <Card>
          <CardHeader>
            <CardTitle>Recomendações Inteligentes</CardTitle>
            <CardDescription>Ações sugeridas baseadas em padrões de dados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {predictions.map((pred) => (
                <div key={pred.id} className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <div className={`p-2 rounded-lg ${
                    pred.type === 'warning' ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400' :
                    pred.type === 'alert' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400' :
                    'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                  }`}>
                    <pred.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-gray-900 dark:text-white">{pred.title}</h4>
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                        {pred.confidence}% confiança
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{pred.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inventory Health */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Saúde do Estoque</CardTitle>
            <CardDescription>Análise de níveis e rotatividade</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={inventoryHealthData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {inventoryHealthData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              {inventoryHealthData.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-600 dark:text-gray-300">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Analysis Log */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Log de Análise em Tempo Real</CardTitle>
            <CardDescription>Processamento de dados dos últimos 60 minutos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { time: '10:42', event: 'Análise de vibração concluída - Betoneira 320L', status: 'warning' },
                { time: '10:38', event: 'Verificação de estoque - Cimento CP-II', status: 'ok' },
                { time: '10:35', event: 'Atualização de previsão de entrega - Pedido #482', status: 'ok' },
                { time: '10:30', event: 'Detecção de anomalia - Consumo Elétrico Setor B', status: 'alert' },
              ].map((log, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-gray-400">{log.time}</span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{log.event}</span>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${
                    log.status === 'warning' ? 'bg-red-500' :
                    log.status === 'alert' ? 'bg-orange-500' :
                    'bg-green-500'
                  }`} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
