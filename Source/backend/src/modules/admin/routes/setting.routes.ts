import { Router } from 'express';

const router = Router();

router.get('/', (_req, res) => {
  res.json({ success: true, message: 'Setting routes - To be implemented' });
});

router.put('/:key', (_req, res) => {
  res.json({ success: true, message: 'Update setting - To be implemented' });
});

export default router;
