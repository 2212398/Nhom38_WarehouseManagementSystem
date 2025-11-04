import { Router } from 'express';
import productController from '../controllers/product.controller';

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
router.get('/', productController.getAll.bind(productController));

router.post('/', productController.create.bind(productController));

router.get('/:id', productController.getById.bind(productController));

router.put('/:id', productController.update.bind(productController));

router.delete('/:id', productController.delete.bind(productController));

export default router;
