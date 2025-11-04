import { Router } from 'express';
import settingController from '../controllers/setting.controller';

const router = Router();

router.get('/', settingController.getAll.bind(settingController));
router.put('/', settingController.update.bind(settingController));

export default router;
