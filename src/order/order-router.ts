import express, { type RequestHandler } from 'express';
import {
    createOrder,
    getOrderById,
    getRecentOrders,
    updateOrder,
} from './order-controller';

const orderRouter = express.Router();

orderRouter.post('/', createOrder as unknown as RequestHandler);
orderRouter.put('/:id', updateOrder as unknown as RequestHandler);
orderRouter.get('/recent', getRecentOrders as unknown as RequestHandler);
orderRouter.get('/:id', getOrderById as unknown as RequestHandler);

export default orderRouter;
