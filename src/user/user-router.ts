import express, { type RequestHandler } from 'express';
import { createUser, getUserById, updateUser } from './user-controller';

const userRouter = express.Router();

userRouter.post('/', createUser as unknown as RequestHandler);
userRouter.put('/:id', updateUser as unknown as RequestHandler);
userRouter.get('/:id', getUserById as unknown as RequestHandler);

// router.get('/orders/recent', async (req, res) => {
//     try {
//         const date = new Date();
//         date.setDate(date.getDate() - 7);
//         const recentOrders = await Order.find({ orderDate: { $gte: date } })
//             .populate('userId')
//             .populate('productId');
//         res.send(recentOrders);
//     } catch (error) {
//         res.status(500).send(error);
//     }
// });

export default userRouter;
