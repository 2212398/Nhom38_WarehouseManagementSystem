import { Router } from 'express';

const router = Router();

// Sales Order routes
import soRoutes from './routes/so.routes';
router.use('/so', soRoutes);
router.use('/sales-orders', soRoutes); // Alias for compatibility

// Wave routes
import waveRoutes from './routes/wave.routes';
router.use('/waves', waveRoutes);

// Picking routes
import pickRoutes from './routes/pick.routes';
router.use('/picking', pickRoutes);

// Packing routes
import packRoutes from './routes/pack.routes';
router.use('/packing', packRoutes);

// Shipping routes
import shippingRoutes from './routes/shipping.routes';
router.use('/shipping', shippingRoutes);

// Returns routes
import returnsRoutes from './routes/returns.routes';
router.use('/returns', returnsRoutes);

export default router;
