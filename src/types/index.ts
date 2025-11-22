export type DocumentType = 'RECEIPT' | 'DELIVERY' | 'TRANSFER' | 'ADJUSTMENT';
export type DocumentStatus = 'DRAFT' | 'WAITING' | 'READY' | 'DONE' | 'CANCELED';

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  currentStock: number;
  minStockThreshold: number;
  price: number;
  unit: string;
}

export interface Document {
  id: string;
  type: DocumentType;
  status: DocumentStatus;
  reference: string;
  date: string;
  items: DocumentItem[];
}

export interface DocumentItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
}

export interface DashboardStats {
  totalProducts: number;
  lowStock: number;
  pendingReceipts: number;
  pendingDeliveries: number;
  scheduledTransfers: number;
}
