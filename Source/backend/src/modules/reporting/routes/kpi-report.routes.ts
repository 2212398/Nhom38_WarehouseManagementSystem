import { Router } from 'express';

const router = Router();

router.get('/', (_req, res) => {
  res.json({ success: true, message: 'KPI Report routes - To be implemented' });
});

export default router;
