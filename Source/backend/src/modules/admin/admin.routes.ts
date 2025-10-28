import { Router } from 'express';

const router = Router();

// User routes
import userRoutes from './routes/user.routes';
router.use('/users', userRoutes);

// Role routes
import roleRoutes from './routes/role.routes';
router.use('/roles', roleRoutes);

// Permission routes
import permissionRoutes from './routes/permission.routes';
router.use('/permissions', permissionRoutes);

// Settings routes
import settingRoutes from './routes/setting.routes';
router.use('/settings', settingRoutes);

// Audit Log routes
import auditLogRoutes from './routes/audit-log.routes';
router.use('/audit-logs', auditLogRoutes);

// Alert routes
import alertRoutes from './routes/alert.routes';
router.use('/alerts', alertRoutes);

export default router;
