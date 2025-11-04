import { Request, Response } from 'express';
import prisma from '../../../shared/database/prisma.client';
import logger from '../../../shared/utils/logger';

/**
 * Product Controller
 * Handles CRUD operations for products
 */
export class ProductController {
  /**
   * Get all products with pagination and search
   * @route GET /api/v1/products
   */
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;
      const search = req.query.search as string || '';
      const skip = (page - 1) * pageSize;

      // Build where clause
      const where: any = {
        deleted_at: null
      };

      if (search) {
        where.OR = [
          { sku: { contains: search, mode: 'insensitive' } },
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ];
      }

      // Get total count
      const total = await prisma.products.count({ where });

      // Get products
      const products = await prisma.products.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { created_at: 'desc' },
        select: {
          id: true,
          sku: true,
          name: true,
          description: true,
          category_id: true,
          unit_cost: true,
          unit_price: true,
          weight: true,
          is_active: true,
          stock_strategy: true,
          abc_class: true,
          created_at: true,
          updated_at: true,
          category: {
            select: {
              id: true,
              code: true,
              name: true
            }
          }
        }
      });

      res.status(200).json({
        success: true,
        data: products,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize)
        }
      });

      logger.info(`Retrieved ${products.length} products (page ${page})`);
    } catch (error: any) {
      logger.error('Error getting products:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve products',
        error: error.message
      });
    }
  }

  /**
   * Get product by ID
   * @route GET /api/v1/products/:id
   */
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const product = await prisma.products.findFirst({
        where: { id, deleted_at: null },
        include: {
          category: {
            select: {
              id: true,
              code: true,
              name: true
            }
          },
          base_uom: {
            select: {
              id: true,
              code: true,
              name: true
            }
          }
        }
      });

      if (!product) {
        res.status(404).json({
          success: false,
          message: 'Product not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: product
      });

      logger.info(`Retrieved product: ${product.sku}`);
    } catch (error: any) {
      logger.error('Error getting product by ID:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve product',
        error: error.message
      });
    }
  }

  /**
   * Create new product
   * @route POST /api/v1/products
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const productData = req.body;

      // Check if SKU already exists
      const existingProduct = await prisma.products.findUnique({
        where: { sku: productData.sku }
      });

      if (existingProduct && !existingProduct.deleted_at) {
        res.status(400).json({
          success: false,
          message: 'Product with this SKU already exists'
        });
        return;
      }

      const product = await prisma.products.create({
        data: {
          ...productData,
          created_by: (req as any).user?.id, // From auth middleware
          updated_by: (req as any).user?.id
        },
        include: {
          category: {
            select: {
              id: true,
              code: true,
              name: true
            }
          }
        }
      });

      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: product
      });

      logger.info(`Product created: ${product.sku}`);
    } catch (error: any) {
      logger.error('Error creating product:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create product',
        error: error.message
      });
    }
  }

  /**
   * Update product
   * @route PUT /api/v1/products/:id
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Check if product exists
      const existingProduct = await prisma.products.findFirst({
        where: { id, deleted_at: null }
      });

      if (!existingProduct) {
        res.status(404).json({
          success: false,
          message: 'Product not found'
        });
        return;
      }

      const product = await prisma.products.update({
        where: { id },
        data: {
          ...updateData,
          updated_by: (req as any).user?.id,
          version: { increment: 1 }
        },
        include: {
          category: {
            select: {
              id: true,
              code: true,
              name: true
            }
          }
        }
      });

      res.status(200).json({
        success: true,
        message: 'Product updated successfully',
        data: product
      });

      logger.info(`Product updated: ${product.sku}`);
    } catch (error: any) {
      logger.error('Error updating product:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update product',
        error: error.message
      });
    }
  }

  /**
   * Delete product (soft delete)
   * @route DELETE /api/v1/products/:id
   */
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // Check if product exists
      const existingProduct = await prisma.products.findFirst({
        where: { id, deleted_at: null }
      });

      if (!existingProduct) {
        res.status(404).json({
          success: false,
          message: 'Product not found'
        });
        return;
      }

      await prisma.products.update({
        where: { id },
        data: {
          deleted_at: new Date(),
          updated_by: (req as any).user?.id
        }
      });

      res.status(200).json({
        success: true,
        message: 'Product deleted successfully'
      });

      logger.info(`Product deleted: ${existingProduct.sku}`);
    } catch (error: any) {
      logger.error('Error deleting product:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete product',
        error: error.message
      });
    }
  }
}

export default new ProductController();
