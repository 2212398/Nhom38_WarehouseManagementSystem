import { Router } from 'express';

const router = Router();

// Stock routes
import stockRoutes from './routes/stock.routes';
router.use('/stock', stockRoutes);

// Transfer routes
import transferRoutes from './routes/transfer.routes';
router.use('/transfers', transferRoutes);

// Adjustment routes
import adjustmentRoutes from './routes/adjustment.routes';
router.use('/adjustments', adjustmentRoutes);

// Replenishment routes
import replenishmentRoutes from './routes/replenishment.routes';
router.use('/replenishment', replenishmentRoutes);

// Cycle Count routes
import cycleCountRoutes from './routes/cycle-count.routes';
router.use('/cycle-count', cycleCountRoutes);

// Kitting routes
import kittingRoutes from './routes/kitting.routes';
router.use('/kitting', kittingRoutes);

export default router;
