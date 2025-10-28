import { Router } from 'express';

const router = Router();

router.get('/', (_req, res) => {
  res.json({ success: true, message: 'Kitting routes - To be implemented' });
});

router.post('/', (_req, res) => {
  res.json({ success: true, message: 'Create kitting - To be implemented' });
});

export default router;
