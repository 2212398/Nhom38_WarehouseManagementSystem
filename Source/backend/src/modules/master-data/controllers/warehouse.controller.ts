import { Request, Response } from 'express';
import prisma from '../../../shared/database/prisma.client';
import logger from '../../../shared/utils/logger';

/**
 * Warehouse Controller
 * Handles warehouse management operations
 */
export class WarehouseController {
  /**
   * Get all warehouses
   * @route GET /api/v1/warehouses
   */
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;
      const skip = (page - 1) * pageSize;

      const where = { deleted_at: null };

      const total = await prisma.warehouses.count({ where });

      const warehouses = await prisma.warehouses.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { created_at: 'desc' }
      });

      res.status(200).json({
        success: true,
        data: warehouses,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize)
        }
      });

      logger.info(`Retrieved ${warehouses.length} warehouses`);
    } catch (error: any) {
      logger.error('Error getting warehouses:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve warehouses',
        error: error.message
      });
    }
  }

  /**
   * Get warehouse by ID
   * @route GET /api/v1/warehouses/:id
   */
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const warehouse = await prisma.warehouses.findFirst({
        where: { id, deleted_at: null }
      });

      if (!warehouse) {
        res.status(404).json({
          success: false,
          message: 'Warehouse not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: warehouse
      });

      logger.info(`Retrieved warehouse: ${warehouse.code}`);
    } catch (error: any) {
      logger.error('Error getting warehouse:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve warehouse',
        error: error.message
      });
    }
  }

  /**
   * Create warehouse
   * @route POST /api/v1/warehouses
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const warehouseData = req.body;

      // Check if code exists
      const existing = await prisma.warehouses.findUnique({
        where: { code: warehouseData.code }
      });

      if (existing && !existing.deleted_at) {
        res.status(400).json({
          success: false,
          message: 'Warehouse with this code already exists'
        });
        return;
      }

      const warehouse = await prisma.warehouses.create({
        data: warehouseData
      });

      res.status(201).json({
        success: true,
        message: 'Warehouse created successfully',
        data: warehouse
      });

      logger.info(`Warehouse created: ${warehouse.code}`);
    } catch (error: any) {
      logger.error('Error creating warehouse:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create warehouse',
        error: error.message
      });
    }
  }
}

export default new WarehouseController();
