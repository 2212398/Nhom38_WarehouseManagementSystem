import { Router } from 'express';
import dashboardController from '../controllers/dashboard.controller';

const router = Router();

// GET /api/v1/dashboard/stats - Get dashboard statistics
router.get('/stats', dashboardController.getStats.bind(dashboardController));

// GET /api/v1/dashboard/activities - Get recent activities
router.get('/activities', dashboardController.getRecentActivities.bind(dashboardController));

export default router;
