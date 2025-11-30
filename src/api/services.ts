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

import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/useAuthStore';

export const AuthService = {
  login: async (username: string, password?: string): Promise<LoginResponse> => {
    let email = username;

    // Check if input is CPF (only digits)
    const isCpf = /^\d+$/.test(username.replace(/\D/g, ''));
    if (isCpf) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('username') // username field in profiles stores the email (historical naming) or we should use email if we added it. 
        // Wait, profiles.username was storing the email/username. 
        // Let's check handle_new_user trigger. It stores email in username column.
        .eq('cpf', username.replace(/\D/g, ''))
        .single();

      if (profile) {
        email = profile.username;
      }
    } else if (!username.includes('@')) {
      email = `${username}@davus.com`;
    }

    if (!password) {
      throw new Error("Password is required for Supabase auth");
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    if (!data.user || !data.session) throw new Error("Login failed: No user or session returned");

    const user: User = {
      id: data.user.id,
      username: data.user.user_metadata.username || data.user.email || '',
      full_name: data.user.user_metadata.full_name || '',
      role: data.user.user_metadata.role || UserRole.OPERATOR,
      is_active: true
    };

    // Check profile for must_change_password
    const { data: profile } = await supabase
      .from('profiles')
      .select('must_change_password')
      .eq('id', user.id)
      .single();

    return {
      token: data.session.access_token,
      user: {
        ...user,
        must_change_password: profile?.must_change_password
      }
    };
  },
  resetPassword: async (email: string): Promise<void> => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  },
  updateProfile: async (user: Partial<User>): Promise<User> => {
    const { data, error } = await supabase.auth.updateUser({
      data: {
        full_name: user.full_name,
        role: user.role,
        // other metadata
      }
    });
    if (error) throw error;
    if (!data.user) throw new Error("User not found");

    return {
      id: data.user.id,
      username: data.user.user_metadata.username || data.user.email || '',
      full_name: data.user.user_metadata.full_name || '',
      role: data.user.user_metadata.role || UserRole.OPERATOR,
      is_active: true
    };
  },
  changePassword: async (oldPass: string, newPass: string): Promise<void> => {
    const { error } = await supabase.auth.updateUser({ password: newPass });
    if (error) throw error;

    // Update profile to disable must_change_password
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ must_change_password: false })
      .eq('id', (await supabase.auth.getUser()).data.user?.id);

    if (profileError) console.error("Failed to update profile status", profileError);

    // Update local store
    const user = useAuthStore.getState().user;
    if (user) {
      useAuthStore.getState().login({
        token: (await supabase.auth.getSession()).data.session?.access_token || '',
        user: { ...user, must_change_password: false }
      });
    }
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
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('full_name');

    if (error) throw error;

    return data.map(profile => ({
      id: profile.id,
      username: profile.username || '',
      full_name: profile.full_name || '',
      role: profile.role as UserRole,
      is_active: profile.is_active
    }));
  },
  createUser: async (user: Omit<User, 'id'> & { password?: string, cpf?: string }): Promise<void> => {
    const { error } = await supabase.functions.invoke('create-user', {
      body: {
        email: user.username, // Assuming username is now email
        password: user.password || '123456',
        full_name: user.full_name,
        role: user.role,
        cpf: user.cpf
      }
    });

    if (error) throw error;
  },
  toggleUserStatus: async (id: string): Promise<void> => {
    // First get current status
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_active')
      .eq('id', id)
      .single();

    if (profile) {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: !profile.is_active })
        .eq('id', id);

      if (error) throw error;
    }
  },
  deleteUser: async (userId: string): Promise<void> => {
    const { error } = await supabase.functions.invoke('delete-user', {
      body: { user_id: userId }
    });

    if (error) throw error;
  },
  getAuditLogs: async (): Promise<AuditLog[]> => {
    // Mock for now or implement audit logs table later
    return [];
  },
  importData: async (type: 'INVENTORY' | 'ASSETS', file: File): Promise<{ success: number, errors: number }> => {
    // Implement import logic later
    return { success: 0, errors: 0 };
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
