import express, { type RequestHandler } from 'express';
import { createProduct, updateProduct } from './product-controller';

const productRouter = express.Router();

productRouter.post('/', createProduct as unknown as RequestHandler);
productRouter.put('/:id', updateProduct as unknown as RequestHandler);

export default productRouter;
