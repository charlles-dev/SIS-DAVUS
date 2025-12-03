import React, { useEffect, useState } from 'react';
import { RotateCcw, AlertTriangle, Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Table, TableHeader, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Card, CardContent } from '@/components/ui/Card';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Dialog } from '@/components/ui/Dialog';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { SignaturePad } from '../components/SignaturePad';
import { AssetService } from '@/api/services';
import { Checkout, Asset } from '@/types/types';
import { checkoutSchema, CheckoutFormValues } from '@/lib/schemas';
import { toast } from 'sonner';

export const CheckoutsPage: React.FC = () => {
  const [checkouts, setCheckouts] = useState<Checkout[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema)
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [checkoutsData, assetsData] = await Promise.all([
      AssetService.getCheckouts(),
      AssetService.getAssets()
    ]);
    setCheckouts(checkoutsData);
    setAssets(assetsData.filter(a => a.status === 'AVAILABLE')); // Only available assets
    setLoading(false);
  };

  const handleReturn = async (id: string) => {
    if (!confirm('Confirmar devolução do item?')) return;
    await AssetService.returnAsset(id);
    setCheckouts(prev => prev.filter(c => c.id !== id));
  };

  const handleCreateCheckout = async (data: CheckoutFormValues) => {
    try {
      await AssetService.createCheckout({
        asset_id: data.asset_id,
        worker_name: data.worker_name,
        expected_return: data.expected_return,
        checked_out_at: new Date().toISOString()
      });
      toast.success("Empréstimo registrado com sucesso!");
      setIsModalOpen(false);
      reset();
      loadData();
    } catch (error) {
      toast.error("Erro ao criar cautela");
    }
  };

  const isOverdue = (dateStr?: string) => {
    if (!dateStr) return false;
    return new Date(dateStr) < new Date();
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs />
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-davus-dark dark:text-white">Cautelas Ativas</h2>
          <p className="text-gray-500 dark:text-gray-400">Ferramentas e equipamentos em uso por funcionários.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Novo Empréstimo
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {loading ? <div className="text-center p-8 text-gray-500 dark:text-gray-400">Carregando...</div> : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Funcionário</TableHead>
                  <TableHead>Ativo</TableHead>
                  <TableHead>Tag</TableHead>
                  <TableHead>Retirada</TableHead>
                  <TableHead>Devolução Prevista</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <tbody>
                {checkouts.map(c => {
                  const overdue = isOverdue(c.expected_return);
                  return (
                    <TableRow key={c.id} className={overdue ? 'bg-red-50 dark:bg-red-900/10' : ''}>
                      <TableCell className="font-medium text-davus-dark dark:text-gray-100">{c.worker_name}</TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300">{c.asset_name}</TableCell>
                      <TableCell className="font-mono text-xs text-gray-500 dark:text-gray-400">{c.asset_tag}</TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-300">{new Date(c.checked_out_at).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>
                        {c.expected_return ? (
                          <span className={overdue ? 'text-red-600 dark:text-red-400 font-bold flex items-center gap-1' : 'text-gray-600 dark:text-gray-300'}>
                            {overdue && <AlertTriangle size={14} />}
                            {new Date(c.expected_return).toLocaleDateString('pt-BR')}
                          </span>
                        ) : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" onClick={() => handleReturn(c.id)}>
                          <RotateCcw className="mr-2 h-3 w-3" /> Devolver
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {checkouts.length === 0 && (
                  <TableRow><TableCell className="text-center h-24">Nenhuma cautela ativa no momento.</TableCell></TableRow>
                )}
              </tbody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* New Checkout Modal */}
      <Dialog isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Registrar Empréstimo (Cautela)">
        <form onSubmit={handleSubmit(handleCreateCheckout)} className="space-y-4">
          <Select
            label="Ativo Disponível"
            options={assets.map(a => ({ value: a.id, label: `${a.asset_tag} - ${a.name}` }))}
            placeholder="Selecione o equipamento"
            {...register('asset_id')}
            error={errors.asset_id?.message}
          />
          <Input
            label="Nome do Funcionário"
            placeholder="Quem está retirando?"
            {...register('worker_name')}
            error={errors.worker_name?.message}
          />
          <Input
            label="Data Prevista de Devolução"
            type="date"
            {...register('expected_return')}
            error={errors.expected_return?.message}
          />

          <div>
            <label className="text-sm font-medium mb-1 block dark:text-gray-200">Assinatura do Funcionário</label>
            <SignaturePad />
            <p className="text-xs text-gray-500 mt-1">Ao assinar, o funcionário declara responsabilidade pelo item.</p>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button type="submit">Confirmar Saída</Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};
