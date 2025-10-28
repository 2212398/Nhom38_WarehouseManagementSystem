import { Router } from 'express';

const router = Router();

router.get('/', (_req, res) => {
  res.json({ success: true, message: 'Cycle Count routes - To be implemented' });
});

router.post('/', (_req, res) => {
  res.json({ success: true, message: 'Create cycle count - To be implemented' });
});

export default router;
