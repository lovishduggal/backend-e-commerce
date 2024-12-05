import express, { type RequestHandler } from 'express';
import { createUser, updateUser } from './user-controller';

const userRouter = express.Router();

userRouter.post('/', createUser as unknown as RequestHandler);
userRouter.put('/:id', updateUser as unknown as RequestHandler);

export default userRouter;
