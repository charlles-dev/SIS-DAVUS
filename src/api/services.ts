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
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/useAuthStore';

const withTimeout = async <T>(promise: PromiseLike<T>, ms = 10000): Promise<T> => {
  const timeout = new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), ms));
  return Promise.race([promise, timeout]);
};

export const AuthService = {
  login: async (username: string, password?: string): Promise<LoginResponse> => {
    const loginPromise = async () => {
      let email = username;

      // Check if input is CPF (only digits)
      const isCpf = /^\d+$/.test(username.replace(/\D/g, ''));
      if (isCpf) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
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
    };

    // Race between login and a timeout
    let timeoutId: NodeJS.Timeout;
    const timeoutPromise = new Promise<LoginResponse>((_, reject) => {
      timeoutId = setTimeout(() => {
        console.error('Login timed out after 20s');
        reject(new Error('Conexão lenta ou servidor em wake-up. Tente novamente em instantes.'));
      }, 20000);
    });

    try {
      console.log('Starting login race...');
      const result = await Promise.race([loginPromise(), timeoutPromise]);
      clearTimeout(timeoutId!); // Clear timeout on success
      return result;
    } catch (error) {
      clearTimeout(timeoutId!); // Clear timeout on error
      throw error;
    }
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
    const { data, error } = await withTimeout(supabase
      .from('products')
      .select('*')
      .order('name'));
    if (error) throw error;
    return data || [];
  },
  getCategories: async (): Promise<string[]> => {
    const { data, error } = await supabase
      .from('products')
      .select('category');
    if (error) throw error;
    // Unique categories
    const categories = Array.from(new Set(data?.map(p => p.category) || []));
    return categories;
  },
  createProduct: async (product: Omit<Product, 'id'>): Promise<Product> => {
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  updateProduct: async (product: Product): Promise<Product> => {
    const { data, error } = await supabase
      .from('products')
      .update(product)
      .eq('id', product.id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  deleteProduct: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
  getProductMovements: async (productId: string): Promise<StockMovement[]> => {
    const { data, error } = await supabase
      .from('stock_movements')
      .select('*, products(name)')
      .eq('product_id', productId)
      .order('date', { ascending: false });

    if (error) throw error;

    return data.map((m: any) => ({
      ...m,
      product_name: m.products?.name
    }));
  },
  getAllMovements: async (): Promise<StockMovement[]> => {
    const { data, error } = await supabase
      .from('stock_movements')
      .select('*, products(name)')
      .order('date', { ascending: false });

    if (error) throw error;

    return data.map((m: any) => ({
      ...m,
      product_name: m.products?.name
    }));
  },
  createMovement: async (productId: string, type: 'IN' | 'OUT', quantity: number, notes: string): Promise<void> => {
    const user = (await supabase.auth.getUser()).data.user;
    const { error } = await supabase
      .from('stock_movements')
      .insert({
        product_id: productId,
        type,
        quantity,
        notes,
        user_id: user?.id
      });
    if (error) throw error;
  }
};

export const PurchaseService = {
  getRequests: async (): Promise<PurchaseRequest[]> => {
    const { data, error } = await supabase
      .from('purchase_requests')
      .select('*, products(name, unit)')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map((r: any) => ({
      ...r,
      product_name: r.products?.name,
      unit: r.unit || r.products?.unit // Fallback to product unit if not in request
    }));
  },
  createRequest: async (request: Omit<PurchaseRequest, 'id' | 'status' | 'created_at' | 'product_name' | 'unit'>): Promise<void> => {
    // Fetch product unit first
    const { data: product } = await supabase
      .from('products')
      .select('unit')
      .eq('id', request.product_id)
      .single();

    const { error } = await supabase
      .from('purchase_requests')
      .insert({
        ...request,
        unit: product?.unit || 'UN'
      });

    if (error) throw error;
  },
  updateStatus: async (id: string, status: PurchaseStatus): Promise<void> => {
    const { error } = await supabase
      .from('purchase_requests')
      .update({ status })
      .eq('id', id);

    if (error) throw error;
  }
};

export const AssetService = {
  getAssets: async (): Promise<Asset[]> => {
    const { data, error } = await withTimeout(supabase
      .from('assets')
      .select('*')
      .order('name'));
    if (error) throw error;
    return data || [];
  },
  getAssetById: async (id: string): Promise<Asset | undefined> => {
    const { data, error } = await withTimeout(supabase
      .from('assets')
      .select('*')
      .eq('id', id)
      .single());
    if (error) throw error;
    return data;
  },
  createAsset: async (asset: Omit<Asset, 'id' | 'image'> & { image?: File | string }): Promise<Asset> => {
    let imageUrl = '';

    // Handle image upload if present
    if (asset.image instanceof File) {
      const file = asset.image;
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('assets')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        // Continue without image or throw? Let's continue.
      } else {
        const { data: { publicUrl } } = supabase.storage
          .from('assets')
          .getPublicUrl(filePath);
        imageUrl = publicUrl;
      }
    } else if (typeof asset.image === 'string') {
      imageUrl = asset.image;
    }

    const { data, error } = await supabase
      .from('assets')
      .insert({
        ...asset,
        image: imageUrl
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },
  getAssetHistory: async (id: string): Promise<{ date: string, action: string, details: string }[]> => {
    // Aggregate history from checkouts and maintenance
    const { data: checkouts } = await supabase
      .from('checkouts')
      .select('*')
      .eq('asset_id', id);

    const { data: maintenance } = await supabase
      .from('maintenance_orders')
      .select('*')
      .eq('asset_id', id);

    const history: { date: string, action: string, details: string }[] = [];

    checkouts?.forEach(c => {
      history.push({
        date: c.checked_out_at,
        action: 'CHECKOUT',
        details: `Retirado por ${c.worker_name}`
      });
      if (c.returned_at) {
        history.push({
          date: c.returned_at,
          action: 'RETURN',
          details: `Devolvido por ${c.worker_name}`
        });
      }
    });

    maintenance?.forEach(m => {
      history.push({
        date: m.opened_at,
        action: 'MAINTENANCE',
        details: `Manutenção: ${m.description} (${m.status})`
      });
    });

    return history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },
  getLocations: async (): Promise<{ id: string, name: string }[]> => {
    const { data, error } = await withTimeout(supabase
      .from('locations')
      .select('id, name')
      .eq('active', true)
      .order('name'));
    if (error) throw error;
    return data || [];
  },
  transferAsset: async (assetId: string, toLocationId: string): Promise<void> => {
    const { error } = await supabase
      .from('assets')
      .update({ location_id: toLocationId })
      .eq('id', assetId);
    if (error) throw error;
  },
  getCheckouts: async (): Promise<Checkout[]> => {
    const { data, error } = await supabase
      .from('checkouts')
      .select('*, assets(name, asset_tag)')
      .order('checked_out_at', { ascending: false });

    if (error) throw error;

    return data.map((c: any) => ({
      ...c,
      asset_name: c.assets?.name,
      asset_tag: c.assets?.asset_tag
    }));
  },
  createCheckout: async (data: Omit<Checkout, 'id' | 'asset_tag' | 'asset_name'>): Promise<void> => {
    const { error } = await supabase
      .from('checkouts')
      .insert(data);
    if (error) throw error;

    // Update asset status
    await supabase
      .from('assets')
      .update({ status: AssetStatus.IN_USE })
      .eq('id', data.asset_id);
  },
  returnAsset: async (checkoutId: string): Promise<void> => {
    const { data: checkout } = await supabase
      .from('checkouts')
      .update({ returned_at: new Date().toISOString() })
      .eq('id', checkoutId)
      .select()
      .single();

    if (checkout) {
      await supabase
        .from('assets')
        .update({ status: AssetStatus.AVAILABLE })
        .eq('id', checkout.asset_id);
    }
  },
  getMaintenanceOrders: async (): Promise<MaintenanceOrder[]> => {
    const { data, error } = await supabase
      .from('maintenance_orders')
      .select('*, assets(name, asset_tag)')
      .order('opened_at', { ascending: false });

    if (error) throw error;

    return data.map((m: any) => ({
      ...m,
      asset_name: m.assets?.name,
      asset_tag: m.assets?.asset_tag,
      days_open: Math.floor((new Date().getTime() - new Date(m.opened_at).getTime()) / (1000 * 60 * 60 * 24))
    }));
  },
  createMaintenanceOrder: async (data: Omit<MaintenanceOrder, 'id' | 'asset_tag' | 'asset_name' | 'opened_at' | 'days_open' | 'status'>): Promise<void> => {
    const { error } = await supabase
      .from('maintenance_orders')
      .insert({
        ...data,
        status: MaintenanceStatus.OPEN
      });
    if (error) throw error;

    await supabase
      .from('assets')
      .update({ status: AssetStatus.MAINTENANCE })
      .eq('id', data.asset_id);
  },
  updateMaintenanceStatus: async (id: string, status: MaintenanceStatus): Promise<void> => {
    const { data: order, error } = await supabase
      .from('maintenance_orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    if (status === MaintenanceStatus.COMPLETED && order) {
      await supabase
        .from('assets')
        .update({ status: AssetStatus.AVAILABLE })
        .eq('id', order.asset_id);
    }
  }
};

export const LocationService = {
  getLocations: async (): Promise<Location[]> => {
    const { data, error } = await withTimeout(supabase
      .from('locations')
      .select('*')
      .order('name'));

    if (error) throw error;
    return data || [];
  },
  createLocation: async (location: Omit<Location, 'id' | 'active'>): Promise<void> => {
    const { error } = await supabase
      .from('locations')
      .insert(location);

    if (error) throw error;
  },
  toggleStatus: async (id: string): Promise<void> => {
    // First get current status
    const { data: location } = await supabase
      .from('locations')
      .select('active')
      .eq('id', id)
      .single();

    if (location) {
      const { error } = await supabase
        .from('locations')
        .update({ active: !location.active })
        .eq('id', id);

      if (error) throw error;
    }
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
    // Placeholder: In a real app, query a 'reports' table
    return [];
  },
  generateReport: async (type: ReportType): Promise<void> => {
    alert('Relatórios serão implementados em breve.');
  }
};

export const DashboardService = {
  getSummary: async (): Promise<DashboardSummary> => {
    // Ensure session is ready (fixes race condition with optimistic auth)
    await supabase.auth.getSession();

    // Try to get from cache first
    try {
      const cachedRaw = localStorage.getItem('dashboard_summary');
      if (cachedRaw) {
        const cached = JSON.parse(cachedRaw);
        if (cached && cached.ts && Date.now() - cached.ts < 60000) {
          return cached.data as DashboardSummary;
        }
      }
    } catch (_) { }

    // Fetch fresh data with timeout
    const [
      { count: lowStockCount },
      { count: maintenanceCount },
      { data: assets },
      { data: maintenanceOrders },
      { data: locations }
    ] = await withTimeout(Promise.all([
      supabase.from('products').select('*', { count: 'exact', head: true }).lt('current_stock', 10),
      supabase.from('assets').select('*', { count: 'exact', head: true }).eq('status', AssetStatus.MAINTENANCE),
      supabase.from('assets').select('purchase_value, location_id'),
      supabase.from('maintenance_orders').select('cost, opened_at'),
      supabase.from('locations').select('id, name')
    ]), 20000);

    const totalAssetValue = assets?.reduce((sum, a) => sum + (Number(a.purchase_value) || 0), 0) || 0;

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const maintenanceCostMonth = maintenanceOrders?.reduce((sum, m) => {
      const date = new Date(m.opened_at);
      if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
        return sum + (Number(m.cost) || 0);
      }
      return sum;
    }, 0) || 0;

    const locationMap = new Map<string, number>();
    assets?.forEach(a => {
      if (a.location_id) {
        locationMap.set(a.location_id, (locationMap.get(a.location_id) || 0) + 1);
      }
    });

    const locationDistribution = locations?.map(l => ({
      location: l.name,
      count: locationMap.get(l.id) || 0
    })) || [];

    const result = {
      alerts: {
        low_stock_count: lowStockCount || 0,
        maintenance_count: maintenanceCount || 0
      },
      financial: {
        total_asset_value: totalAssetValue,
        maintenance_cost_month: maintenanceCostMonth
      },
      location_distribution: locationDistribution
    };
    try {
      localStorage.setItem('dashboard_summary', JSON.stringify({ ts: Date.now(), data: result }));
    } catch (_) { }
    return result;
  },
  getNotifications: async (): Promise<Notification[]> => {
    // Generate notifications dynamically from data
    const notifications: Notification[] = [];

    // Low stock
    const { data: lowStock } = await supabase
      .from('products')
      .select('name, current_stock, min_threshold')
      .lt('current_stock', 10) // Simplified logic
      .limit(5);

    lowStock?.forEach(p => {
      if (p.current_stock < p.min_threshold) {
        notifications.push({
          id: `stock-${p.name}`,
          title: 'Estoque Baixo',
          message: `O produto ${p.name} está com estoque baixo (${p.current_stock}).`,
          time: new Date().toISOString(),
          read: false,
          type: 'INVENTORY'
        });
      }
    });

    // Maintenance
    const { data: maintenance } = await supabase
      .from('maintenance_orders')
      .select('*, assets(name)')
      .eq('status', MaintenanceStatus.OPEN)
      .limit(5);

    maintenance?.forEach((m: any) => {
      notifications.push({
        id: `maint-${m.id}`,
        title: 'Manutenção em Aberto',
        message: `Manutenção do ativo ${m.assets?.name} está em aberto.`,
        time: m.opened_at,
        read: false,
        type: 'MAINTENANCE'
      });
    });

    return notifications;
  },
  markAsRead: async (): Promise<void> => {
    // No-op since notifications are dynamic
  }
};
export const DiagnosticsService = {
  ping: async (): Promise<{ ok: boolean; details?: string }> => {
    try {
      const url = (import.meta as any).env.VITE_SUPABASE_URL;
      const key = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;
      if (!url || !key) return { ok: false, details: 'Credenciais ausentes' };
      const { error } = await withTimeout(supabase.from('profiles').select('id', { count: 'exact', head: true }).limit(1), 15000);
      if (error) return { ok: false, details: error.message };
      return { ok: true };
    } catch (e: any) {
      return { ok: false, details: e?.message || 'Falha desconhecida' };
    }
  }
};
