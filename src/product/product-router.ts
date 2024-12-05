import express, { type RequestHandler } from 'express';
import {
    createProduct,
    getProductById,
    updateProduct,
} from './product-controller';

const productRouter = express.Router();

productRouter.post('/', createProduct as unknown as RequestHandler);
productRouter.put('/:id', updateProduct as unknown as RequestHandler);
productRouter.get('/:id', getProductById as unknown as RequestHandler);

export default productRouter;
