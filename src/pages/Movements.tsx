
import React, { useEffect, useState } from 'react';
import { Search, ArrowDownLeft, ArrowUpRight, Calendar } from 'lucide-react';
import { 
  Input, Badge, Select, Table, TableHeader, TableRow, TableHead, TableCell, 
  Card, CardContent, CardHeader, Pagination 
} from '../components/UI';
import { InventoryService } from '@/api/services';
import { StockMovement } from '@/types/types';

export const MovementHistoryPage: React.FC = () => {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [filterType, setFilterType] = useState('all');
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await InventoryService.getAllMovements();
    setMovements(data);
    setLoading(false);
  };

  const filteredMovements = movements.filter(m => {
    const matchesSearch = (m.product_name?.toLowerCase() || '').includes(search.toLowerCase()) || 
                          (m.notes?.toLowerCase() || '').includes(search.toLowerCase());
    const matchesType = filterType === 'all' || m.type === filterType;
    
    let matchesDate = true;
    const mDate = new Date(m.date);
    if (startDate) matchesDate = matchesDate && mDate >= new Date(startDate);
    if (endDate) {
       const end = new Date(endDate);
       end.setHours(23,59,59);
       matchesDate = matchesDate && mDate <= end;
    }

    return matchesSearch && matchesType && matchesDate;
  });

  const totalPages = Math.ceil(filteredMovements.length / itemsPerPage);
  const paginatedMovements = filteredMovements.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-davus-dark dark:text-white">Histórico de Movimentações</h2>
        <p className="text-gray-500 dark:text-gray-400">Extrato completo de entradas e saídas.</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input 
                    placeholder="Buscar por produto ou nota..." 
                    className="pl-9" 
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                  />
              </div>
              <div className="w-full md:w-48">
                  <Select
                    value={filterType}
                    onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1); }}
                    options={[
                      { value: 'all', label: 'Todos os Tipos' },
                      { value: 'IN', label: 'Entradas' },
                      { value: 'OUT', label: 'Saídas' },
                    ]}
                  />
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-3 items-end">
               <div className="w-full md:w-auto">
                 <label className="text-xs text-gray-500 mb-1 block dark:text-gray-400">Data Início</label>
                 <Input 
                   type="date" 
                   value={startDate} 
                   onChange={(e) => { setStartDate(e.target.value); setCurrentPage(1); }} 
                 />
               </div>
               <div className="w-full md:w-auto">
                 <label className="text-xs text-gray-500 mb-1 block dark:text-gray-400">Data Fim</label>
                 <Input 
                   type="date" 
                   value={endDate} 
                   onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1); }} 
                 />
               </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">Carregando histórico...</div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data/Hora</TableHead>
                    <TableHead>Produto</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Quantidade</TableHead>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Observação</TableHead>
                  </TableRow>
                </TableHeader>
                <tbody>
                  {paginatedMovements.map((mov) => (
                    <TableRow key={mov.id}>
                      <TableCell className="text-xs text-gray-700 dark:text-gray-300">
                        <div>{new Date(mov.date).toLocaleDateString('pt-BR')}</div>
                        <div className="text-gray-400">{new Date(mov.date).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</div>
                      </TableCell>
                      <TableCell className="font-medium text-davus-dark dark:text-gray-100">{mov.product_name}</TableCell>
                      <TableCell>
                        <Badge variant={mov.type === 'IN' ? 'success' : 'destructive'} className="flex w-fit items-center gap-1">
                          {mov.type === 'IN' ? <ArrowDownLeft size={12}/> : <ArrowUpRight size={12}/>}
                          {mov.type === 'IN' ? 'ENTRADA' : 'SAÍDA'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-davus-dark dark:text-gray-100">{mov.quantity}</TableCell>
                      <TableCell className="text-gray-500 dark:text-gray-400 text-xs">{mov.user}</TableCell>
                      <TableCell className="text-gray-500 dark:text-gray-400 text-xs italic">{mov.notes || '-'}</TableCell>
                    </TableRow>
                  ))}
                  {paginatedMovements.length === 0 && (
                    <TableRow><TableCell className="text-center h-24">Nenhum registro encontrado.</TableCell></TableRow>
                  )}
                </tbody>
              </Table>
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
