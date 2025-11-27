import React, { useEffect, useState } from 'react';
import { 
  ShieldCheck, Upload, FileSpreadsheet, Search 
} from 'lucide-react';
import { 
  Button, Input, Table, TableHeader, TableRow, TableHead, TableCell, 
  Card, CardContent, CardHeader, CardTitle, Select 
} from '../components/UI';
import { AdminService } from '../services';
import { AuditLog } from '../types';

export const AdminToolsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'audit' | 'import'>('audit');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-davus-dark dark:text-white">Ferramentas Administrativas</h2>
        <p className="text-gray-500 dark:text-gray-400">Auditoria e gestão de dados em massa.</p>
      </div>

      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-800">
        <button 
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'audit' ? 'border-davus-primary text-davus-primary' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
        >
          <ShieldCheck className="inline-block w-4 h-4 mr-2" />
          Logs de Auditoria
        </button>
        <button 
          onClick={() => setActiveTab('import')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'import' ? 'border-davus-primary text-davus-primary' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
        >
          <Upload className="inline-block w-4 h-4 mr-2" />
          Importação de Dados
        </button>
      </div>

      {activeTab === 'audit' ? <AuditTab /> : <ImportTab />}
    </div>
  );
};

const AuditTab: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    AdminService.getAuditLogs().then(setLogs);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Ações</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data/Hora</TableHead>
              <TableHead>Usuário</TableHead>
              <TableHead>Ação</TableHead>
              <TableHead>Recurso</TableHead>
              <TableHead>Detalhes</TableHead>
            </TableRow>
          </TableHeader>
          <tbody>
            {logs.map(log => (
              <TableRow key={log.id}>
                <TableCell className="text-xs text-gray-500 dark:text-gray-400">{new Date(log.timestamp).toLocaleString()}</TableCell>
                <TableCell className="font-medium text-davus-dark dark:text-gray-100">{log.user}</TableCell>
                <TableCell>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    log.action === 'CREATE' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
                    log.action === 'DELETE' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 
                    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  }`}>{log.action}</span>
                </TableCell>
                <TableCell className="text-davus-dark dark:text-gray-200">{log.resource}</TableCell>
                <TableCell className="text-sm text-gray-600 dark:text-gray-400">{log.details}</TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </CardContent>
    </Card>
  );
};

const ImportTab: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [type, setType] = useState('INVENTORY');
  const [status, setStatus] = useState<'IDLE' | 'UPLOADING' | 'DONE'>('IDLE');
  const [result, setResult] = useState<{success: number, errors: number} | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setStatus('UPLOADING');
    // @ts-ignore - Mock allows string match
    const res = await AdminService.importData(type, file);
    setResult(res);
    setStatus('DONE');
  };

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Importação em Massa (CSV/Excel)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-davus-dark dark:text-gray-200">Tipo de Dados</label>
          <Select 
            value={type}
            onChange={(e) => setType(e.target.value)}
            options={[
              { value: 'INVENTORY', label: 'Insumos / Produtos' },
              { value: 'ASSETS', label: 'Patrimônio / Ativos' }
            ]}
          />
        </div>

        <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
          <FileSpreadsheet className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <input type="file" onChange={handleFileChange} accept=".csv, .xlsx" className="hidden" id="file-upload" />
          <label htmlFor="file-upload" className="cursor-pointer">
            <span className="text-davus-primary font-medium hover:underline">Clique para selecionar</span> ou arraste o arquivo
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{file ? file.name : 'Nenhum arquivo selecionado'}</p>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleUpload} disabled={!file || status === 'UPLOADING'} isLoading={status === 'UPLOADING'}>
            Iniciar Importação
          </Button>
        </div>

        {status === 'DONE' && result && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-4">
             <h4 className="font-bold text-green-800 dark:text-green-400 mb-2">Processamento Concluído</h4>
             <ul className="list-disc pl-5 text-sm text-green-700 dark:text-green-300">
               <li>Registros criados: {result.success}</li>
               <li>Erros encontrados: {result.errors}</li>
             </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};