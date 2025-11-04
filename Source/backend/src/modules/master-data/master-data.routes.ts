import { Router } from 'express';
import { optionalAuthMiddleware } from '../../shared/middlewares/optional-auth.middleware';

const router = Router();

// Product routes
import productRoutes from './routes/product.routes';
router.use('/products', optionalAuthMiddleware, productRoutes);

// Warehouse routes
import warehouseRoutes from './routes/warehouse.routes';
router.use('/warehouses', optionalAuthMiddleware, warehouseRoutes);

// Location routes
import locationRoutes from './routes/location.routes';
router.use('/locations', optionalAuthMiddleware, locationRoutes);

// Supplier routes
import supplierRoutes from './routes/supplier.routes';
router.use('/suppliers', optionalAuthMiddleware, supplierRoutes);

// Customer routes
import customerRoutes from './routes/customer.routes';
router.use('/customers', optionalAuthMiddleware, customerRoutes);

// Carrier routes
import carrierRoutes from './routes/carrier.routes';
router.use('/carriers', optionalAuthMiddleware, carrierRoutes);

// UoM routes
import uomRoutes from './routes/uom.routes';
router.use('/uom', optionalAuthMiddleware, uomRoutes);

export default router;
