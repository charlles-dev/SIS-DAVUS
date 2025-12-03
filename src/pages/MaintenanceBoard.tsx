
import React, { useEffect, useState } from 'react';
import { Wrench, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Dialog } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Skeleton } from '@/components/ui/Skeleton';
import { AssetService } from '@/api/services';
import { MaintenanceOrder, MaintenanceStatus, Asset } from '@/types/types';
import { maintenanceSchema, MaintenanceFormValues } from '@/lib/schemas';
import { toast } from 'sonner';

const KanbanColumn = ({
  title,
  status,
  orders,
  onDropOrder,
  onDragOver,
  onCardClick
}: {
  title: string,
  status: MaintenanceStatus,
  orders: MaintenanceOrder[],
  onDropOrder: (orderId: string, newStatus: MaintenanceStatus) => void,
  onDragOver: (e: React.DragEvent) => void,
  onCardClick: (order: MaintenanceOrder) => void
}) => {
  const getBorderColor = () => {
    switch (status) {
      case MaintenanceStatus.BROKEN: return 'border-t-red-500';
      case MaintenanceStatus.OPEN: return 'border-t-orange-500';
      case MaintenanceStatus.WAITING_PAYMENT: return 'border-t-blue-500';
      case MaintenanceStatus.COMPLETED: return 'border-t-green-500';
      default: return 'border-t-gray-200';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const orderId = e.dataTransfer.getData('orderId');
    if (orderId) onDropOrder(orderId, status);
  };

  return (
    <div
      className={`flex-1 min-w-[280px] bg-gray-100 dark:bg-gray-800/50 rounded-lg p-3 h-full flex flex-col border-t-4 ${getBorderColor()}`}
      onDragOver={onDragOver}
      onDrop={handleDrop}
    >
      <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-3 flex justify-between">
        {title}
        <span className="bg-white dark:bg-gray-700 px-2 rounded-full text-xs py-0.5 border dark:border-gray-600">{orders.length}</span>
      </h3>
      <div className="space-y-3 overflow-y-auto flex-1">
        {orders.map(order => (
          <DraggableCard key={order.id} order={order} onClick={() => onCardClick(order)} />
        ))}
        {orders.length === 0 && (
          <div className="h-full min-h-[100px] border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg flex items-center justify-center text-xs text-gray-400">
            Arraste aqui
          </div>
        )}
      </div>
    </div>
  );
};

const DraggableCard = ({ order, onClick }: { order: MaintenanceOrder, onClick: () => void }) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('orderId', order.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={onClick}
      className="cursor-move hover:scale-[1.02] transition-transform active:opacity-50"
    >
      <Card className="shadow-sm hover:shadow-md dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="p-3">
          <div className="flex justify-between items-start mb-2">
            <span className="font-mono text-[10px] bg-gray-100 dark:bg-gray-700 px-1 rounded text-gray-600 dark:text-gray-300">{order.asset_tag}</span>
            {order.days_open > 10 && <Badge variant="destructive" className="text-[10px] px-1 py-0">{order.days_open} dias</Badge>}
          </div>
          <h4 className="font-bold text-sm text-davus-dark dark:text-gray-100 mb-1">{order.asset_name}</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 truncate">{order.description}</p>

          <div className="flex items-center gap-1 text-xs text-gray-400 mb-3">
            <Wrench size={10} /> {order.vendor}
          </div>

          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {order.cost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const MaintenanceBoardPage: React.FC = () => {
  const [orders, setOrders] = useState<MaintenanceOrder[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<MaintenanceOrder | null>(null);

  // Forms
  const { register, handleSubmit, reset, formState: { errors } } = useForm<MaintenanceFormValues>({
    resolver: zodResolver(maintenanceSchema) as any
  });

  const { register: registerEdit, handleSubmit: handleSubmitEdit, reset: resetEdit } = useForm<MaintenanceFormValues>();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [ordersData, assetsData] = await Promise.all([
      AssetService.getMaintenanceOrders(),
      AssetService.getAssets()
    ]);
    setOrders(ordersData);
    setAssets(assetsData);
    setLoading(false);
  };

  const handleDropOrder = async (orderId: string, newStatus: MaintenanceStatus) => {
    // Optimistic Update
    const oldOrders = [...orders];
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));

    try {
      await AssetService.updateMaintenanceStatus(orderId, newStatus);
    } catch (e) {
      toast.error('Erro ao atualizar status. Revertendo...');
      setOrders(oldOrders);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleCreateOrder = async (data: MaintenanceFormValues) => {
    try {
      await AssetService.createMaintenanceOrder({
        asset_id: data.asset_id,
        vendor: data.vendor,
        description: data.description,
        cost: data.cost
      });
      toast.success("Ordem aberta com sucesso!");
      setIsModalOpen(false);
      reset();
      loadData();
    } catch (error) {
      toast.error("Erro ao criar ordem");
    }
  };

  const handleCardClick = (order: MaintenanceOrder) => {
    setSelectedOrder(order);
    resetEdit({
      asset_id: order.asset_id, // Readonly
      vendor: order.vendor,
      description: order.description,
      cost: order.cost,
      status: order.status
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateOrder = async (data: MaintenanceFormValues) => {
    // Mock update logic
    if (!selectedOrder) return;
    try {
      // In real app calls update endpoint
      if (data.status) await AssetService.updateMaintenanceStatus(selectedOrder.id, data.status);
      toast.success("Ordem atualizada com sucesso!");
      setIsEditModalOpen(false);
      loadData();
    } catch (error) {
      toast.error("Erro ao atualizar ordem");
    }
  };

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col space-y-4">
      <Breadcrumbs />
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-davus-dark dark:text-white">Quadro de Manutenção</h2>
          <p className="text-gray-500 dark:text-gray-400">Arraste os cards para atualizar o status.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Wrench className="mr-2 h-4 w-4" /> Nova Ordem
        </Button>
      </div>

      {loading ? (
        <div className="flex gap-4 overflow-x-auto pb-4 h-full">
          <Skeleton className="min-w-[280px] h-full" />
          <Skeleton className="min-w-[280px] h-full" />
          <Skeleton className="min-w-[280px] h-full" />
          <Skeleton className="min-w-[280px] h-full" />
        </div>
      ) : (
        <div className="flex-1 flex gap-4 overflow-x-auto pb-4">
          <KanbanColumn
            title="Aguardando Envio"
            status={MaintenanceStatus.BROKEN}
            orders={orders.filter(o => o.status === MaintenanceStatus.BROKEN)}
            onDropOrder={handleDropOrder}
            onDragOver={handleDragOver}
            onCardClick={handleCardClick}
          />
          <KanbanColumn
            title="Na Oficina"
            status={MaintenanceStatus.OPEN}
            orders={orders.filter(o => o.status === MaintenanceStatus.OPEN)}
            onDropOrder={handleDropOrder}
            onDragOver={handleDragOver}
            onCardClick={handleCardClick}
          />
          <KanbanColumn
            title="Aguardando Pagamento"
            status={MaintenanceStatus.WAITING_PAYMENT}
            orders={orders.filter(o => o.status === MaintenanceStatus.WAITING_PAYMENT)}
            onDropOrder={handleDropOrder}
            onDragOver={handleDragOver}
            onCardClick={handleCardClick}
          />
          <KanbanColumn
            title="Concluído (7 dias)"
            status={MaintenanceStatus.COMPLETED}
            orders={orders.filter(o => o.status === MaintenanceStatus.COMPLETED)}
            onDropOrder={handleDropOrder}
            onDragOver={handleDragOver}
            onCardClick={handleCardClick}
          />
        </div>
      )}

      {/* New Order Modal */}
      <Dialog isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nova Ordem de Manutenção">
        <form onSubmit={handleSubmit(handleCreateOrder)} className="space-y-4">
          <Select
            label="Ativo"
            options={assets.map(a => ({ value: a.id, label: `${a.asset_tag} - ${a.name}` }))}
            {...register('asset_id')}
            error={errors.asset_id?.message}
            placeholder="Selecione o equipamento"
          />
          <Input
            label="Fornecedor / Oficina"
            placeholder="Ex: Assistência Técnica XYZ"
            {...register('vendor')}
            error={errors.vendor?.message}
          />
          <div className="space-y-1">
            <label className="text-sm font-medium dark:text-gray-200">Descrição do Problema</label>
            <textarea
              className="w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-davus-primary dark:bg-gray-900 dark:border-gray-700 dark:text-white"
              rows={3}
              {...register('description')}
            ></textarea>
            {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
          </div>
          <Input
            label="Custo Estimado (R$)"
            type="number"
            step="0.01"
            {...register('cost')}
            error={errors.cost?.message}
          />
          <div className="flex justify-end gap-3 mt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button type="submit">Abrir Chamado</Button>
          </div>
        </form>
      </Dialog>

      {/* Edit Order Modal */}
      <Dialog isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Detalhes da Manutenção">
        <form onSubmit={handleSubmitEdit(handleUpdateOrder)} className="space-y-4">
          <Input
            label="Fornecedor"
            {...registerEdit('vendor')}
          />
          <div className="space-y-1">
            <label className="text-sm font-medium dark:text-gray-200">Descrição</label>
            <textarea
              className="w-full rounded-md border border-gray-300 p-2 text-sm dark:bg-gray-900 dark:border-gray-700 dark:text-white"
              rows={3}
              {...registerEdit('description')}
            ></textarea>
          </div>
          <Input
            label="Custo Final (R$)"
            type="number"
            step="0.01"
            {...registerEdit('cost')}
          />
          <Select
            label="Status"
            options={Object.values(MaintenanceStatus).map(s => ({ value: s, label: s }))}
            {...registerEdit('status')}
          />
          <div className="flex justify-end gap-3 mt-4">
            <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>Fechar</Button>
            <Button type="submit">Salvar Alterações</Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};
