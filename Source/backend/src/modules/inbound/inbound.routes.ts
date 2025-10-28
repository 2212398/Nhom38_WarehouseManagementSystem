import { Router } from 'express';

const router = Router();

// Purchase Order routes
import poRoutes from './routes/po.routes';
router.use('/purchase-orders', poRoutes);

// ASN routes
import asnRoutes from './routes/asn.routes';
router.use('/asn', asnRoutes);

// Receiving routes
import receivingRoutes from './routes/receiving.routes';
router.use('/receiving', receivingRoutes);

// QC routes
import qcRoutes from './routes/qc.routes';
router.use('/qc', qcRoutes);

// Putaway routes
import putawayRoutes from './routes/putaway.routes';
router.use('/putaway', putawayRoutes);

export default router;
