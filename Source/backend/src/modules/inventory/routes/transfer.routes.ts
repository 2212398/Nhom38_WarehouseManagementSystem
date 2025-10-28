import { Router } from 'express';

const router = Router();

router.get('/', (_req, res) => {
  res.json({ success: true, message: 'Transfer routes - To be implemented' });
});

router.post('/', (_req, res) => {
  res.json({ success: true, message: 'Create transfer - To be implemented' });
});

export default router;
