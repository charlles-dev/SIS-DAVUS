
import { 
  Product, 
  Asset, 
  UnitType, 
  AssetStatus, 
  UserRole, 
  LoginResponse,
  DashboardSummary,
  StockMovement,
  PurchaseRequest,
  PurchaseStatus,
  Checkout,
  User,
  Report,
  ReportType,
  Location,
  MaintenanceOrder,
  MaintenanceStatus,
  AuditLog,
  Notification
} from './types';

const DELAY = 600;

// --- Mock Data ---

let mockProducts: Product[] = [
  { id: '1', name: 'Cimento CP II', category: 'Civil', unit: UnitType.SC, current_stock: 450, min_threshold: 100 },
  { id: '2', name: 'Areia Média', category: 'Civil', unit: UnitType.M3, current_stock: 12, min_threshold: 15 },
  { id: '3', name: 'Tubo PVC 100mm', category: 'Hidráulica', unit: UnitType.TB, current_stock: 30, min_threshold: 10 },
  { id: '4', name: 'Luva de Proteção', category: 'EPI', unit: UnitType.UN, current_stock: 5, min_threshold: 20 },
  { id: '5', name: 'Tijolo Cerâmico', category: 'Civil', unit: UnitType.MIL, current_stock: 2.5, min_threshold: 1 },
];

let mockAssets: Asset[] = [
  { 
    id: '1', 
    name: 'Furadeira de Impacto', 
    asset_tag: 'DAV-0001', 
    brand: 'Makita', 
    location_id: 'BAHARI', 
    status: AssetStatus.AVAILABLE, 
    purchase_value: 450.00,
    image: 'https://placehold.co/100x100/png?text=Furadeira'
  },
  { 
    id: '2', 
    name: 'Betoneira 400L', 
    asset_tag: 'DAV-0002', 
    brand: 'CSM', 
    location_id: 'BAHARI', 
    status: AssetStatus.IN_USE, 
    purchase_value: 3200.00,
    image: 'https://placehold.co/100x100/png?text=Betoneira'
  },
  { 
    id: '3', 
    name: 'Martelete Rompedor', 
    asset_tag: 'DAV-0003', 
    brand: 'Bosch', 
    location_id: 'SEDE', 
    status: AssetStatus.MAINTENANCE, 
    purchase_value: 1200.00 
  },
  { 
    id: '4', 
    name: 'Nível a Laser', 
    asset_tag: 'DAV-0004', 
    brand: 'Dewalt', 
    location_id: 'ALOJAMENTO', 
    status: AssetStatus.AVAILABLE, 
    purchase_value: 890.00,
    image: 'https://placehold.co/100x100/png?text=Nivel'
  },
];

let mockMovements: StockMovement[] = [
  { id: '101', product_id: '1', product_name: 'Cimento CP II', type: 'IN', quantity: 500, date: '2023-10-01T08:00:00', user: 'Admin', notes: 'Compra Nota 123' },
  { id: '102', product_id: '1', product_name: 'Cimento CP II', type: 'OUT', quantity: 50, date: '2023-10-05T14:30:00', user: 'Joao', notes: 'Concretagem Laje 1' },
  { id: '103', product_id: '2', product_name: 'Areia Média', type: 'IN', quantity: 20, date: '2023-10-02T09:00:00', user: 'Admin' },
  { id: '104', product_id: '4', product_name: 'Luva de Proteção', type: 'IN', quantity: 100, date: '2023-09-15T10:00:00', user: 'Admin' },
  { id: '105', product_id: '4', product_name: 'Luva de Proteção', type: 'OUT', quantity: 95, date: '2023-10-20T16:00:00', user: 'Pedro' },
];

let mockRequests: PurchaseRequest[] = [
  { id: '1', product_id: '1', product_name: 'Cimento CP II', quantity: 100, unit: UnitType.SC, requested_by: 'João Silva', status: PurchaseStatus.PENDING, created_at: new Date().toISOString(), notes: 'Para estoque de segurança' },
  { id: '2', product_id: '3', product_name: 'Tubo PVC 100mm', quantity: 50, unit: UnitType.TB, requested_by: 'Mestre Obras', status: PurchaseStatus.APPROVED, created_at: '2023-10-25T10:00:00', notes: 'Urgente para prumada' },
  { id: '3', product_id: '4', product_name: 'Luva de Proteção', quantity: 200, unit: UnitType.UN, requested_by: 'Segurança', status: PurchaseStatus.DELIVERED, created_at: '2023-10-01T09:00:00' },
];

let mockCheckouts: Checkout[] = [
  { id: '1', asset_id: '2', asset_name: 'Betoneira 400L', asset_tag: 'DAV-0002', worker_name: 'José Pedreiro', checked_out_at: '2023-10-26T07:00:00', expected_return: '2023-10-30T17:00:00' }
];

let mockUsers: User[] = [
  { id: '1', username: 'admin', full_name: 'Administrador Davus', role: UserRole.ADMIN, is_active: true },
  { id: '2', username: 'gestor', full_name: 'Gestor de Obras', role: UserRole.MANAGER, is_active: true },
  { id: '3', username: 'operador', full_name: 'João Almoxarife', role: UserRole.OPERATOR, is_active: true },
];

let mockReports: Report[] = [
  { id: '1', type: ReportType.INVENTORY, requested_at: '2023-10-27T08:00:00', status: 'COMPLETED', download_url: '#' },
  { id: '2', type: ReportType.MAINTENANCE_COSTS, requested_at: '2023-10-27T08:30:00', status: 'PROCESSING' }
];

let mockLocations: Location[] = [
  { id: 'BAHARI', name: 'Edifício Bahari', active: true },
  { id: 'SEDE', name: 'Sede Administrativa', active: true },
  { id: 'ALOJAMENTO', name: 'Alojamento Operacional', active: true },
  { id: 'OFICINA', name: 'Oficina Central', active: true },
];

let mockMaintenanceOrders: MaintenanceOrder[] = [
  { id: '1', asset_id: '3', asset_name: 'Martelete Rompedor', asset_tag: 'DAV-0003', vendor: 'Oficina do Zé', description: 'Troca de carvão', cost: 150.00, status: MaintenanceStatus.OPEN, opened_at: '2023-10-20T08:00:00', days_open: 7 },
  { id: '2', asset_id: '1', asset_name: 'Furadeira', asset_tag: 'DAV-0001', vendor: 'Assistência Técnica', description: 'Cabo rompido', cost: 80.00, status: MaintenanceStatus.WAITING_PAYMENT, opened_at: '2023-10-15T09:00:00', days_open: 12 },
];

let mockAuditLogs: AuditLog[] = [
  { id: '1', timestamp: '2023-10-27T10:00:00', user: 'admin', action: 'CREATE', resource: 'Produto: Cimento', details: 'Criou novo produto' },
  { id: '2', timestamp: '2023-10-27T10:05:00', user: 'gestor', action: 'UPDATE', resource: 'Ativo: Betoneira', details: 'Transferiu para BAHARI' },
];

let mockNotifications: Notification[] = [
  { id: '1', title: 'Estoque Baixo', message: 'Cimento CP II atingiu o nível mínimo.', time: 'há 2 horas', read: false, type: 'INVENTORY' },
  { id: '2', title: 'Manutenção Atrasada', message: 'Martelete Rompedor está na oficina há 7 dias.', time: 'há 1 dia', read: false, type: 'MAINTENANCE' },
];

// --- Services ---

export const AuthService = {
  login: async (username: string): Promise<LoginResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          token: 'mock-jwt-token-xyz',
          user: {
            id: 'u1',
            username,
            full_name: 'João da Silva',
            role: UserRole.MANAGER, 
          }
        });
      }, DELAY);
    });
  },
  resetPassword: async (email: string): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, DELAY));
  },
  updateProfile: async (user: Partial<User>): Promise<User> => {
    return new Promise((resolve) => setTimeout(() => {
      resolve({
        id: 'u1',
        username: 'admin',
        full_name: user.full_name || 'João da Silva',
        role: UserRole.MANAGER,
        ...user
      } as User);
    }, DELAY));
  },
  changePassword: async (oldPass: string, newPass: string): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, DELAY));
  }
};

export const InventoryService = {
  getProducts: async (): Promise<Product[]> => {
    return new Promise((resolve) => setTimeout(() => resolve([...mockProducts]), DELAY));
  },
  getCategories: async (): Promise<string[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(['Civil', 'Hidráulica', 'Elétrica', 'EPI', 'Ferramentas', 'Pintura']), DELAY));
  },
  createProduct: async (product: Omit<Product, 'id'>): Promise<Product> => {
     return new Promise((resolve) => setTimeout(() => {
       const newP = { ...product, id: Math.random().toString() };
       mockProducts.push(newP);
       resolve(newP);
     }, DELAY));
  },
  updateProduct: async (product: Product): Promise<Product> => {
    return new Promise((resolve) => setTimeout(() => {
      mockProducts = mockProducts.map(p => p.id === product.id ? product : p);
      resolve(product);
    }, DELAY));
  },
  deleteProduct: async (id: string): Promise<void> => {
    return new Promise((resolve) => setTimeout(() => {
      mockProducts = mockProducts.filter(p => p.id !== id);
      resolve();
    }, DELAY));
  },
  getProductMovements: async (productId: string): Promise<StockMovement[]> => {
    return new Promise((resolve) => setTimeout(() => {
      resolve(mockMovements.filter(m => m.product_id === productId).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    }, DELAY));
  },
  getAllMovements: async (): Promise<StockMovement[]> => {
    return new Promise((resolve) => setTimeout(() => {
      resolve(mockMovements.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    }, DELAY));
  },
  createMovement: async (productId: string, type: 'IN' | 'OUT', quantity: number, notes: string): Promise<void> => {
    return new Promise((resolve) => setTimeout(() => {
      const product = mockProducts.find(p => p.id === productId);
      if (product) {
        if (type === 'IN') product.current_stock += quantity;
        else product.current_stock -= quantity;
        
        mockMovements.unshift({
          id: Math.random().toString(),
          product_id: productId,
          product_name: product.name,
          type,
          quantity,
          date: new Date().toISOString(),
          user: 'Atual',
          notes
        });
      }
      resolve();
    }, DELAY));
  }
};

export const PurchaseService = {
  getRequests: async (): Promise<PurchaseRequest[]> => {
    return new Promise((resolve) => setTimeout(() => resolve([...mockRequests]), DELAY));
  },
  createRequest: async (request: Omit<PurchaseRequest, 'id' | 'status' | 'created_at' | 'product_name' | 'unit'>): Promise<void> => {
    return new Promise((resolve) => setTimeout(() => {
      const product = mockProducts.find(p => p.id === request.product_id);
      if(product) {
         mockRequests.push({
           ...request,
           id: Math.random().toString(),
           product_name: product.name,
           unit: product.unit,
           status: PurchaseStatus.PENDING,
           created_at: new Date().toISOString()
         });
      }
      resolve();
    }, DELAY));
  },
  updateStatus: async (id: string, status: PurchaseStatus): Promise<void> => {
    return new Promise((resolve) => setTimeout(() => {
      const req = mockRequests.find(r => r.id === id);
      if (req) {
        req.status = status;
        if (status === PurchaseStatus.DELIVERED) {
           // Auto generate stock movement
           const product = mockProducts.find(p => p.id === req.product_id);
           if (product) {
             product.current_stock += req.quantity;
             mockMovements.unshift({
               id: Math.random().toString(),
               product_id: req.product_id,
               product_name: req.product_name,
               type: 'IN',
               quantity: req.quantity,
               date: new Date().toISOString(),
               user: 'Sistema (Entrega)',
               notes: `Entrega Solicitação #${req.id}`
             });
           }
        }
      }
      resolve();
    }, DELAY));
  }
};

export const AssetService = {
  getAssets: async (): Promise<Asset[]> => {
    return new Promise((resolve) => setTimeout(() => resolve([...mockAssets]), DELAY));
  },
  getAssetById: async (id: string): Promise<Asset | undefined> => {
    return new Promise((resolve) => setTimeout(() => resolve(mockAssets.find(a => a.id === id)), DELAY));
  },
  createAsset: async (asset: Omit<Asset, 'id'>): Promise<Asset> => {
    return new Promise((resolve) => setTimeout(() => {
      const newAsset = { ...asset, id: Math.random().toString() };
      mockAssets.push(newAsset);
      resolve(newAsset);
    }, DELAY));
  },
  getAssetHistory: async (id: string): Promise<{date: string, action: string, details: string}[]> => {
    return new Promise((resolve) => setTimeout(() => resolve([
      { date: '2023-10-27', action: 'Transferência', details: 'Para BAHARI' },
      { date: '2023-09-15', action: 'Compra', details: 'NF 1234' }
    ]), DELAY));
  },
  getLocations: async (): Promise<{id: string, name: string}[]> => {
    return new Promise((resolve) => setTimeout(() => resolve([...mockLocations]), DELAY));
  },
  transferAsset: async (assetId: string, toLocationId: string): Promise<void> => {
      return new Promise((resolve) => setTimeout(resolve, DELAY));
  },
  getCheckouts: async (): Promise<Checkout[]> => {
    return new Promise((resolve) => setTimeout(() => resolve([...mockCheckouts]), DELAY));
  },
  createCheckout: async (data: Omit<Checkout, 'id' | 'asset_tag' | 'asset_name'>): Promise<void> => {
    return new Promise((resolve) => setTimeout(() => {
      const asset = mockAssets.find(a => a.id === data.asset_id);
      if(asset) {
        mockCheckouts.push({
          ...data,
          id: Math.random().toString(),
          asset_name: asset.name,
          asset_tag: asset.asset_tag
        });
        asset.status = AssetStatus.IN_USE;
      }
      resolve();
    }, DELAY));
  },
  returnAsset: async (checkoutId: string): Promise<void> => {
    return new Promise((resolve) => setTimeout(() => {
      mockCheckouts = mockCheckouts.filter(c => c.id !== checkoutId);
      resolve();
    }, DELAY));
  },
  getMaintenanceOrders: async (): Promise<MaintenanceOrder[]> => {
    return new Promise((resolve) => setTimeout(() => resolve([...mockMaintenanceOrders]), DELAY));
  },
  createMaintenanceOrder: async (data: Omit<MaintenanceOrder, 'id' | 'asset_tag' | 'asset_name' | 'opened_at' | 'days_open' | 'status'>): Promise<void> => {
    return new Promise((resolve) => setTimeout(() => {
      const asset = mockAssets.find(a => a.id === data.asset_id);
      if (asset) {
        mockMaintenanceOrders.push({
          ...data,
          id: Math.random().toString(),
          asset_name: asset.name,
          asset_tag: asset.asset_tag,
          status: MaintenanceStatus.BROKEN,
          opened_at: new Date().toISOString(),
          days_open: 0
        });
        asset.status = AssetStatus.MAINTENANCE;
      }
      resolve();
    }, DELAY));
  },
  updateMaintenanceStatus: async (id: string, status: MaintenanceStatus): Promise<void> => {
     return new Promise((resolve) => setTimeout(() => {
       const order = mockMaintenanceOrders.find(o => o.id === id);
       if (order) order.status = status;
       resolve();
     }, DELAY));
  }
};

export const LocationService = {
  getLocations: async (): Promise<Location[]> => {
    return new Promise((resolve) => setTimeout(() => resolve([...mockLocations]), DELAY));
  },
  createLocation: async (name: string): Promise<void> => {
    return new Promise((resolve) => setTimeout(() => {
      mockLocations.push({ id: name.toUpperCase(), name, active: true });
      resolve();
    }, DELAY));
  },
  toggleStatus: async (id: string): Promise<void> => {
    return new Promise((resolve) => setTimeout(() => {
      const loc = mockLocations.find(l => l.id === id);
      if(loc) loc.active = !loc.active;
      resolve();
    }, DELAY));
  }
};

export const AdminService = {
  getUsers: async (): Promise<User[]> => {
    return new Promise((resolve) => setTimeout(() => resolve([...mockUsers]), DELAY));
  },
  createUser: async (user: Omit<User, 'id'>): Promise<void> => {
    return new Promise((resolve) => setTimeout(() => {
      mockUsers.push({ ...user, id: Math.random().toString(), is_active: true });
      resolve();
    }, DELAY));
  },
  toggleUserStatus: async (id: string): Promise<void> => {
    return new Promise((resolve) => setTimeout(() => {
      const u = mockUsers.find(u => u.id === id);
      if(u) u.is_active = !u.is_active;
      resolve();
    }, DELAY));
  },
  getAuditLogs: async (): Promise<AuditLog[]> => {
    return new Promise((resolve) => setTimeout(() => resolve([...mockAuditLogs]), DELAY));
  },
  importData: async (type: 'INVENTORY' | 'ASSETS', file: File): Promise<{success: number, errors: number}> => {
    return new Promise((resolve) => setTimeout(() => {
      resolve({ success: 154, errors: 3 });
    }, 2000));
  }
};

export const ReportService = {
  getReports: async (): Promise<Report[]> => {
    return new Promise((resolve) => setTimeout(() => resolve([...mockReports]), DELAY));
  },
  generateReport: async (type: ReportType): Promise<void> => {
    return new Promise((resolve) => setTimeout(() => {
      mockReports.unshift({
        id: Math.random().toString(),
        type,
        requested_at: new Date().toISOString(),
        status: 'PROCESSING'
      });
      resolve();
    }, DELAY));
  }
};

export const DashboardService = {
  getSummary: async (): Promise<DashboardSummary> => {
    return new Promise((resolve) => setTimeout(() => resolve({
      alerts: {
        low_stock_count: 12,
        maintenance_count: 3
      },
      financial: {
        total_asset_value: 154000.00,
        maintenance_cost_month: 1200.00
      },
      location_distribution: [
        { location: 'BAHARI', count: 45 },
        { location: 'ALOJAMENTO', count: 12 },
        { location: 'SEDE', count: 8 },
      ]
    }), DELAY));
  },
  getNotifications: async (): Promise<Notification[]> => {
    return new Promise((resolve) => setTimeout(() => resolve([...mockNotifications]), DELAY));
  },
  markAsRead: async (): Promise<void> => {
    return new Promise((resolve) => {
       mockNotifications = mockNotifications.map(n => ({...n, read: true}));
       resolve();
    });
  }
};
