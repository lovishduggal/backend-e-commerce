import express from 'express';
import globalErrorHandler from './middlewares/globalErrorHandler';
import userRouter from './user/user-router';
import productRouter from './product/product-router';
import orderRouter from './order/order-router';
const app = express();

//*Middleware for parsing JSON
app.use(express.json());

//* Routes
app.get('/', (req, res) => {
    res.json({ message: 'Namaste 👋, Welcome to NodeJS Template!' });
});

app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/order', orderRouter);

//* Global error handler
app.use(globalErrorHandler);

export default app;
