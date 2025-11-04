import { Router } from 'express';
import shippingController from '../controllers/shipping.controller';

const router = Router();

router.get('/', shippingController.getAll.bind(shippingController));
router.get('/track/:trackingNumber', shippingController.trackShipment.bind(shippingController));

export default router;
