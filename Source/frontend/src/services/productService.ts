import axios from '../utils/axios';
import { Product, PaginatedResponse, PaginationParams, TableFilters } from '../types';

export const productService = {
  getProducts: async (
    pagination: PaginationParams,
    filters?: TableFilters
  ): Promise<PaginatedResponse<Product>> => {
    const params = { ...pagination, ...filters };
    const response = await axios.get<PaginatedResponse<Product>>('/master-data/products', { params });
    return response.data;
  },

  getProduct: async (id: string): Promise<Product> => {
    const response = await axios.get<Product>(`/master-data/products/${id}`);
    return response.data;
  },

  createProduct: async (data: Partial<Product>): Promise<Product> => {
    const response = await axios.post<Product>('/master-data/products', data);
    return response.data;
  },

  updateProduct: async (id: string, data: Partial<Product>): Promise<Product> => {
    const response = await axios.put<Product>(`/master-data/products/${id}`, data);
    return response.data;
  },

  deleteProduct: async (id: string): Promise<void> => {
    await axios.delete(`/master-data/products/${id}`);
  },

  getLowStock: async (): Promise<Product[]> => {
    const response = await axios.get<Product[]>('/master-data/products/low-stock');
    return response.data;
  },
};
