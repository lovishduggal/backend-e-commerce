import type { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import orderModel from './order-model';
import productModel from '../product/product-model'; // Adjust the import path as necessary

export async function createOrder(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const { userId, productId, quantity } = req.body;

    // Validate userId
    const userIdRegex = /^[0-9a-fA-F]{24}$/;
    if (!userIdRegex.test(userId)) {
        return next(createHttpError(400, 'Invalid user ID format.'));
    }

    // Validate productId
    if (!userIdRegex.test(productId)) {
        return next(createHttpError(400, 'Invalid product ID format.'));
    }

    // Validate quantity
    if (typeof quantity !== 'number' || quantity <= 0) {
        return next(
            createHttpError(400, 'Quantity must be a positive number.')
        );
    }

    try {
        // Check if the product exists and has enough stock
        const product = await productModel.findById(productId);
        if (!product) {
            return next(createHttpError(404, 'Product not found.'));
        }
        if (product.stock < quantity) {
            return next(
                createHttpError(400, 'Insufficient stock for the product.')
            );
        }

        // Create the order
        const newOrder = await orderModel.create({
            userId,
            productId,
            quantity,
            orderDate: new Date(), // Set the order date to now
        });

        // Update the product stock
        product.stock -= quantity;
        await product.save();

        return res.status(201).json({
            data: newOrder,
            message: 'Order created successfully',
        });
    } catch (error) {
        return next(error);
    }
}
