"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProduct = createProduct;
exports.updateProduct = updateProduct;
exports.getProductById = getProductById;
exports.getUsersByProduct = getUsersByProduct;
exports.getTotalStockQuantity = getTotalStockQuantity;
const http_errors_1 = __importDefault(require("http-errors"));
const product_model_1 = __importDefault(require("./product-model"));
const user_model_1 = __importDefault(require("../user/user-model"));
const order_model_1 = __importDefault(require("../order/order-model"));
function createProduct(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, category, price, stock } = req.body;
        // Validate name (min 3, max 50 characters, allows alphanumeric and some special characters)
        const productNameRegex = /^[A-Za-z0-9\s\-'.]{3,50}$/;
        if (!productNameRegex.test(name)) {
            return next((0, http_errors_1.default)(400, 'Product name must be between 3 and 50 characters and can include special characters.'));
        }
        // Validate category (min 3, max 50 characters)
        const categoryRegex = /^[A-Za-z\s]{3,50}$/;
        if (!categoryRegex.test(category)) {
            return next((0, http_errors_1.default)(400, 'Category must be between 3 and 50 characters.'));
        }
        // Validate price (must be a positive number)
        if (typeof price !== 'number' || price <= 0) {
            return next((0, http_errors_1.default)(400, 'Price must be a positive number.'));
        }
        // Validate stock (must be a non-negative integer)
        if (!Number.isInteger(stock) || stock < 0) {
            return next((0, http_errors_1.default)(400, 'Stock must be a non-negative integer.'));
        }
        try {
            const newProduct = yield product_model_1.default.create({
                name,
                category,
                price,
                stock,
            });
            return res.status(201).json({
                data: newProduct,
                message: 'Product created successfully',
            });
        }
        catch (error) {
            return next(error);
        }
    });
}
function updateProduct(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const productId = req.params.id; // Get product ID from request parameters
        const { name, category, price, stock } = req.body;
        // Validate product ID
        const idRegex = /^[0-9a-fA-F]{24}$/;
        if (!idRegex.test(productId)) {
            return next((0, http_errors_1.default)(400, 'Invalid product ID format.'));
        }
        // Validate name (if provided)
        if (name) {
            const productNameRegex = /^[A-Za-z0-9\s\-'.]{3,50}$/;
            if (!productNameRegex.test(name)) {
                return next((0, http_errors_1.default)(400, 'Product name must be between 3 and can include  special characters.'));
            }
        }
        // Validate category (if provided)
        if (category) {
            const categoryRegex = /^[A-Za-z\s]{3,50}$/; // Assuming category follows the same rules as before
            if (!categoryRegex.test(category)) {
                return next((0, http_errors_1.default)(400, 'Category must be between 3 and 50 characters.'));
            }
        }
        // Validate price (if provided)
        if (price !== undefined) {
            if (typeof price !== 'number' || price <= 0) {
                return next((0, http_errors_1.default)(400, 'Price must be a positive number.'));
            }
        }
        // Validate stock (if provided)
        if (stock !== undefined) {
            if (!Number.isInteger(stock) || stock < 0) {
                return next((0, http_errors_1.default)(400, 'Stock must be a non-negative integer.'));
            }
        }
        try {
            const existingProduct = yield product_model_1.default.findByIdAndUpdate(productId, {
                name,
                category,
                price,
                stock,
            }, { new: true, runValidators: true });
            if (!existingProduct) {
                return next((0, http_errors_1.default)(404, 'Product not found.'));
            }
            return res.status(200).json({
                data: existingProduct,
                message: 'Product updated successfully',
            });
        }
        catch (error) {
            return next(error);
        }
    });
}
function getProductById(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const productId = req.params.id; // Get product ID from request parameters
        // Validate product ID
        const idRegex = /^[0-9a-fA-F]{24}$/;
        if (!idRegex.test(productId)) {
            return next((0, http_errors_1.default)(400, 'Invalid product ID format.'));
        }
        try {
            const product = yield product_model_1.default.findById(productId); // Find product by ID
            if (!product) {
                return next((0, http_errors_1.default)(404, 'Product not found.'));
            }
            return res
                .status(200)
                .json({ data: product, message: 'Product retrieved successfully' });
        }
        catch (error) {
            return next(error);
        }
    });
}
function getUsersByProduct(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const productId = req.params.id; // Get product ID from request parameters
        // Validate productId
        const productIdRegex = /^[0-9a-fA-F]{24}$/;
        if (!productIdRegex.test(productId)) {
            return next((0, http_errors_1.default)(400, 'Invalid product ID format.'));
        }
        try {
            // Find orders for the specified product
            const orders = yield order_model_1.default.find({ productId });
            if (orders.length === 0) {
                return res.status(404).json({
                    message: 'No orders found for this product.',
                });
            }
            // Extract unique user IDs from the orders
            const userIds = [...new Set(orders.map((order) => order.userId))];
            // Find user details for the unique user IDs
            const users = yield user_model_1.default.find({ _id: { $in: userIds } });
            return res.status(200).json({
                data: users,
                message: 'Users who bought this product retrieved successfully',
            });
        }
        catch (error) {
            return next(error);
        }
    });
}
function getTotalStockQuantity(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Retrieve all products and their stock quantities
            const products = yield product_model_1.default.find();
            // Calculate the total stock quantity
            const totalStockQuantity = products.reduce((total, product) => {
                return total + (product.stock || 0); // Ensure stock is a number
            }, 0);
            return res.status(200).json({
                totalStockQuantity,
                message: 'Total stock quantity retrieved successfully',
            });
        }
        catch (error) {
            return next(error);
        }
    });
}
