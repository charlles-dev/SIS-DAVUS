import React, { useEffect, useState } from 'react';
import { Plus, Check, X, Truck, Search } from 'lucide-react';
import { 
  Button, Input, Badge, Dialog, Select, Table, TableHeader, TableRow, TableHead, TableCell, 
  Card, CardContent, CardHeader, CardTitle 
} from '../components/UI';
import { PurchaseService, InventoryService } from '@/api/services';
import { PurchaseRequest, PurchaseStatus, Product } from '@/types/types';

export const PurchasePage: React.FC = () => {
  const [requests, setRequests] = useState<PurchaseRequest[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // New Request Form
  const [newReq, setNewReq] = useState({ product_id: '', quantity: '', notes: '', requested_by: 'Eu' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [reqs, prods] = await Promise.all([
      PurchaseService.getRequests(),
      InventoryService.getProducts()
    ]);
    setRequests(reqs);
    setProducts(prods);
    setLoading(false);
  };

  const handleStatusChange = async (id: string, status: PurchaseStatus) => {
    if(!confirm(`Deseja alterar o status para ${status}?`)) return;
    await PurchaseService.updateStatus(id, status);
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await PurchaseService.createRequest({
       product_id: newReq.product_id,
       quantity: Number(newReq.quantity),
       notes: newReq.notes,
       requested_by: newReq.requested_by
    });
    setIsModalOpen(false);
    setNewReq({ product_id: '', quantity: '', notes: '', requested_by: 'Eu' });
    loadData(); // Reload to get the new ID and formatted data
  };

  const getStatusBadge = (status: PurchaseStatus) => {
    switch(status) {
      case PurchaseStatus.PENDING: return <Badge variant="warning">Pendente</Badge>;
      case PurchaseStatus.APPROVED: return <Badge variant="info">Aprovado</Badge>;
      case PurchaseStatus.ORDERED: return <Badge variant="info">Pedido</Badge>;
      case PurchaseStatus.DELIVERED: return <Badge variant="success">Entregue</Badge>;
      case PurchaseStatus.REJECTED: return <Badge variant="destructive">Rejeitado</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-davus-dark dark:text-white">Solicitações de Compra</h2>
          <p className="text-gray-500 dark:text-gray-400">Gerencie pedidos de materiais para as obras.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Nova Solicitação
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
           <Table>
             <TableHeader>
               <TableRow>
                 <TableHead>Data</TableHead>
                 <TableHead>Produto</TableHead>
                 <TableHead>Qtd</TableHead>
                 <TableHead>Solicitante</TableHead>
                 <TableHead>Status</TableHead>
                 <TableHead>Ações</TableHead>
               </TableRow>
             </TableHeader>
             <tbody>
               {requests.map(req => (
                 <TableRow key={req.id}>
                   <TableCell className="text-xs text-gray-500 dark:text-gray-400">
                     {new Date(req.created_at).toLocaleDateString('pt-BR')}
                   </TableCell>
                   <TableCell>
                     <div className="font-medium text-davus-dark dark:text-gray-100">{req.product_name}</div>
                     {req.notes && <div className="text-xs text-gray-400 italic">{req.notes}</div>}
                   </TableCell>
                   <TableCell className="text-gray-700 dark:text-gray-300">{req.quantity} {req.unit}</TableCell>
                   <TableCell className="text-gray-700 dark:text-gray-300">{req.requested_by}</TableCell>
                   <TableCell>{getStatusBadge(req.status)}</TableCell>
                   <TableCell>
                     <div className="flex gap-1">
                       {req.status === PurchaseStatus.PENDING && (
                         <>
                           <Button size="icon" variant="ghost" className="text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20 h-8 w-8" onClick={() => handleStatusChange(req.id, PurchaseStatus.APPROVED)} title="Aprovar">
                             <Check size={16} />
                           </Button>
                           <Button size="icon" variant="ghost" className="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 h-8 w-8" onClick={() => handleStatusChange(req.id, PurchaseStatus.REJECTED)} title="Rejeitar">
                             <X size={16} />
                           </Button>
                         </>
                       )}
                       {(req.status === PurchaseStatus.APPROVED || req.status === PurchaseStatus.ORDERED) && (
                          <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => handleStatusChange(req.id, PurchaseStatus.DELIVERED)}>
                            <Truck size={14} className="mr-1"/> Receber
                          </Button>
                       )}
                     </div>
                   </TableCell>
                 </TableRow>
               ))}
               {requests.length === 0 && <TableRow><TableCell className="text-center h-24">Nenhuma solicitação.</TableCell></TableRow>}
             </tbody>
           </Table>
        </CardContent>
      </Card>

      <Dialog isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nova Solicitação de Compra">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select 
            label="Produto"
            options={products.map(p => ({ value: p.id, label: p.name }))}
            value={newReq.product_id}
            onChange={e => setNewReq({...newReq, product_id: e.target.value})}
            required
            placeholder="Selecione o produto..."
          />
          <Input 
             label="Quantidade"
             type="number"
             value={newReq.quantity}
             onChange={e => setNewReq({...newReq, quantity: e.target.value})}
             required
          />
          <Input 
             label="Motivo / Observação"
             value={newReq.notes}
             onChange={e => setNewReq({...newReq, notes: e.target.value})}
             placeholder="Ex: Urgente para concretagem"
          />
          <div className="flex justify-end gap-2 mt-4">
             <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
             <Button type="submit">Enviar Pedido</Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};