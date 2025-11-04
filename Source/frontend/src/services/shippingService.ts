import axios from '../utils/axios';

export interface Shipment {
  id: string;
  shipmentNumber: string;
  orderNumber: string;
  customer: string;
  carrier: string;
  trackingNumber: string;
  origin: string;
  destination: string;
  shipDate: string;
  expectedDelivery: string;
  status: 'pending' | 'in-transit' | 'delivered' | 'delayed';
  weight: number;
  dimensions: string;
}

export const shippingService = {
  getShipments: async (page: number = 1, pageSize: number = 10) => {
    const response = await axios.get('/outbound/shipping', {
      params: { page, pageSize }
    });
    return response.data;
  },

  trackShipment: async (trackingNumber: string) => {
    const response = await axios.get(`/outbound/shipping/track/${trackingNumber}`);
    return response.data;
  }
};
