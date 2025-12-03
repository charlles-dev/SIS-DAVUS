
import React, { useEffect, useState, Suspense } from 'react';
import { Plus, QrCode, MapPin, Search, ArrowRightLeft, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Dialog } from '@/components/ui/Dialog';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Skeleton } from '@/components/ui/Skeleton';
import { Table, TableHeader, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Pagination } from '@/components/ui/Pagination';
import { MobileCard } from '../components/MobileCard';
import { ImageUpload } from '../components/Shared';
const QRScannerLazy = React.lazy(() => import('../components/QRScanner').then(m => ({ default: m.QRScanner })));
import { useAssets } from '../hooks/useAssets';
import { Asset, AssetStatus, AssetFormValues } from '@/types/types';
import { assetSchema } from '@/lib/schemas';
import { useDebounce } from '../hooks/useDebounce';
import { toast } from 'sonner';

export const AssetsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    assets,
    locations,
    isLoading: loading,
    createAsset,
    transferAsset,
    isSubmitting: isCreating // Renamed for clarity in this component's context
  } = useAssets();

  // Filters
  const [locationFilter, setLocationFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const searchFilter = useDebounce(searchInput, 300);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modals
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [selectedAssetQr, setSelectedAssetQr] = useState<Asset | null>(null);

  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [selectedAssetTransfer, setSelectedAssetTransfer] = useState<Asset | null>(null);
  const [targetLocation, setTargetLocation] = useState('');
  // isTransferring state is now managed by useAssets hook's isSubmitting

  // New Asset Modal
  const [newAssetModalOpen, setNewAssetModalOpen] = useState(false);
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<AssetFormValues>({
    resolver: zodResolver(assetSchema) as any
  });

  // Scanner
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  // Removed manual loadData useEffect as useAssets handles it

  const getStatusBadge = (status: AssetStatus) => {
    switch (status) {
      case AssetStatus.AVAILABLE: return <Badge variant="success">Disponível</Badge>;
      case AssetStatus.IN_USE: return <Badge variant="info">Em Uso</Badge>;
      case AssetStatus.MAINTENANCE: return <Badge variant="warning">Manutenção</Badge>;
      case AssetStatus.DISCARDED: return <Badge variant="destructive">Descartado</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const openQrModal = (e: React.MouseEvent, asset: Asset) => {
    e.stopPropagation();
    setSelectedAssetQr(asset);
    setQrModalOpen(true);
  };

  const openTransferModal = (e: React.MouseEvent, asset: Asset) => {
    e.stopPropagation();
    setSelectedAssetTransfer(asset);
    setTargetLocation(''); // Reset
    setTransferModalOpen(true);
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssetTransfer || !targetLocation) return;

    // isCreating (mapped from isSubmitting) handles the loading state
    try {
      await transferAsset({ assetId: selectedAssetTransfer.id, locationId: targetLocation });
      setTransferModalOpen(false);
      // Toast handled in hook
    } catch (error) {
      // Toast handled in hook
    }
  };

  const handleSaveAsset = async (data: AssetFormValues) => {
    // isCreating (mapped from isSubmitting) handles the loading state
    try {
      await createAsset(data);
      setNewAssetModalOpen(false);
      reset();
      // Toast handled in hook
    } catch (error) {
      // Toast handled in hook
    }
  };

  const handleScan = (code: string) => {
    setIsScannerOpen(false);
    const found = assets.find(a => a.asset_tag === code || a.id === code);
    if (found) {
      navigate(`/app/assets/${found.id}`);
    } else {
      toast.warning(`Ativo com código ${code} não encontrado.`);
    }
  };

  const filteredAssets = assets.filter(asset => {
    const matchesSearch =
      (asset.name?.toLowerCase() || '').includes(searchFilter.toLowerCase()) ||
      (asset.asset_tag?.toLowerCase() || '').includes(searchFilter.toLowerCase()) ||
      (asset.brand?.toLowerCase() || '').includes(searchFilter.toLowerCase());

    const matchesLocation = locationFilter === '' || locationFilter === 'all' || asset.location_id === locationFilter;
    const matchesStatus = statusFilter === '' || statusFilter === 'all' || asset.status === statusFilter;

    return matchesSearch && matchesLocation && matchesStatus;
  });

  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);
  const paginatedAssets = filteredAssets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const statusOptions = Object.values(AssetStatus).map(s => ({ value: s, label: s }));
  const locationOptions = locations.map(l => ({ value: l.id, label: l.name }));
  const getLocationName = (id?: string) => {
    if (!id) return 'Sem Local';
    const loc = locations.find(l => l.id === id);
    return loc?.name || 'Sem Local';
  };
  const getLocationTooltip = (id?: string) => {
    const loc = locations.find(l => l.id === id);
    if (!loc) return 'Local não definido';
    const parts = [loc.name, loc.address, loc.manager].filter(Boolean);
    return parts.join(' • ');
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-davus-dark dark:text-white">Patrimônio</h2>
          <p className="text-gray-500 dark:text-gray-400">Gestão de ativos, equipamentos e ferramentas.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsScannerOpen(true)}>
            <QrCode className="mr-2 h-4 w-4" /> Escanear
          </Button>
          <Button onClick={() => setNewAssetModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Novo Ativo
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base text-davus-dark dark:text-gray-100">Listagem de Ativos</CardTitle>
            </div>

            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Buscar por Nome, Tag ou Marca..."
                  className="pl-9"
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              <div className="w-full md:w-48">
                <Select
                  value={locationFilter}
                  onChange={(e) => { setLocationFilter(e.target.value); setCurrentPage(1); }}
                  options={[
                    { value: 'all', label: 'Todas as Obras' },
                    ...locationOptions
                  ]}
                />
              </div>
              <div className="w-full md:w-48">
                <Select
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                  options={[
                    { value: 'all', label: 'Todos os Status' },
                    ...statusOptions
                  ]}
                />
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
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">Img</TableHead>
                      <TableHead>Tag</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Marca</TableHead>
                      <TableHead>Localização</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <tbody>
                    {paginatedAssets.map((asset) => (
                      <TableRow
                        key={asset.id}
                        className="text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                        onClick={() => navigate(`/app/assets/${asset.id}`)}
                      >
                        <TableCell>
                          {asset.image ? (
                            <img
                              src={asset.image}
                              alt={asset.name}
                              className="h-8 w-8 rounded-md object-cover border border-gray-200 dark:border-gray-700"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                              <ImageIcon className="h-4 w-4" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-mono text-xs text-gray-500 dark:text-gray-400 font-medium">{asset.asset_tag}</TableCell>
                        <TableCell className="font-medium text-davus-dark dark:text-gray-100">{asset.name}</TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-400">{asset.brand}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400 text-xs" title={getLocationTooltip(asset.location_id)}>
                            <MapPin className="h-3 w-3" />
                            <span className="font-medium text-gray-900 dark:text-gray-200">{getLocationName(asset.location_id)}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(asset.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => openQrModal(e, asset)} title="Ver QR Code">
                              <QrCode className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => openTransferModal(e, asset)} title="Transferir Local">
                              <ArrowRightLeft className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" title="Detalhes">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {paginatedAssets.length === 0 && (
                      <TableRow>
                        <TableCell className="h-24 text-center" colSpan={7}>
                          Nenhum ativo encontrado com os filtros atuais.
                        </TableCell>
                      </TableRow>
                    )}
                  </tbody>

                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {paginatedAssets.map((asset) => (
                  <MobileCard
                    key={asset.id}
                    title={asset.name}
                    subtitle={asset.asset_tag}
                    status={asset.status}
                    statusVariant={
                      asset.status === 'AVAILABLE' ? 'success' :
                        asset.status === 'IN_USE' ? 'info' :
                          asset.status === 'MAINTENANCE' ? 'warning' : 'destructive'
                    }
                    image={asset.image}
                    details={[
                      { label: 'Marca', value: asset.brand },
                      { label: 'Local', value: getLocationName(asset.location_id) }
                    ]}
                    actions={
                      <>
                        <Button size="sm" variant="ghost" onClick={(e) => openQrModal(e, asset)}>
                          <QrCode className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={(e) => openTransferModal(e, asset)}>
                          <ArrowRightLeft className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => navigate(`/app/assets/${asset.id}`)}>
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </>
                    }
                    onClick={() => navigate(`/app/assets/${asset.id}`)}
                  />
                ))}
                {paginatedAssets.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Nenhum ativo encontrado com os filtros atuais.
                  </div>
                )}
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* QR Code Modal */}
      <Dialog
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        title="Código QR do Ativo"
      >
        {selectedAssetQr && (
          <div className="flex flex-col items-center justify-center space-y-4 py-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${selectedAssetQr.asset_tag}`}
                alt="QR Code"
                className="w-48 h-48"
              />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-lg text-davus-dark dark:text-white">{selectedAssetQr.asset_tag}</h3>
              <p className="text-gray-500 dark:text-gray-400">{selectedAssetQr.name}</p>
            </div>
            <Button onClick={() => window.print()} variant="outline" className="w-full">
              Imprimir Etiqueta
            </Button>
          </div>
        )}
      </Dialog>

      {/* Scanner Modal */}
      {isScannerOpen && (
        <Suspense fallback={<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-davus-primary"></div></div>}>
          <QRScannerLazy onScan={handleScan} onClose={() => setIsScannerOpen(false)} />
        </Suspense>
      )}

      {/* New Asset Modal */}
      <Dialog isOpen={newAssetModalOpen} onClose={() => setNewAssetModalOpen(false)} title="Novo Ativo">
        <form onSubmit={handleSubmit(handleSaveAsset)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block dark:text-gray-200">Foto do Ativo</label>
              <ImageUpload onFileSelect={(file) => setValue('image', file)} />
            </div>
            <Input
              label="Nome do Ativo"
              {...register('name')}
              error={errors.name?.message}
              placeholder="Ex: Furadeira Makita"
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Marca"
                {...register('brand')}
                error={errors.brand?.message}
                placeholder="Ex: Dell"
                required
              />
              <Input
                label="Tag do Ativo"
                {...register('asset_tag')}
                error={errors.asset_tag?.message}
                placeholder="Ex: NTB-001"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Localização Inicial"
                options={locationOptions}
                {...register('location_id')}
                error={errors.location_id?.message}
                placeholder="Selecione a localização"
                required
              />
              <Select
                label="Status Inicial"
                options={statusOptions}
                {...register('status')}
                error={errors.status?.message}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Data de Compra"
                type="date"
                {...register('purchase_date')}
                error={errors.purchase_date?.message}
                required
              />
              <Input
                label="Valor de Compra (R$)"
                type="number"
                step="0.01"
                {...register('purchase_value')}
                error={errors.purchase_value?.message}
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <Button type="button" variant="outline" onClick={() => setNewAssetModalOpen(false)}>Cancelar</Button>
            <Button type="submit" isLoading={isCreating}>Salvar Ativo</Button>
          </div>
        </form>
      </Dialog>

      {/* Transfer Modal */}
      <Dialog
        isOpen={transferModalOpen}
        onClose={() => setTransferModalOpen(false)}
        title="Transferência de Local"
      >
        {selectedAssetTransfer && (
          <form onSubmit={handleTransfer} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md border border-gray-100 dark:border-gray-600">
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Ativo</label>
                <p className="font-medium text-sm truncate text-davus-dark dark:text-white">{selectedAssetTransfer.name}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Local Atual</label>
                <div className="flex items-center text-sm font-medium text-davus-primary" title={getLocationTooltip(selectedAssetTransfer.location_id)}>
                  <MapPin className="h-3 w-3 mr-1" />
                  <span className="font-medium text-gray-900 dark:text-gray-200">{getLocationName(selectedAssetTransfer.location_id)}</span>
                </div>
              </div>
            </div>

            <Select
              label="Nova Localização (Destino)"
              value={targetLocation}
              onChange={(e) => setTargetLocation(e.target.value)}
              options={locationOptions.filter(l => l.value !== selectedAssetTransfer.location_id)}
              placeholder="Selecione o destino..."
              required
            />

            <div className="flex justify-end gap-3 mt-4">
              <Button type="button" variant="outline" onClick={() => setTransferModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" isLoading={isCreating} disabled={!targetLocation}>
                Confirmar Transferência
              </Button>
            </div>
          </form>
        )}
      </Dialog>
    </div >
  );
};
