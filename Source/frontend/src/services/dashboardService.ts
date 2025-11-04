import axios from '../utils/axios';
import { DashboardStats, ChartData, ApiResponse } from '../types';

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await axios.get<ApiResponse<DashboardStats>>('/reports/dashboard/stats');
    return response.data.data;
  },

  getInventoryChart: async (period: string = '7d'): Promise<ChartData> => {
    const response = await axios.get<ChartData>(`/reports/dashboard/inventory-chart?period=${period}`);
    return response.data;
  },

  getOrdersChart: async (period: string = '30d'): Promise<ChartData> => {
    const response = await axios.get<ChartData>(`/reports/dashboard/orders-chart?period=${period}`);
    return response.data;
  },

  getRecentActivities: async (): Promise<any[]> => {
    const response = await axios.get<any[]>('/reports/dashboard/recent-activities');
    return response.data;
  },
};
