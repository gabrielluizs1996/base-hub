import { Router } from 'express';
import { listOrders, createOrderHandler, cancelOrderHandler } from '../controller/orders.controller';

const router = Router();

router.get('/orders', listOrders);
router.post('/orders', createOrderHandler);
router.patch('/orders/:id/cancel', cancelOrderHandler);

export default router;