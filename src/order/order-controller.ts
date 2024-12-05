import type { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import orderModel from './order-model';
import productModel from '../product/product-model'; // Adjust the import path as necessary
import { subDays } from 'date-fns'; // Import date-fns for date manipulation

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
        const product = await productModel.findByIdAndUpdate(productId);
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

export async function updateOrder(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const { quantity } = req.body;
    const orderId = req.params.id; // Get user ID from request parameters

    // Validate orderId
    const orderIdRegex = /^[0-9a-fA-F]{24}$/;
    if (!orderIdRegex.test(orderId)) {
        return next(createHttpError(400, 'Invalid order ID format.'));
    }

    // Validate quantity
    if (typeof quantity !== 'number' || quantity <= 0) {
        return next(
            createHttpError(400, 'Quantity must be a positive number.')
        );
    }

    try {
        // Check if the order exists
        const order = await orderModel.findById(orderId);
        if (!order) {
            return next(createHttpError(404, 'Order not found.'));
        }

        // Check the product associated with the order
        const product = await productModel.findById(order.productId);
        if (!product) {
            return next(createHttpError(404, 'Product not found.'));
        }

        // Adjust stock based on the quantity change
        if (quantity > order.quantity) {
            // Increase order quantity, decrease stock
            const quantityDifference = quantity - order.quantity;
            if (product.stock < quantityDifference) {
                return next(
                    createHttpError(400, 'Insufficient stock for the product.')
                );
            }
            product.stock -= quantityDifference;
        } else if (quantity < order.quantity) {
            // Decrease order quantity, increase stock
            const quantityDifference = order.quantity - quantity;
            product.stock += quantityDifference;
        }

        // Update the order quantity
        order.quantity = quantity;
        await order.save();
        await product.save(); // Save the updated product stock

        return res.status(200).json({
            data: order,
            message: 'Order updated successfully',
        });
    } catch (error) {
        return next(error);
    }
}

export async function getOrderById(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const orderId = req.params.id; // Get order ID from request parameters

    // Validate order ID
    const idRegex = /^[0-9a-fA-F]{24}$/;
    if (!idRegex.test(orderId)) {
        return next(createHttpError(400, 'Invalid order ID format.'));
    }

    try {
        const order = await orderModel.findById(orderId); // Find order by ID
        if (!order) {
            return next(createHttpError(404, 'Order not found.'));
        }

        return res
            .status(200)
            .json({ data: order, message: 'Order retrieved successfully' });
    } catch (error) {
        return next(error);
    }
}

export async function getRecentOrders(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        // Calculate the date 7 days ago from today
        const sevenDaysAgo = subDays(new Date(), 7);

        // Find orders placed in the last 7 days
        const recentOrders = await orderModel
            .find({
                orderDate: { $gte: sevenDaysAgo },
            })
            .populate('productId')
            .populate('userId');

        return res.status(200).json({
            data: recentOrders,
            message: 'Recent orders retrieved successfully',
        });
    } catch (error) {
        return next(error);
    }
}
