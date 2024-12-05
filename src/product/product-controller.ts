import type { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import productModel from './product-model';
import userModel from '../user/user-model';
import orderModel from '../order/order-model';

export async function createProduct(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const { name, category, price, stock } = req.body;

    // Validate name (min 3, max 50 characters, allows alphanumeric and some special characters)
    const productNameRegex = /^[A-Za-z0-9\s\-'.]{3,50}$/;
    if (!productNameRegex.test(name)) {
        return next(
            createHttpError(
                400,
                'Product name must be between 3 and 50 characters and can include special characters.'
            )
        );
    }

    // Validate category (min 3, max 50 characters)
    const categoryRegex = /^[A-Za-z\s]{3,50}$/;
    if (!categoryRegex.test(category)) {
        return next(
            createHttpError(
                400,
                'Category must be between 3 and 50 characters.'
            )
        );
    }

    // Validate price (must be a positive number)
    if (typeof price !== 'number' || price <= 0) {
        return next(createHttpError(400, 'Price must be a positive number.'));
    }

    // Validate stock (must be a non-negative integer)
    if (!Number.isInteger(stock) || stock < 0) {
        return next(
            createHttpError(400, 'Stock must be a non-negative integer.')
        );
    }

    try {
        const newProduct = await productModel.create({
            name,
            category,
            price,
            stock,
        });
        return res.status(201).json({
            data: newProduct,
            message: 'Product created successfully',
        });
    } catch (error) {
        return next(error);
    }
}

export async function updateProduct(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const productId = req.params.id; // Get product ID from request parameters
    const { name, category, price, stock } = req.body;

    // Validate product ID
    const idRegex = /^[0-9a-fA-F]{24}$/;
    if (!idRegex.test(productId)) {
        return next(createHttpError(400, 'Invalid product ID format.'));
    }

    // Validate name (if provided)
    if (name) {
        const productNameRegex = /^[A-Za-z0-9\s\-'.]{3,50}$/;
        if (!productNameRegex.test(name)) {
            return next(
                createHttpError(
                    400,
                    'Product name must be between 3 and can include  special characters.'
                )
            );
        }
    }

    // Validate category (if provided)
    if (category) {
        const categoryRegex = /^[A-Za-z\s]{3,50}$/; // Assuming category follows the same rules as before
        if (!categoryRegex.test(category)) {
            return next(
                createHttpError(
                    400,
                    'Category must be between 3 and 50 characters.'
                )
            );
        }
    }

    // Validate price (if provided)
    if (price !== undefined) {
        if (typeof price !== 'number' || price <= 0) {
            return next(
                createHttpError(400, 'Price must be a positive number.')
            );
        }
    }

    // Validate stock (if provided)
    if (stock !== undefined) {
        if (!Number.isInteger(stock) || stock < 0) {
            return next(
                createHttpError(400, 'Stock must be a non-negative integer.')
            );
        }
    }

    try {
        const existingProduct = await productModel.findByIdAndUpdate(
            productId,
            {
                name,
                category,
                price,
                stock,
            },
            { new: true, runValidators: true }
        );
        if (!existingProduct) {
            return next(createHttpError(404, 'Product not found.'));
        }

        return res.status(200).json({
            data: existingProduct,
            message: 'Product updated successfully',
        });
    } catch (error) {
        return next(error);
    }
}

export async function getProductById(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const productId = req.params.id; // Get product ID from request parameters

    // Validate product ID
    const idRegex = /^[0-9a-fA-F]{24}$/;
    if (!idRegex.test(productId)) {
        return next(createHttpError(400, 'Invalid product ID format.'));
    }

    try {
        const product = await productModel.findById(productId); // Find product by ID
        if (!product) {
            return next(createHttpError(404, 'Product not found.'));
        }

        return res
            .status(200)
            .json({ data: product, message: 'Product retrieved successfully' });
    } catch (error) {
        return next(error);
    }
}

export async function getUsersByProduct(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const productId = req.params.id; // Get product ID from request parameters

    // Validate productId
    const productIdRegex = /^[0-9a-fA-F]{24}$/;
    if (!productIdRegex.test(productId)) {
        return next(createHttpError(400, 'Invalid product ID format.'));
    }

    try {
        // Find orders for the specified product
        const orders = await orderModel.find({ productId });

        if (orders.length === 0) {
            return res.status(404).json({
                message: 'No orders found for this product.',
            });
        }

        // Extract unique user IDs from the orders
        const userIds = [...new Set(orders.map((order) => order.userId))];

        // Find user details for the unique user IDs
        const users = await userModel.find({ _id: { $in: userIds } });

        return res.status(200).json({
            data: users,
            message: 'Users who bought this product retrieved successfully',
        });
    } catch (error) {
        return next(error);
    }
}

export async function getTotalStockQuantity(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        // Retrieve all products and their stock quantities
        const products = await productModel.find();

        // Calculate the total stock quantity
        const totalStockQuantity = products.reduce((total, product) => {
            return total + (product.stock || 0); // Ensure stock is a number
        }, 0);

        return res.status(200).json({
            totalStockQuantity,
            message: 'Total stock quantity retrieved successfully',
        });
    } catch (error) {
        return next(error);
    }
}
