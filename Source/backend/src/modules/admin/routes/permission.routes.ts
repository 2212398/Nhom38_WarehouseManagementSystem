import { Router } from 'express';

const router = Router();

router.get('/', (_req, res) => {
  res.json({ success: true, message: 'Permission routes - To be implemented' });
});

router.post('/', (_req, res) => {
  res.json({ success: true, message: 'Create permission - To be implemented' });
});

export default router;
