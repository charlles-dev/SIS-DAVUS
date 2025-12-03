
import React, { useEffect, useState } from 'react';
import { Plus, Search, MoreVertical, ArrowUpRight, ArrowDownLeft, Edit, FileText, Trash2, AlertCircle, Info, Filter } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { Dialog, ConfirmDialog } from '@/components/ui/Dialog';
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown';
import { Table, TableHeader, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Pagination } from '@/components/ui/Pagination';
import { Checkbox } from '@/components/ui/Checkbox';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { MobileCard } from '../components/MobileCard';
import { useInventory } from '../hooks/useInventory';
import { Product, UnitType, StockMovement } from '@/types/types';
import { ExportButton } from '../components/ExportButton';
import { useDebounce } from '../hooks/useDebounce';
import { toast } from 'sonner';

export const InventoryPage: React.FC = () => {
  const {
    products,
    categories,
    isLoading: loading,
    createProduct,
    updateProduct,
    deleteProduct,
    createMovement,
    getProductMovements
  } = useInventory();

  // Filters
  const [searchInput, setSearchInput] = useState('');
  const searchFilter = useDebounce(searchInput, 300);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [unitFilter, setUnitFilter] = useState('');
  const [stockRange, setStockRange] = useState({ min: '', max: '' });
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Creation/Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Legend Modal
  const [isLegendOpen, setIsLegendOpen] = useState(false);

  // Delete Modal State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // History Modal State
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [selectedProductHistory, setSelectedProductHistory] = useState<Product | null>(null);
  const [movementsHistory, setMovementsHistory] = useState<StockMovement[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Movement Modal State
  const [movementModalOpen, setMovementModalOpen] = useState(false);
  const [selectedProductMovement, setSelectedProductMovement] = useState<Product | null>(null);
  const [movementType, setMovementType] = useState<'IN' | 'OUT'>('IN');
  const [movementQty, setMovementQty] = useState('');
  const [movementNotes, setMovementNotes] = useState('');

  // New/Edit Product Form State
  const [productForm, setProductForm] = useState({
    name: '',
    category: '',
    unit: 'UN',
    min_threshold: '0',
    initial_stock: '0',
  });

  // Removed manual loadData useEffect as useInventory handles it

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesCategory = categoryFilter === '' || categoryFilter === 'all' || p.category === categoryFilter;

    const isLowStock = p.current_stock <= p.min_threshold;
    let matchesStatus = true;
    if (statusFilter === 'low') matchesStatus = isLowStock;
    if (statusFilter === 'normal') matchesStatus = !isLowStock;

    const matchesUnit = unitFilter === '' || unitFilter === 'all' || p.unit === unitFilter;

    const minStock = stockRange.min === '' ? -Infinity : Number(stockRange.min);
    const maxStock = stockRange.max === '' ? Infinity : Number(stockRange.max);
    const matchesStockRange = p.current_stock >= minStock && p.current_stock <= maxStock;

    return matchesSearch && matchesCategory && matchesStatus && matchesUnit && matchesStockRange;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchFilter, categoryFilter, statusFilter, unitFilter, stockRange]);

  const openCreateModal = () => {
    setEditingProduct(null);
    setProductForm({ name: '', category: '', unit: 'UN', min_threshold: '0', initial_stock: '0' });
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      category: product.category,
      unit: product.unit,
      min_threshold: String(product.min_threshold),
      initial_stock: String(product.current_stock) // Note: In edit mode, this usually represents current stock or adjustment, but simplified here
    });
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingProduct) {
        // Update
        await updateProduct({
          ...editingProduct,
          name: productForm.name,
          category: productForm.category,
          unit: productForm.unit as UnitType,
          min_threshold: Number(productForm.min_threshold),
          current_stock: Number(productForm.initial_stock)
        });
      } else {
        // Create
        const payload = {
          name: productForm.name,
          category: productForm.category,
          unit: productForm.unit as UnitType,
          min_threshold: Number(productForm.min_threshold),
          current_stock: Number(productForm.initial_stock)
        };
        await createProduct(payload);
      }
      setIsModalOpen(false);
      // Toast handled in hook
    } catch (error) {
      console.error(error);
      // Toast handled in hook
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await deleteProduct(productToDelete.id);
      setDeleteDialogOpen(false);
      setProductToDelete(null);
      // Toast handled in hook
    } catch (error) {
      // Toast handled in hook
    }
  };

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleAll = () => {
    if (selectedIds.size === paginatedProducts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedProducts.map(p => p.id)));
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(Array.from(selectedIds).map(id => deleteProduct(id)));
      setSelectedIds(new Set());
      setBulkDeleteDialogOpen(false);
      toast.success(`${selectedIds.size} produtos excluídos com sucesso!`);
    } catch (error) {
      toast.error('Erro ao excluir produtos');
    }
  };

  const handleHistoryClick = async (product: Product) => {
    setSelectedProductHistory(product);
    setHistoryModalOpen(true);
    setLoadingHistory(true);
    try {
      const movements = await getProductMovements(product.id);
      setMovementsHistory(movements);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleMovementClick = (product: Product, type: 'IN' | 'OUT') => {
    setSelectedProductMovement(product);
    setMovementType(type);
    setMovementQty('');
    setMovementNotes('');
    setMovementModalOpen(true);
  };

  const submitMovement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductMovement) return;

    const qty = Number(movementQty);
    if (qty <= 0) {
      toast.warning('Quantidade deve ser maior que zero');
      return;
    }

    if (movementType === 'OUT' && qty > selectedProductMovement.current_stock) {
      toast.error('Estoque insuficiente!');
      return;
    }

    try {
      await createMovement({
        productId: selectedProductMovement.id,
        type: movementType,
        quantity: qty,
        notes: movementNotes
      });
      setMovementModalOpen(false);
      // Toast handled in hook
    } catch (error) {
      // Toast handled in hook
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProductForm(prev => ({ ...prev, [name]: value }));
  };

  const unitOptions = Object.values(UnitType).map(u => ({ value: u, label: u }));
  const categoryOptions = categories.map(c => ({ value: c, label: c }));

  return (
    <div className="space-y-6">
      <Breadcrumbs />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-davus-dark dark:text-white">Inventário</h2>
          <p className="text-gray-500 dark:text-gray-400">Gerencie insumos e materiais de consumo.</p>
        </div>
        <div className="flex gap-2">
          <ExportButton data={filteredProducts} filename="inventario" />
          <Button variant="outline" onClick={() => setIsLegendOpen(true)}>
            <Info className="mr-2 h-4 w-4" /> Legenda
          </Button>
          <Button onClick={openCreateModal}>
            <Plus className="mr-2 h-4 w-4" /> Novo Produto
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-4">
            <CardTitle className="text-base text-davus-dark dark:text-gray-100">Listagem de Produtos</CardTitle>

            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Buscar insumo..."
                  className="pl-9"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>
              <div className="w-full md:w-48">
                <Select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  options={[
                    { value: 'all', label: 'Todas as Categorias' },
                    ...categoryOptions
                  ]}
                />
              </div>
              <div className="w-full md:w-48">
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  options={[
                    { value: 'all', label: 'Todos os Status' },
                    { value: 'normal', label: 'Em Estoque' },
                    { value: 'low', label: 'Estoque Baixo' },
                  ]}
                />
              </div>
              <div className="w-full md:w-auto">
                <Button variant="outline" onClick={() => setIsFilterModalOpen(true)} className="w-full md:w-auto">
                  <Filter className="mr-2 h-4 w-4" /> Filtros
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40px]">
                        <Checkbox
                          label=""
                          checked={paginatedProducts.length > 0 && selectedIds.size === paginatedProducts.length}
                          onChange={toggleAll}
                        />
                      </TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Unidade</TableHead>
                      <TableHead>Estoque Atual</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <tbody className="[&_tr:last-child]:border-0">
                    <AnimatePresence mode="popLayout">
                      {selectedIds.size > 0 && (
                        <motion.tr
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        >
                          <TableCell colSpan={7}>
                            <div className="flex items-center justify-between px-2">
                              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                                {selectedIds.size} item(s) selecionado(s)
                              </span>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => setBulkDeleteDialogOpen(true)}
                                className="h-8"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Excluir Selecionados
                              </Button>
                            </div>
                          </TableCell>
                        </motion.tr>
                      )}
                      {paginatedProducts.map((product, index) => {
                        const isLowStock = product.current_stock <= product.min_threshold;
                        const isSelected = selectedIds.has(product.id);
                        return (
                          <motion.tr
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: index * 0.05 }}
                            className={cn(
                              "border-b transition-colors hover:bg-gray-50/50 data-[state=selected]:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-700/50",
                              isSelected ? "bg-blue-50/50 dark:bg-blue-900/10" : (isLowStock ? "bg-red-50/50 dark:bg-red-900/10" : "")
                            )}
                          >
                            <TableCell>
                              <Checkbox
                                label=""
                                checked={isSelected}
                                onChange={() => toggleSelection(product.id)}
                              />
                            </TableCell>
                            <TableCell className="font-medium text-davus-dark dark:text-gray-100">
                              {product.name}
                            </TableCell>
                            <TableCell>
                              <span className="bg-white border border-gray-200 text-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs font-medium">
                                {product.category}
                              </span>
                            </TableCell>
                            <TableCell className="text-gray-500 dark:text-gray-400">{product.unit}</TableCell>
                            <TableCell>
                              <span className={isLowStock ? 'font-bold text-red-700 dark:text-red-400' : 'text-gray-900 dark:text-gray-100'}>
                                {product.current_stock}
                              </span>
                              <span className="text-xs text-gray-400 ml-1">
                                (Mín: {product.min_threshold})
                              </span>
                            </TableCell>
                            <TableCell>
                              {isLowStock ? (
                                <Badge variant="destructive">Estoque Baixo</Badge>
                              ) : (
                                <Badge variant="success">Em Estoque</Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1 items-center">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20"
                                  title="Registrar Entrada"
                                  onClick={() => handleMovementClick(product, 'IN')}
                                >
                                  <ArrowDownLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                                  title="Registrar Saída"
                                  onClick={() => handleMovementClick(product, 'OUT')}
                                >
                                  <ArrowUpRight className="h-4 w-4" />
                                </Button>

                                <Dropdown trigger={
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                }>
                                  <DropdownItem onClick={() => openEditModal(product)}>
                                    <Edit className="mr-2 h-4 w-4 text-gray-500" />
                                    Editar
                                  </DropdownItem>
                                  <DropdownItem onClick={() => handleHistoryClick(product)}>
                                    <FileText className="mr-2 h-4 w-4 text-gray-500" />
                                    Ver Extrato
                                  </DropdownItem>
                                  <DropdownItem onClick={() => handleDeleteClick(product)} className="text-red-600 focus:bg-red-50 dark:text-red-400 dark:focus:bg-red-900/20">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Excluir
                                  </DropdownItem>
                                </Dropdown>
                              </div>
                            </TableCell>
                          </motion.tr>
                        );
                      })}
                    </AnimatePresence>
                    {filteredProducts.length === 0 && (
                      <TableRow>
                        <TableCell className="h-24 text-center" >
                          Nenhum produto encontrado.
                        </TableCell>
                      </TableRow>
                    )}
                  </tbody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {paginatedProducts.map((product) => {
                  const isLowStock = product.current_stock <= product.min_threshold;
                  return (
                    <MobileCard
                      key={product.id}
                      title={product.name}
                      subtitle={product.category}
                      status={isLowStock ? 'Estoque Baixo' : 'Em Estoque'}
                      statusVariant={isLowStock ? 'destructive' : 'success'}
                      details={[
                        { label: 'Estoque', value: `${product.current_stock} ${product.unit}` },
                        { label: 'Mínimo', value: `${product.min_threshold} ${product.unit}` }
                      ]}
                      actions={
                        <>
                          <Button size="sm" variant="ghost" onClick={() => handleMovementClick(product, 'IN')}>
                            <ArrowDownLeft className="h-4 w-4 text-green-600" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleMovementClick(product, 'OUT')}>
                            <ArrowUpRight className="h-4 w-4 text-red-600" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => openEditModal(product)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </>
                      }
                      onClick={() => handleHistoryClick(product)}
                    />
                  );
                })}
                {filteredProducts.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Nenhum produto encontrado.
                  </div>
                )}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Product Modal */}
      <Dialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? "Editar Produto" : "Novo Produto"}
      >
        <form onSubmit={handleSaveProduct} className="space-y-4 mt-2">
          <Input
            label="Nome do Produto"
            name="name"
            placeholder="Ex: Cimento CP II"
            value={productForm.name}
            onChange={handleInputChange}
            required
          />

          <Select
            label="Categoria"
            name="category"
            value={productForm.category}
            onChange={handleInputChange}
            options={categoryOptions}
            placeholder="Selecione..."
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Unidade"
              name="unit"
              value={productForm.unit}
              onChange={handleInputChange}
              options={unitOptions}
              required
            />
            <Input
              label="Estoque Mínimo"
              name="min_threshold"
              type="number"
              min="0"
              step="0.01"
              value={productForm.min_threshold}
              onChange={handleInputChange}
              required
            />
          </div>

          <Input
            label={editingProduct ? "Estoque Atual (Ajuste)" : "Estoque Inicial"}
            name="initial_stock"
            type="number"
            min="0"
            step="0.01"
            value={productForm.initial_stock}
            onChange={handleInputChange}
            required
          // For editing, usually you don't edit stock directly here, but let's allow adjustment
          />

          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {editingProduct ? "Salvar Alterações" : "Salvar Produto"}
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Legend Modal */}
      <Dialog
        isOpen={isLegendOpen}
        onClose={() => setIsLegendOpen(false)}
        title="Legenda de Unidades"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Significado das siglas de unidades de medida utilizadas no sistema.</p>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(UnitType).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2 border p-2 rounded dark:border-gray-700">
                <span className="font-bold bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs min-w-[35px] text-center">{value}</span>
                <span className="text-sm">
                  {key === 'M3' && 'Metro Cúbico'}
                  {key === 'SC' && 'Saco'}
                  {key === 'BL' && 'Balde'}
                  {key === 'KG' && 'Quilograma'}
                  {key === 'UN' && 'Unidade'}
                  {key === 'TB' && 'Tubo'}
                  {key === 'MIL' && 'Milheiro'}
                  {key === 'L' && 'Litro'}
                </span>
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setIsLegendOpen(false)}>Fechar</Button>
          </div>
        </div>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Excluir Produto"
        description={`Tem certeza que deseja excluir o produto "${productToDelete?.name}"? Esta ação não pode ser desfeita.`}
        confirmText="Sim, excluir"
        variant="destructive"
      />

      <ConfirmDialog
        isOpen={bulkDeleteDialogOpen}
        onClose={() => setBulkDeleteDialogOpen(false)}
        onConfirm={handleBulkDelete}
        title="Excluir Produtos Selecionados"
        description={`Tem certeza que deseja excluir ${selectedIds.size} produtos? Esta ação não pode ser desfeita.`}
        confirmText="Sim, excluir tudo"
        variant="destructive"
      />

      {/* Movement Modal */}
      <Dialog
        isOpen={movementModalOpen}
        onClose={() => setMovementModalOpen(false)}
        title={movementType === 'IN' ? 'Registrar Entrada' : 'Registrar Saída'}
      >
        {selectedProductMovement && (
          <form onSubmit={submitMovement} className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md border border-gray-200 dark:border-gray-600">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Produto</p>
              <p className="text-lg font-bold text-davus-dark dark:text-white">{selectedProductMovement.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Estoque Atual: {selectedProductMovement.current_stock} {selectedProductMovement.unit}
              </p>
            </div>

            <Input
              label="Quantidade"
              type="number"
              min="0"
              step="any"
              value={movementQty}
              onChange={(e) => setMovementQty(e.target.value)}
              placeholder="0.00"
              required
              autoFocus
            />

            <div className="space-y-1">
              <label className="text-sm font-medium text-davus-dark dark:text-gray-200">Observações</label>
              <textarea
                className="flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-davus-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
                placeholder="Justificativa da movimentação..."
                value={movementNotes}
                onChange={(e) => setMovementNotes(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setMovementModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" variant={movementType === 'IN' ? 'primary' : 'destructive'}>
                Confirmar {movementType === 'IN' ? 'Entrada' : 'Saída'}
              </Button>
            </div>
          </form>
        )}
      </Dialog>

      {/* History Modal */}
      <Dialog
        isOpen={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        title={`Extrato: ${selectedProductHistory?.name}`}
      >
        <div className="space-y-4">
          {loadingHistory ? (
            <div className="py-8 text-center text-gray-500 dark:text-gray-400">Carregando histórico...</div>
          ) : movementsHistory.length === 0 ? (
            <div className="py-8 text-center text-gray-500 dark:text-gray-400 flex flex-col items-center">
              <AlertCircle className="h-8 w-8 mb-2 opacity-50" />
              Nenhuma movimentação registrada.
            </div>
          ) : (
            <div className="max-h-[300px] overflow-y-auto border rounded-md dark:border-gray-700">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Data</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="text-right">Qtd</TableHead>
                    <TableHead className="text-right">Usuário</TableHead>
                  </TableRow>
                </TableHeader>
                <tbody>
                  {movementsHistory.map((mov) => (
                    <TableRow key={mov.id}>
                      <TableCell className="text-xs">
                        {new Date(mov.date).toLocaleDateString('pt-BR')} <br />
                        <span className="text-gray-400">{new Date(mov.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={mov.type === 'IN' ? 'success' : 'destructive'} className="text-[10px] px-1.5 py-0">
                          {mov.type === 'IN' ? 'ENTRADA' : 'SAÍDA'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium text-davus-dark dark:text-gray-100">
                        {mov.type === 'IN' ? '+' : '-'}{mov.quantity}
                      </TableCell>
                      <TableCell className="text-right text-xs text-gray-500 dark:text-gray-400">
                        {mov.user}
                      </TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setHistoryModalOpen(false)}>
              Fechar
            </Button>
          </div>
        </div>
      </Dialog>
      {/* Advanced Filters Modal */}
      <Dialog
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        title="Filtros Avançados"
      >
        <div className="space-y-4">
          <Select
            label="Filtrar por Unidade"
            value={unitFilter}
            onChange={(e) => setUnitFilter(e.target.value)}
            options={[
              { value: 'all', label: 'Todas as Unidades' },
              ...unitOptions
            ]}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Estoque Mínimo"
              type="number"
              min="0"
              value={stockRange.min}
              onChange={(e) => setStockRange(prev => ({ ...prev, min: e.target.value }))}
              placeholder="0"
            />
            <Input
              label="Estoque Máximo"
              type="number"
              min="0"
              value={stockRange.max}
              onChange={(e) => setStockRange(prev => ({ ...prev, max: e.target.value }))}
              placeholder="∞"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="ghost"
              onClick={() => {
                setUnitFilter('');
                setStockRange({ min: '', max: '' });
                setCategoryFilter('');
                setStatusFilter('');
                setSearchInput('');
                setIsFilterModalOpen(false);
              }}
            >
              Limpar Filtros
            </Button>
            <Button onClick={() => setIsFilterModalOpen(false)}>
              Aplicar Filtros
            </Button>
          </div>
        </div>
      </Dialog>
    </div >
  );
};
