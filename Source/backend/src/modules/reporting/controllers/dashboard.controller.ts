import { Request, Response } from 'express';
import prisma from '../../../shared/database/prisma.client';
import logger from '../../../shared/utils/logger';

/**
 * Dashboard Controller
 * Provides statistics and overview data
 */
export class DashboardController {
  /**
   * Get dashboard statistics
   * @route GET /api/v1/dashboard/stats
   */
  async getStats(_req: Request, res: Response): Promise<void> {
    try {
      // Get total products count
      const totalProducts = await prisma.products.count({
        where: { deleted_at: null, is_active: true }
      });

      // Get total warehouses count
      const totalWarehouses = await prisma.warehouses.count({
        where: { deleted_at: null, is_active: true }
      });

      // Get total users count
      const totalUsers = await prisma.users.count({
        where: { deleted_at: null, is_active: true }
      });

      // Get active warehouses with capacity
      const warehousesData = await prisma.warehouses.findMany({
        where: { deleted_at: null, is_active: true },
        select: {
          total_capacity: true,
          capacity_uom: true
        }
      });

      // Calculate warehouse utilization (mock for now - would need inventory data)
      const warehouseUtilization = warehousesData.length > 0 ? 78 : 0; // Placeholder

      // Mock low stock items (would need inventory table)
      const lowStockItems = 23;

      // Mock orders (would need orders table)
      const totalOrders = 345;

      const stats = {
        products: {
          total: totalProducts,
          active: totalProducts,
          lowStock: lowStockItems
        },
        warehouses: {
          total: totalWarehouses,
          active: totalWarehouses,
          utilization: warehouseUtilization
        },
        orders: {
          total: totalOrders,
          pending: Math.floor(totalOrders * 0.3),
          processing: Math.floor(totalOrders * 0.4),
          completed: Math.floor(totalOrders * 0.3)
        },
        users: {
          total: totalUsers,
          active: totalUsers
        }
      };

      res.status(200).json({
        success: true,
        data: stats
      });

      logger.info('Dashboard stats retrieved successfully');
    } catch (error: any) {
      logger.error('Error getting dashboard stats:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve dashboard statistics',
        error: error.message
      });
    }
  }

  /**
   * Get recent activities
   * @route GET /api/v1/dashboard/activities
   */
  async getRecentActivities(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 10;

      const activities = await prisma.audit_logs.findMany({
        take: limit,
        orderBy: { performed_at: 'desc' },
        select: {
          id: true,
          table_name: true,
          action: true,
          performed_at: true,
          performed_by: true
        }
      });

      res.status(200).json({
        success: true,
        data: activities
      });

      logger.info(`Retrieved ${activities.length} recent activities`);
    } catch (error: any) {
      logger.error('Error getting recent activities:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve recent activities',
        error: error.message
      });
    }
  }
}

export default new DashboardController();
