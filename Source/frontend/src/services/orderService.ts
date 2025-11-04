import axios from '../utils/axios';

export interface Order {
  id: string;
  orderNumber: string;
  type: 'outbound' | 'inbound';
  customer?: string;
  supplier?: string;
  orderDate: string;
  expectedDate: string;
  status: string;
  totalItems: number;
  totalAmount: number;
  warehouse: string;
}

export const orderService = {
  getOrders: async (page: number = 1, pageSize: number = 10, type?: string) => {
    const response = await axios.get('/outbound/so', {
      params: { page, pageSize, type }
    });
    return response.data;
  },

  getOrderById: async (id: string) => {
    const response = await axios.get(`/outbound/so/${id}`);
    return response.data;
  }
};
