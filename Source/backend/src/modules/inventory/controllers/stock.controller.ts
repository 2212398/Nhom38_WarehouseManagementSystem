import { Request, Response } from 'express';
import logger from '../../../shared/utils/logger';

/**
 * Stock/Inventory Controller
 * Handles inventory stock operations
 */
export class StockController {
  /**
   * Get all inventory items
   * @route GET /api/v1/inventory/stock
   */
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;
      const search = req.query.search as string || '';
      const skip = (page - 1) * pageSize;

      // Mock inventory data (would come from inventory table in real implementation)
      const mockInventory = [
        {
          id: '1',
          sku: 'PROD-001',
          productName: 'Laptop Dell XPS 13',
          location: 'WH-HN-A1-01',
          warehouse: 'Hanoi Main Warehouse',
          quantityOnHand: 150,
          quantityReserved: 30,
          quantityAvailable: 120,
          reorderPoint: 50,
          reorderQuantity: 100,
          status: 'in-stock',
          lastUpdated: new Date('2024-11-01')
        },
        {
          id: '2',
          sku: 'PROD-002',
          productName: 'iPhone 15 Pro Max',
          location: 'WH-HN-B2-05',
          warehouse: 'Hanoi Main Warehouse',
          quantityOnHand: 45,
          quantityReserved: 20,
          quantityAvailable: 25,
          reorderPoint: 50,
          reorderQuantity: 200,
          status: 'low-stock',
          lastUpdated: new Date('2024-11-02')
        },
        {
          id: '3',
          sku: 'PROD-003',
          productName: 'Samsung Galaxy S24 Ultra',
          location: 'WH-DN-A3-12',
          warehouse: 'Danang Warehouse',
          quantityOnHand: 0,
          quantityReserved: 0,
          quantityAvailable: 0,
          reorderPoint: 30,
          reorderQuantity: 150,
          status: 'out-of-stock',
          lastUpdated: new Date('2024-10-30')
        },
        {
          id: '4',
          sku: 'PROD-004',
          productName: 'MacBook Pro 16"',
          location: 'WH-HCM-C1-08',
          warehouse: 'HCMC Central Warehouse',
          quantityOnHand: 200,
          quantityReserved: 50,
          quantityAvailable: 150,
          reorderPoint: 40,
          reorderQuantity: 80,
          status: 'in-stock',
          lastUpdated: new Date('2024-11-02')
        },
        {
          id: '5',
          sku: 'PROD-005',
          productName: 'iPad Pro 12.9"',
          location: 'WH-HCM-C2-15',
          warehouse: 'HCMC Central Warehouse',
          quantityOnHand: 35,
          quantityReserved: 10,
          quantityAvailable: 25,
          reorderPoint: 40,
          reorderQuantity: 100,
          status: 'low-stock',
          lastUpdated: new Date('2024-11-01')
        }
      ];

      // Filter by search
      let filtered = mockInventory;
      if (search) {
        filtered = mockInventory.filter(item => 
          item.sku.toLowerCase().includes(search.toLowerCase()) ||
          item.productName.toLowerCase().includes(search.toLowerCase()) ||
          item.location.toLowerCase().includes(search.toLowerCase())
        );
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

      logger.info(`Retrieved ${items.length} inventory items`);
    } catch (error: any) {
      logger.error('Error getting inventory:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve inventory',
        error: error.message
      });
    }
  }

  /**
   * Get low stock items
   * @route GET /api/v1/inventory/stock/low-stock
   */
  async getLowStock(_req: Request, res: Response): Promise<void> {
    try {
      const mockLowStock = [
        {
          id: '2',
          sku: 'PROD-002',
          productName: 'iPhone 15 Pro Max',
          quantityOnHand: 45,
          reorderPoint: 50,
          status: 'low-stock'
        },
        {
          id: '5',
          sku: 'PROD-005',
          productName: 'iPad Pro 12.9"',
          quantityOnHand: 35,
          reorderPoint: 40,
          status: 'low-stock'
        }
      ];

      res.status(200).json({
        success: true,
        data: mockLowStock
      });

      logger.info('Retrieved low stock items');
    } catch (error: any) {
      logger.error('Error getting low stock:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve low stock items',
        error: error.message
      });
    }
  }
}

export default new StockController();
