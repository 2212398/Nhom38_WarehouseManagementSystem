import axios from '../utils/axios';

export interface InventoryItem {
  id: string;
  sku: string;
  productName: string;
  location: string;
  warehouse: string;
  quantityOnHand: number;
  quantityReserved: number;
  quantityAvailable: number;
  reorderPoint: number;
  reorderQuantity: number;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
  lastUpdated: Date;
}

export const inventoryService = {
  getInventory: async (page: number = 1, pageSize: number = 10, search: string = '') => {
    const response = await axios.get('/inventory/stock', {
      params: { page, pageSize, search }
    });
    return response.data;
  },

  getLowStock: async () => {
    const response = await axios.get('/inventory/stock/low-stock');
    return response.data;
  }
};
