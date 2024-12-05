import type { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import userModel from './user-model';

export async function createUser(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
        return next(createHttpError(400, 'All fields are required.'));
    }
    try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser)
            return next(createHttpError(400, 'Email already exists'));

        const newUser = await userModel.create({ name, email, phone });
        return res
            .status(201)
            .json({ data: newUser, message: 'User created successfully' });
    } catch (error) {
        return next(error);
    }
}
