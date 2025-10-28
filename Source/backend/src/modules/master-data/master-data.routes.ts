import { Router } from 'express';
import { authMiddleware } from '../../shared/middlewares/auth.middleware';

const router = Router();

// Product routes
import productRoutes from './routes/product.routes';
router.use('/products', authMiddleware, productRoutes);

// Warehouse routes
import warehouseRoutes from './routes/warehouse.routes';
router.use('/warehouses', authMiddleware, warehouseRoutes);

// Location routes
import locationRoutes from './routes/location.routes';
router.use('/locations', authMiddleware, locationRoutes);

// Supplier routes
import supplierRoutes from './routes/supplier.routes';
router.use('/suppliers', authMiddleware, supplierRoutes);

// Customer routes
import customerRoutes from './routes/customer.routes';
router.use('/customers', authMiddleware, customerRoutes);

// Carrier routes
import carrierRoutes from './routes/carrier.routes';
router.use('/carriers', authMiddleware, carrierRoutes);

// UoM routes
import uomRoutes from './routes/uom.routes';
router.use('/uom', authMiddleware, uomRoutes);

export default router;
