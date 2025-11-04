import { Router } from 'express';
import warehouseController from '../controllers/warehouse.controller';

const router = Router();

router.get('/', warehouseController.getAll.bind(warehouseController));

router.post('/', warehouseController.create.bind(warehouseController));

router.get('/:id', warehouseController.getById.bind(warehouseController));

export default router;
