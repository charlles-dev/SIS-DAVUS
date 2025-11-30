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
} from '@/types/types';
import { api } from '@/lib/axios';
import { compressImage } from '@/lib/ImageCompressor';

// --- Services ---

export const AuthService = {
  login: async (username: string): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login/', { username });
    return response.data;
  },
  resetPassword: async (email: string): Promise<void> => {
    await api.post('/auth/password-reset/', { email });
  },
  updateProfile: async (user: Partial<User>): Promise<User> => {
    const response = await api.patch<User>(`/auth/profile/${user.id}/`, user);
    return response.data;
  },
  changePassword: async (oldPass: string, newPass: string): Promise<void> => {
    await api.post('/auth/password-change/', { old_password: oldPass, new_password: newPass });
  }
};

export const InventoryService = {
  getProducts: async (): Promise<Product[]> => {
    const response = await api.get<Product[]>('/inventory/products/');
    return response.data;
  },
  getCategories: async (): Promise<string[]> => {
    const response = await api.get<string[]>('/inventory/categories/');
    return response.data;
  },
  createProduct: async (product: Omit<Product, 'id'>): Promise<Product> => {
    const response = await api.post<Product>('/inventory/products/', product);
    return response.data;
  },
  updateProduct: async (product: Product): Promise<Product> => {
    const response = await api.put<Product>(`/inventory/products/${product.id}/`, product);
    return response.data;
  },
  deleteProduct: async (id: string): Promise<void> => {
    await api.delete(`/inventory/products/${id}/`);
  },
  getProductMovements: async (productId: string): Promise<StockMovement[]> => {
    const response = await api.get<StockMovement[]>(`/inventory/products/${productId}/movements/`);
    return response.data;
  },
  getAllMovements: async (): Promise<StockMovement[]> => {
    const response = await api.get<StockMovement[]>('/inventory/movements/');
    return response.data;
  },
  createMovement: async (productId: string, type: 'IN' | 'OUT', quantity: number, notes: string): Promise<void> => {
    await api.post('/inventory/movements/', {
      product_id: productId,
      type,
      quantity,
      notes
    });
  }
};

export const PurchaseService = {
  getRequests: async (): Promise<PurchaseRequest[]> => {
    const response = await api.get<PurchaseRequest[]>('/purchases/requests/');
    return response.data;
  },
  createRequest: async (request: Omit<PurchaseRequest, 'id' | 'status' | 'created_at' | 'product_name' | 'unit'>): Promise<void> => {
    await api.post('/purchases/requests/', request);
  },
  updateStatus: async (id: string, status: PurchaseStatus): Promise<void> => {
    await api.patch(`/purchases/requests/${id}/`, { status });
  }
};

export const AssetService = {
  getAssets: async (): Promise<Asset[]> => {
    const response = await api.get<Asset[]>('/assets/');
    return response.data;
  },
  getAssetById: async (id: string): Promise<Asset | undefined> => {
    const response = await api.get<Asset>(`/assets/${id}/`);
    return response.data;
  },
  createAsset: async (asset: Omit<Asset, 'id' | 'image'> & { image?: File | string }): Promise<Asset> => {
    // Handle image upload if present
    if (asset.image instanceof File) {
      const compressed = await compressImage(asset.image);
      const formData = new FormData();
      Object.entries(asset).forEach(([key, value]) => {
        if (key === 'image') {
          formData.append('image', compressed);
        } else {
          formData.append(key, String(value));
        }
      });
      const response = await api.post<Asset>('/assets/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    }

    const response = await api.post<Asset>('/assets/', asset);
    return response.data;
  },
  getAssetHistory: async (id: string): Promise<{ date: string, action: string, details: string }[]> => {
    const response = await api.get<{ date: string, action: string, details: string }[]>(`/assets/${id}/history/`);
    return response.data;
  },
  getLocations: async (): Promise<{ id: string, name: string }[]> => {
    const response = await api.get<{ id: string, name: string }[]>('/assets/locations/');
    return response.data;
  },
  transferAsset: async (assetId: string, toLocationId: string): Promise<void> => {
    await api.post(`/assets/${assetId}/transfer/`, { location_id: toLocationId });
  },
  getCheckouts: async (): Promise<Checkout[]> => {
    const response = await api.get<Checkout[]>('/assets/checkouts/');
    return response.data;
  },
  createCheckout: async (data: Omit<Checkout, 'id' | 'asset_tag' | 'asset_name'>): Promise<void> => {
    await api.post('/assets/checkouts/', data);
  },
  returnAsset: async (checkoutId: string): Promise<void> => {
    await api.post(`/assets/checkouts/${checkoutId}/return/`);
  },
  getMaintenanceOrders: async (): Promise<MaintenanceOrder[]> => {
    const response = await api.get<MaintenanceOrder[]>('/assets/maintenance/');
    return response.data;
  },
  createMaintenanceOrder: async (data: Omit<MaintenanceOrder, 'id' | 'asset_tag' | 'asset_name' | 'opened_at' | 'days_open' | 'status'>): Promise<void> => {
    await api.post('/assets/maintenance/', data);
  },
  updateMaintenanceStatus: async (id: string, status: MaintenanceStatus): Promise<void> => {
    await api.patch(`/assets/maintenance/${id}/`, { status });
  }
};

export const LocationService = {
  getLocations: async (): Promise<Location[]> => {
    const response = await api.get<Location[]>('/locations/');
    return response.data;
  },
  createLocation: async (name: string): Promise<void> => {
    await api.post('/locations/', { name });
  },
  toggleStatus: async (id: string): Promise<void> => {
    await api.post(`/locations/${id}/toggle/`);
  }
};

export const AdminService = {
  getUsers: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/admin/users/');
    return response.data;
  },
  createUser: async (user: Omit<User, 'id'>): Promise<void> => {
    await api.post('/admin/users/', user);
  },
  toggleUserStatus: async (id: string): Promise<void> => {
    await api.post(`/admin/users/${id}/toggle/`);
  },
  getAuditLogs: async (): Promise<AuditLog[]> => {
    const response = await api.get<AuditLog[]>('/admin/audit-logs/');
    return response.data;
  },
  importData: async (type: 'INVENTORY' | 'ASSETS', file: File): Promise<{ success: number, errors: number }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await api.post<{ success: number, errors: number }>('/admin/import/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }
};

export const ReportService = {
  getReports: async (): Promise<Report[]> => {
    const response = await api.get<Report[]>('/reports/');
    return response.data;
  },
  generateReport: async (type: ReportType): Promise<void> => {
    await api.post('/reports/generate/', { type });
  }
};

export const DashboardService = {
  getSummary: async (): Promise<DashboardSummary> => {
    const response = await api.get<DashboardSummary>('/dashboard/summary/');
    return response.data;
  },
  getNotifications: async (): Promise<Notification[]> => {
    const response = await api.get<Notification[]>('/dashboard/notifications/');
    return response.data;
  },
  markAsRead: async (): Promise<void> => {
    await api.post('/dashboard/notifications/mark-read/');
  }
};
