import axios from '../utils/axios';

export interface Settings {
  company: {
    name: string;
    email: string;
    phone: string;
    address: string;
    taxCode?: string;
    website?: string;
  };
  notifications: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    lowStockAlerts: boolean;
    orderStatusUpdates: boolean;
    systemAlerts: boolean;
  };
  inventory: {
    autoReorder: boolean;
    reorderThreshold: number;
    defaultWarehouse: string;
    stockCountFrequency: string;
    enableBarcodeScanning: boolean;
    requireSerialNumbers: boolean;
  };
  system: {
    language: string;
    timezone: string;
    dateFormat: string;
    currency: string;
    fiscalYearStart: string;
  };
}

export const settingsService = {
  getSettings: async () => {
    const response = await axios.get('/admin/settings');
    return response.data;
  },

  updateSettings: async (settings: Partial<Settings>) => {
    const response = await axios.put('/admin/settings', settings);
    return response.data;
  }
};
