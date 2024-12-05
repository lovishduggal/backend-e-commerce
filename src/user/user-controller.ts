import type { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import userModel from './user-model';

export async function createUser(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const { name, email, phone } = req.body;

    // Validate name (min 3, max 50 characters)
    const nameRegex = /^[A-Za-z\s]{3,50}$/;
    if (!nameRegex.test(name)) {
        return next(
            createHttpError(400, 'Name must be between 3 and 50 characters.')
        );
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return next(createHttpError(400, 'Invalid email format.'));
    }

    // Validate phone (10 digits)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
        return next(createHttpError(400, 'Phone number must be 10 digits.'));
    }

    try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return next(createHttpError(400, 'User already exists.'));
        }

        const newUser = await userModel.create({ name, email, phone });
        return res
            .status(201)
            .json({ data: newUser, message: 'User created successfully' });
    } catch (error) {
        return next(error);
    }
}

export async function updateUser(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const { name, email, phone } = req.body;
    const userId = req.params.id; // Get user ID from request parameters

    // Validate user ID
    const idRegex = /^[0-9a-fA-F]{24}$/;
    if (!idRegex.test(userId)) {
        return next(createHttpError(400, 'Invalid user ID format.'));
    }

    // Validate name (if provided)
    if (name) {
        const nameRegex = /^[A-Za-z\s]{3,50}$/;
        if (!nameRegex.test(name)) {
            return next(
                createHttpError(
                    400,
                    'Name must be between 3 and 50 characters.'
                )
            );
        }
    }

    // Validate email (if provided)
    if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return next(createHttpError(400, 'Invalid email format.'));
        }
    }

    // Validate phone (if provided)
    if (phone) {
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phone)) {
            return next(
                createHttpError(400, 'Phone number must be 10 digits.')
            );
        }
    }

    try {
        const existingUser = await userModel.findByIdAndUpdate(
            userId,
            { name, email, phone },
            { new: true, runValidators: true }
        );
        if (!existingUser) {
            return next(createHttpError(404, 'User not found.'));
        }

        return res
            .status(200)
            .json({ data: existingUser, message: 'User updated successfully' });
    } catch (error) {
        return next(error);
    }
}
