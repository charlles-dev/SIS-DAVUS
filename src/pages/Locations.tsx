import React, { useEffect, useState } from 'react';
import { Plus, MapPin, Power } from 'lucide-react';
import { 
  Button, Input, Table, TableHeader, TableRow, TableHead, TableCell, 
  Card, CardContent, Dialog 
} from '../components/UI';
import { LocationService } from '@/api/services';
import { Location } from '@/types/types';

export const LocationsPage: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLocationName, setNewLocationName] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await LocationService.getLocations();
    setLocations(data);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!newLocationName) return;
    await LocationService.createLocation(newLocationName);
    setIsModalOpen(false);
    setNewLocationName('');
    loadData();
  };

  const handleToggle = async (id: string) => {
    await LocationService.toggleStatus(id);
    loadData(); // or local update
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-davus-dark dark:text-white">Locais e Obras</h2>
          <p className="text-gray-500 dark:text-gray-400">Gerencie os centros de custo e locais de armazenamento.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Nova Obra
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID / Código</TableHead>
                <TableHead>Nome da Obra</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <tbody>
              {locations.map(loc => (
                <TableRow key={loc.id} className={!loc.active ? 'opacity-50' : ''}>
                  <TableCell className="font-mono text-xs text-gray-500 dark:text-gray-400">{loc.id}</TableCell>
                  <TableCell className="font-medium flex items-center gap-2 text-davus-dark dark:text-gray-100">
                    <MapPin size={16} className="text-davus-primary" />
                    {loc.name}
                  </TableCell>
                  <TableCell>
                    <span className={`text-xs font-bold px-2 py-1 rounded ${loc.active ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}>
                      {loc.active ? 'ATIVO' : 'INATIVO'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleToggle(loc.id)}>
                      <Power size={14} className="mr-2" />
                      {loc.active ? 'Desativar' : 'Ativar'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </CardContent>
      </Card>

      <Dialog isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nova Obra / Local">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input 
            label="Nome do Local" 
            placeholder="Ex: Residencial Flores" 
            value={newLocationName}
            onChange={e => setNewLocationName(e.target.value)}
            required
          />
          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button type="submit">Cadastrar</Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};