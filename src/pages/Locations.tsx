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
  const [newLocation, setNewLocation] = useState({
    name: '',
    address: '',
    manager: '',
    start_date: '',
    expected_end_date: '',
    description: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await LocationService.getLocations();
    setLocations(data);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocation.name) return;
    await LocationService.createLocation(newLocation);
    setIsModalOpen(false);
    setNewLocation({ name: '', address: '', manager: '', start_date: '', expected_end_date: '', description: '' });
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
                <TableHead>Nome da Obra</TableHead>
                <TableHead>Endereço</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <tbody>
              {locations.map(loc => (
                <TableRow key={loc.id} className={!loc.active ? 'opacity-50' : ''}>
                  <TableCell className="font-medium flex items-center gap-2 text-davus-dark dark:text-gray-100">
                    <MapPin size={16} className="text-davus-primary" />
                    <div>
                      <div>{loc.name}</div>
                      {loc.description && <div className="text-xs text-gray-400 font-normal">{loc.description}</div>}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600 dark:text-gray-300">{loc.address || '-'}</TableCell>
                  <TableCell className="text-sm text-gray-600 dark:text-gray-300">{loc.manager || '-'}</TableCell>
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
            label="Nome da Obra / Local"
            placeholder="Ex: Residencial Flores"
            value={newLocation.name}
            onChange={e => setNewLocation({ ...newLocation, name: e.target.value })}
            required
          />
          <Input
            label="Endereço"
            placeholder="Rua, Número, Bairro"
            value={newLocation.address}
            onChange={e => setNewLocation({ ...newLocation, address: e.target.value })}
          />
          <Input
            label="Responsável / Engenheiro"
            placeholder="Nome do responsável"
            value={newLocation.manager}
            onChange={e => setNewLocation({ ...newLocation, manager: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Data Início"
              type="date"
              value={newLocation.start_date}
              onChange={e => setNewLocation({ ...newLocation, start_date: e.target.value })}
            />
            <Input
              label="Previsão Término"
              type="date"
              value={newLocation.expected_end_date}
              onChange={e => setNewLocation({ ...newLocation, expected_end_date: e.target.value })}
            />
          </div>
          <Input
            label="Descrição / Observações"
            placeholder="Detalhes adicionais..."
            value={newLocation.description}
            onChange={e => setNewLocation({ ...newLocation, description: e.target.value })}
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