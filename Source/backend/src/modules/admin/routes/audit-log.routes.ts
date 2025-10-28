import { Router } from 'express';

const router = Router();

router.get('/', (_req, res) => {
  res.json({ success: true, message: 'Audit Log routes - To be implemented' });
});

export default router;
