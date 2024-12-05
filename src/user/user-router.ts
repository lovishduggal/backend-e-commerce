import express, { type RequestHandler } from 'express';
import { createUser } from './user-controller';

const userRouter = express.Router();

userRouter.post('/', createUser as unknown as RequestHandler);

export default userRouter;
