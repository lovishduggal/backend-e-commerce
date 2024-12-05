import express, { type RequestHandler } from 'express';
import { createOrder } from './order-controller';

const orderRouter = express.Router();

orderRouter.post('/', createOrder as unknown as RequestHandler);

export default orderRouter;
