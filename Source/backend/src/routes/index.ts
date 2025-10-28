import { Router } from 'express';

// Import module routes
import masterDataRoutes from '../modules/master-data/master-data.routes';
import inboundRoutes from '../modules/inbound/inbound.routes';
import inventoryRoutes from '../modules/inventory/inventory.routes';
import outboundRoutes from '../modules/outbound/outbound.routes';
import reportingRoutes from '../modules/reporting/reporting.routes';
import adminRoutes from '../modules/admin/admin.routes';
import authRoutes from '../modules/auth/auth.routes';

// Swagger documentation
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../config/swagger.config';

const router = Router();

// API version
const API_VERSION = process.env.API_VERSION || 'v1';

// Documentation
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Authentication routes
router.use(`/${API_VERSION}/auth`, authRoutes);

// Master Data routes
router.use(`/${API_VERSION}/master-data`, masterDataRoutes);

// Inbound routes
router.use(`/${API_VERSION}/inbound`, inboundRoutes);

// Inventory routes
router.use(`/${API_VERSION}/inventory`, inventoryRoutes);

// Outbound routes
router.use(`/${API_VERSION}/outbound`, outboundRoutes);

// Reporting routes
router.use(`/${API_VERSION}/reports`, reportingRoutes);

// Admin routes
router.use(`/${API_VERSION}/admin`, adminRoutes);

export default router;
