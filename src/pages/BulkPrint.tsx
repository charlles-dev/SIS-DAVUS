import React, { useEffect, useState } from 'react';
import { Printer, Filter } from 'lucide-react';
import {
  Button, Table, TableHeader, TableRow, TableHead, TableCell,
  Card, CardContent, Checkbox
} from '../components/UI';
import { AssetService, ReportService } from '@/api/services';
import { Asset, ReportType } from '@/types/types';
import { toast } from 'sonner';

export const BulkPrintPage: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    AssetService.getAssets().then(setAssets);
  }, []);

  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const toggleAll = () => {
    if (selectedIds.size === assets.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(assets.map(a => a.id)));
  };

  const handlePrint = async () => {
    setLoading(true);
    await ReportService.generateReport(ReportType.QR_CODES);
    setLoading(false);
    toast.info('Solicitação enviada! Acesse a Central de Relatórios para baixar o PDF.');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-davus-dark dark:text-white">Impressão de Etiquetas</h2>
          <p className="text-gray-500 dark:text-gray-400">Selecione ativos para gerar etiquetas QR Code em lote.</p>
        </div>
        <div className="flex gap-2 items-center">
          <span className="text-sm font-medium mr-2 text-davus-dark dark:text-gray-200">{selectedIds.size} selecionados</span>
          <Button onClick={handlePrint} disabled={selectedIds.size === 0} isLoading={loading}>
            <Printer className="mr-2 h-4 w-4" /> Gerar PDF
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    label=""
                    checked={selectedIds.size === assets.length && assets.length > 0}
                    onChange={toggleAll}
                  />
                </TableHead>
                <TableHead>Tag</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Local</TableHead>
              </TableRow>
            </TableHeader>
            <tbody>
              {assets.map(asset => (
                <TableRow key={asset.id} className={selectedIds.has(asset.id) ? 'bg-davus-primary/5 dark:bg-davus-primary/20' : ''}>
                  <TableCell>
                    <Checkbox
                      label=""
                      checked={selectedIds.has(asset.id)}
                      onChange={() => toggleSelection(asset.id)}
                    />
                  </TableCell>
                  <TableCell className="font-mono text-sm text-gray-500 dark:text-gray-400">{asset.asset_tag}</TableCell>
                  <TableCell className="font-medium text-davus-dark dark:text-gray-100">{asset.name}</TableCell>
                  <TableCell className="text-gray-500 text-sm dark:text-gray-400">{asset.location_id}</TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};