import express, { type RequestHandler } from 'express';
import { createProduct } from './product-controller';

const productRouter = express.Router();

productRouter.post('/', createProduct as unknown as RequestHandler);

export default productRouter;
