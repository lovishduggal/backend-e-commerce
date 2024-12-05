import express, { type RequestHandler } from 'express';
import { createOrder, updateOrder } from './order-controller';

const orderRouter = express.Router();

orderRouter.post('/', createOrder as unknown as RequestHandler);
orderRouter.put('/:id', updateOrder as unknown as RequestHandler);

export default orderRouter;
