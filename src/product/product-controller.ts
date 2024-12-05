import type { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import productModel from './product-model';

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
                'Product name must be between 3 and 50 characters and can special characters.'
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
