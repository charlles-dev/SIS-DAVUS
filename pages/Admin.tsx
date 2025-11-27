import React, { useEffect, useState } from 'react';
import { Plus, UserX, UserCheck, Shield } from 'lucide-react';
import { 
  Button, Input, Badge, Dialog, Select, Table, TableHeader, TableRow, TableHead, TableCell, 
  Card, CardContent 
} from '../components/UI';
import { AdminService } from '../services';
import { User, UserRole } from '../types';

export const AdminPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ full_name: '', username: '', role: UserRole.OPERATOR });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await AdminService.getUsers();
    setUsers(data);
  };

  const handleToggleStatus = async (id: string) => {
    await AdminService.toggleUserStatus(id);
    setUsers(prev => prev.map(u => u.id === id ? { ...u, is_active: !u.is_active } : u));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await AdminService.createUser(newUser);
    setIsModalOpen(false);
    setNewUser({ full_name: '', username: '', role: UserRole.OPERATOR });
    loadData();
  };

  const getRoleBadge = (role: UserRole) => {
     switch(role) {
       case UserRole.ADMIN: return <Badge variant="destructive">Admin</Badge>;
       case UserRole.MANAGER: return <Badge variant="info">Gestor</Badge>;
       case UserRole.OPERATOR: return <Badge variant="secondary">Operador</Badge>;
     }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-davus-dark dark:text-white">Gestão de Usuários</h2>
          <p className="text-gray-500 dark:text-gray-400">Administre o acesso ao sistema.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Novo Usuário
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome Completo</TableHead>
                <TableHead>Usuário / Email</TableHead>
                <TableHead>Função</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <tbody>
              {users.map(u => (
                <TableRow key={u.id} className={!u.is_active ? 'opacity-50' : ''}>
                  <TableCell className="font-medium text-davus-dark dark:text-gray-100">{u.full_name}</TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-300">{u.username}</TableCell>
                  <TableCell>{getRoleBadge(u.role)}</TableCell>
                  <TableCell>
                    <span className={`text-xs font-bold ${u.is_active ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {u.is_active ? 'Ativo' : 'Inativo'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleToggleStatus(u.id)} title={u.is_active ? "Desativar" : "Ativar"}>
                      {u.is_active ? <UserX size={16} className="text-red-500" /> : <UserCheck size={16} className="text-green-500" />}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </CardContent>
      </Card>

      <Dialog isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Novo Usuário">
        <form onSubmit={handleSubmit} className="space-y-4">
           <Input 
             label="Nome Completo" 
             value={newUser.full_name} 
             onChange={e => setNewUser({...newUser, full_name: e.target.value})} 
             required 
           />
           <Input 
             label="Usuário (Login)" 
             value={newUser.username} 
             onChange={e => setNewUser({...newUser, username: e.target.value})} 
             required 
           />
           <Select 
             label="Função"
             value={newUser.role}
             onChange={e => setNewUser({...newUser, role: e.target.value as UserRole})}
             options={[
               { value: UserRole.OPERATOR, label: 'Operador (Almoxarife)' },
               { value: UserRole.MANAGER, label: 'Gestor (Engenheiro)' },
               { value: UserRole.ADMIN, label: 'Administrador' },
             ]}
           />
           <div className="flex justify-end gap-2 mt-4">
             <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
             <Button type="submit">Criar Usuário</Button>
           </div>
        </form>
      </Dialog>
    </div>
  );
};