
// Enums based on TDD and DB Schema

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  OPERATOR = 'OPERATOR',
}

export enum UnitType {
  M3 = 'M3',
  SC = 'SC',
  BL = 'BL',
  KG = 'KG',
  UN = 'UN',
  TB = 'TB',
  MIL = 'MIL',
  L = 'L',
}

export enum AssetStatus {
  AVAILABLE = 'AVAILABLE',
  IN_USE = 'IN_USE',
  MAINTENANCE = 'MAINTENANCE',
  DISCARDED = 'DISCARDED',
}

export enum PurchaseStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  ORDERED = 'ORDERED',
  DELIVERED = 'DELIVERED',
  REJECTED = 'REJECTED',
}

export enum ReportType {
  INVENTORY = 'INVENTORY',
  ASSETS = 'ASSETS',
  MAINTENANCE_COSTS = 'MAINTENANCE_COSTS',
  QR_CODES = 'QR_CODES',
}

export enum MaintenanceStatus {
  BROKEN = 'BROKEN', // Aguardando Envio
  OPEN = 'OPEN', // Na Oficina
  WAITING_PAYMENT = 'WAITING_PAYMENT', // Aguardando Pagamento
  COMPLETED = 'COMPLETED' // Concluído
}

// Interfaces

export interface User {
  id: string;
  username: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
  must_change_password?: boolean;
  cpf?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  unit: UnitType;
  current_stock: number;
  min_threshold: number;
  last_updated?: string;
}

export interface Asset {
  id: string;
  name: string;
  asset_tag: string;
  brand: string;
  location_id: string;
  status: AssetStatus;
  image?: string;
  purchase_date?: string;
  purchase_value?: number;
}

export interface AssetFormValues {
  name: string;
  asset_tag: string;
  brand: string;
  category: string;
  status: AssetStatus;
  location_id: string;
  purchase_date: string;
  purchase_value: number;
  serial_number?: string;
  notes?: string;
  image?: any;
}

export interface StockMovement {
  id: string;
  product_id: string;
  product_name?: string; // Helper for UI
  type: 'IN' | 'OUT';
  quantity: number;
  date: string;
  user: string;
  notes?: string;
}

export interface PurchaseRequest {
  id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit: UnitType;
  requested_by: string;
  status: PurchaseStatus;
  created_at: string;
  notes?: string;
}

export interface Checkout {
  id: string;
  asset_id: string;
  asset_name: string;
  asset_tag: string;
  worker_name: string;
  checked_out_at: string;
  expected_return?: string;
  returned_at?: string;
}

export interface Report {
  id: string;
  type: ReportType;
  requested_at: string;
  status: 'PROCESSING' | 'COMPLETED' | 'ERROR';
  download_url?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface DashboardSummary {
  alerts: {
    low_stock_count: number;
    maintenance_count: number;
  };
  financial: {
    total_asset_value: number;
    maintenance_cost_month: number;
  };
  location_distribution: Array<{ location: string; count: number }>;
}

export interface Location {
  id: string;
  name: string;
  address?: string;
  manager?: string;
  start_date?: string;
  expected_end_date?: string;
  description?: string;
  active: boolean;
}

export interface MaintenanceOrder {
  id: string;
  asset_id: string;
  asset_name: string;
  asset_tag: string;
  vendor: string;
  description: string;
  cost: number;
  status: MaintenanceStatus;
  opened_at: string;
  days_open: number;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  resource: string;
  details: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'INVENTORY' | 'ASSET' | 'MAINTENANCE';
}
