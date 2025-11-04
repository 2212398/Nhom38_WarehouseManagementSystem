import { Request, Response } from 'express';
import logger from '../../../shared/utils/logger';

/**
 * Sales Order Controller
 * Handles sales orders and purchase orders
 */
export class SalesOrderController {
  /**
   * Get all orders
   * @route GET /api/v1/outbound/orders
   */
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;
      const type = req.query.type as string; // 'outbound', 'inbound', or undefined for all
      const skip = (page - 1) * pageSize;

      // Mock orders data
      const mockOrders = [
        {
          id: '1',
          orderNumber: 'SO-2024-0001',
          type: 'outbound',
          customer: 'ABC Electronics Ltd',
          orderDate: '2024-11-01',
          expectedDate: '2024-11-05',
          status: 'pending',
          totalItems: 25,
          totalAmount: 125000000,
          warehouse: 'Hanoi Main Warehouse'
        },
        {
          id: '2',
          orderNumber: 'SO-2024-0002',
          type: 'outbound',
          customer: 'XYZ Technology Co',
          orderDate: '2024-10-30',
          expectedDate: '2024-11-03',
          status: 'processing',
          totalItems: 50,
          totalAmount: 340000000,
          warehouse: 'HCMC Central Warehouse'
        },
        {
          id: '3',
          orderNumber: 'PO-2024-0001',
          type: 'inbound',
          supplier: 'Dell Vietnam',
          orderDate: '2024-10-28',
          expectedDate: '2024-11-10',
          status: 'confirmed',
          totalItems: 100,
          totalAmount: 850000000,
          warehouse: 'Hanoi Main Warehouse'
        },
        {
          id: '4',
          orderNumber: 'SO-2024-0003',
          type: 'outbound',
          customer: 'Tech Store Chain',
          orderDate: '2024-10-25',
          expectedDate: '2024-10-28',
          status: 'shipped',
          totalItems: 75,
          totalAmount: 560000000,
          warehouse: 'Danang Warehouse'
        },
        {
          id: '5',
          orderNumber: 'PO-2024-0002',
          type: 'inbound',
          supplier: 'Apple Vietnam',
          orderDate: '2024-10-20',
          expectedDate: '2024-11-15',
          status: 'pending',
          totalItems: 200,
          totalAmount: 1250000000,
          warehouse: 'HCMC Central Warehouse'
        },
        {
          id: '6',
          orderNumber: 'SO-2024-0004',
          type: 'outbound',
          customer: 'Mobile World',
          orderDate: '2024-10-22',
          expectedDate: '2024-10-25',
          status: 'delivered',
          totalItems: 30,
          totalAmount: 180000000,
          warehouse: 'Hanoi Main Warehouse'
        }
      ];

      // Filter by type
      let filtered = mockOrders;
      if (type) {
        filtered = mockOrders.filter(order => order.type === type);
      }

      const total = filtered.length;
      const items = filtered.slice(skip, skip + pageSize);

      res.status(200).json({
        success: true,
        data: items,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize)
        }
      });

      logger.info(`Retrieved ${items.length} orders`);
    } catch (error: any) {
      logger.error('Error getting orders:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve orders',
        error: error.message
      });
    }
  }

  /**
   * Get order by ID
   * @route GET /api/v1/outbound/orders/:id
   */
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const mockOrder = {
        id,
        orderNumber: 'SO-2024-0001',
        type: 'outbound',
        customer: 'ABC Electronics Ltd',
        orderDate: '2024-11-01',
        expectedDate: '2024-11-05',
        status: 'pending',
        totalItems: 25,
        totalAmount: 125000000,
        warehouse: 'Hanoi Main Warehouse',
        items: [
          {
            sku: 'PROD-001',
            productName: 'Laptop Dell XPS 13',
            quantity: 10,
            unitPrice: 35000000,
            totalPrice: 350000000
          },
          {
            sku: 'PROD-002',
            productName: 'iPhone 15 Pro Max',
            quantity: 15,
            unitPrice: 30000000,
            totalPrice: 450000000
          }
        ]
      };

      res.status(200).json({
        success: true,
        data: mockOrder
      });

      logger.info(`Retrieved order: ${mockOrder.orderNumber}`);
    } catch (error: any) {
      logger.error('Error getting order:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve order',
        error: error.message
      });
    }
  }
}

export default new SalesOrderController();
