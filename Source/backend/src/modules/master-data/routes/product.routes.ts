import { Router } from 'express';

const router = Router();

/**
 * @swagger
 * /master-data/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products
 */
router.get('/', (_req, res) => {
  res.json({ success: true, message: 'Product routes - To be implemented' });
});

router.post('/', (_req, res) => {
  res.json({ success: true, message: 'Create product - To be implemented' });
});

router.get('/:id', (_req, res) => {
  res.json({ success: true, message: 'Get product by ID - To be implemented' });
});

router.put('/:id', (_req, res) => {
  res.json({ success: true, message: 'Update product - To be implemented' });
});

router.delete('/:id', (_req, res) => {
  res.json({ success: true, message: 'Delete product - To be implemented' });
});

export default router;
