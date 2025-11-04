import axios from '../utils/axios';
import { LoginCredentials, AuthResponse, User } from '../types';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await axios.post('/auth/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await axios.get<User>('/auth/me');
    return response.data;
  },

  register: async (data: any): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  refreshToken: async (): Promise<{ token: string }> => {
    const response = await axios.post<{ token: string }>('/auth/refresh');
    return response.data;
  },
};
