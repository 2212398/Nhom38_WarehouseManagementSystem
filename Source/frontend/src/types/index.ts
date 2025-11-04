// User & Authentication Types
export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  role: UserRole;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  WAREHOUSE_STAFF = 'warehouse_staff',
  VIEWER = 'viewer',
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

// Product Types
export interface Product {
  id: string;
  sku: string;
  name: string;
  description?: string;
  category: string;
  uom: string;
  quantity: number;
  reorderLevel: number;
  price: number;
  supplierId?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

// Warehouse Types
export interface Warehouse {
  id: string;
  code: string;
  name: string;
  address: string;
  capacity: number;
  currentUtilization: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface Location {
  id: string;
  warehouseId: string;
  code: string;
  zone: string;
  aisle: string;
  rack: string;
  level: string;
  capacity: number;
  occupied: number;
  status: 'available' | 'occupied' | 'reserved';
}

// Inventory Types
export interface StockItem {
  id: string;
  productId: string;
  warehouseId: string;
  locationId: string;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  batchNumber?: string;
  expiryDate?: string;
  lastUpdated: string;
}

// Order Types
export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  warehouseId: string;
  status: 'pending' | 'approved' | 'received' | 'cancelled';
  orderDate: string;
  expectedDate?: string;
  receivedDate?: string;
  items: OrderItem[];
  totalAmount: number;
  createdBy: string;
  createdAt: string;
}

export interface SalesOrder {
  id: string;
  soNumber: string;
  customerId: string;
  warehouseId: string;
  status: 'pending' | 'confirmed' | 'picked' | 'packed' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  deliveryDate?: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: string;
  createdBy: string;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

// Dashboard Types
export interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  lowStockItems: number;
  warehouseUtilization: number;
  todayReceiving: number;
  todayShipping: number;
  pendingPurchaseOrders: number;
  pendingSalesOrders: number;
  activeOrders: number;
  pendingShipments: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
  }[];
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Filter & Search Types
export interface TableFilters {
  search?: string;
  status?: string;
  category?: string;
  warehouseId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
