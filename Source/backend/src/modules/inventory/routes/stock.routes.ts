import { Router } from 'express';
import stockController from '../controllers/stock.controller';

const router = Router();

router.get('/', stockController.getAll.bind(stockController));
router.get('/low-stock', stockController.getLowStock.bind(stockController));

export default router;
