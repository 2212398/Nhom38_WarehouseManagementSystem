import { Router } from 'express';

const router = Router();

// Inventory reports
import inventoryReportRoutes from './routes/inventory-report.routes';
router.use('/inventory', inventoryReportRoutes);

// Operations reports
import operationsReportRoutes from './routes/operations-report.routes';
router.use('/operations', operationsReportRoutes);

// KPI reports
import kpiReportRoutes from './routes/kpi-report.routes';
router.use('/kpi', kpiReportRoutes);

// Dashboards
import dashboardRoutes from './routes/dashboard.routes';
router.use('/dashboard', dashboardRoutes);

export default router;
