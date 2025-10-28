import { Router } from 'express';

const router = Router();

router.get('/', (_req, res) => {
  res.json({ success: true, message: 'Purchase Order routes - To be implemented' });
});

router.post('/', (_req, res) => {
  res.json({ success: true, message: 'Create PO - To be implemented' });
});

export default router;
