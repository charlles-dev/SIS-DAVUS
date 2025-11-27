import React, { useEffect, useState } from 'react';
import { FileDown, FileText, Loader2, QrCode, BarChart3, Archive } from 'lucide-react';
import { 
  Button, Badge, Table, TableHeader, TableRow, TableHead, TableCell, 
  Card, CardContent, CardHeader, CardTitle 
} from '../components/UI';
import { ReportService } from '../services';
import { Report, ReportType } from '../types';

export const ReportsPage: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [generating, setGenerating] = useState<ReportType | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await ReportService.getReports();
    setReports(data);
  };

  const handleGenerate = async (type: ReportType) => {
    setGenerating(type);
    await ReportService.generateReport(type);
    await loadData();
    setGenerating(null);
  };

  const reportTypes = [
    { type: ReportType.INVENTORY, label: 'Inventário Completo', icon: Archive, desc: 'Posição atual de estoque em Excel.' },
    { type: ReportType.ASSETS, label: 'Lista de Patrimônio', icon: FileText, desc: 'Todos os ativos e seus status.' },
    { type: ReportType.MAINTENANCE_COSTS, label: 'Custos de Manutenção', icon: BarChart3, desc: 'Gastos por obra e equipamento.' },
    { type: ReportType.QR_CODES, label: 'Etiquetas (QR Code)', icon: QrCode, desc: 'PDF para impressão em lote.' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-davus-dark dark:text-white">Central de Relatórios</h2>
        <p className="text-gray-500 dark:text-gray-400">Gere e baixe relatórios do sistema.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reportTypes.map((rt) => (
          <Card key={rt.type} className="hover:border-davus-primary/50 transition-colors cursor-pointer" onClick={() => handleGenerate(rt.type)}>
             <CardContent className="p-6 flex flex-col items-center text-center gap-4">
               <div className="h-12 w-12 rounded-full bg-davus-primary/10 flex items-center justify-center text-davus-primary">
                 {generating === rt.type ? <Loader2 className="animate-spin" /> : <rt.icon size={24} />}
               </div>
               <div>
                 <h3 className="font-semibold text-davus-dark dark:text-gray-100">{rt.label}</h3>
                 <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{rt.desc}</p>
               </div>
             </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Meus Downloads Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo de Relatório</TableHead>
                <TableHead>Data Solicitação</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <tbody>
              {reports.map(rep => (
                <TableRow key={rep.id}>
                  <TableCell className="font-medium text-davus-dark dark:text-gray-100">{rep.type.replace('_', ' ')}</TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-300">{new Date(rep.requested_at).toLocaleString()}</TableCell>
                  <TableCell>
                    {rep.status === 'PROCESSING' ? (
                      <Badge variant="warning" className="animate-pulse">Processando</Badge>
                    ) : (
                      <Badge variant="success">Concluído</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline" disabled={rep.status !== 'COMPLETED'}>
                      <FileDown className="mr-2 h-3 w-3" /> Baixar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};