import { Router } from 'express';
import soController from '../controllers/so.controller';

const router = Router();

router.get('/', soController.getAll.bind(soController));
router.get('/:id', soController.getById.bind(soController));

export default router;
