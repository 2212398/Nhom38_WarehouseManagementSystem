import { Router } from 'express';

const router = Router();

router.get('/', (_req, res) => {
  res.json({ success: true, message: 'Warehouse routes - To be implemented' });
});

router.post('/', (_req, res) => {
  res.json({ success: true, message: 'Create warehouse - To be implemented' });
});

router.get('/:id', (_req, res) => {
  res.json({ success: true, message: 'Get warehouse by ID - To be implemented' });
});

router.put('/:id', (_req, res) => {
  res.json({ success: true, message: 'Update warehouse - To be implemented' });
});

router.delete('/:id', (_req, res) => {
  res.json({ success: true, message: 'Delete warehouse - To be implemented' });
});

export default router;
