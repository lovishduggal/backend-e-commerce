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
exports.createOrder = createOrder;
exports.updateOrder = updateOrder;
exports.getOrderById = getOrderById;
exports.getRecentOrders = getRecentOrders;
const http_errors_1 = __importDefault(require("http-errors"));
const order_model_1 = __importDefault(require("./order-model"));
const product_model_1 = __importDefault(require("../product/product-model"));
const date_fns_1 = require("date-fns"); // Import date-fns for date manipulation
function createOrder(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId, productId, quantity } = req.body;
        // Validate userId
        const userIdRegex = /^[0-9a-fA-F]{24}$/;
        if (!userIdRegex.test(userId)) {
            return next((0, http_errors_1.default)(400, 'Invalid user ID format.'));
        }
        // Validate productId
        if (!userIdRegex.test(productId)) {
            return next((0, http_errors_1.default)(400, 'Invalid product ID format.'));
        }
        // Validate quantity
        if (typeof quantity !== 'number' || quantity <= 0) {
            return next((0, http_errors_1.default)(400, 'Quantity must be a positive number.'));
        }
        try {
            // Check if the product exists and has enough stock
            const product = yield product_model_1.default.findByIdAndUpdate(productId);
            if (!product) {
                return next((0, http_errors_1.default)(404, 'Product not found.'));
            }
            if (product.stock < quantity) {
                return next((0, http_errors_1.default)(400, 'Insufficient stock for the product.'));
            }
            // Create the order
            const newOrder = yield order_model_1.default.create({
                userId,
                productId,
                quantity,
                orderDate: new Date(), // Set the order date to now
            });
            // Update the product stock
            product.stock -= quantity;
            yield product.save();
            return res.status(201).json({
                data: newOrder,
                message: 'Order created successfully',
            });
        }
        catch (error) {
            return next(error);
        }
    });
}
function updateOrder(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { quantity } = req.body;
        const orderId = req.params.id; // Get user ID from request parameters
        // Validate orderId
        const orderIdRegex = /^[0-9a-fA-F]{24}$/;
        if (!orderIdRegex.test(orderId)) {
            return next((0, http_errors_1.default)(400, 'Invalid order ID format.'));
        }
        // Validate quantity
        if (typeof quantity !== 'number' || quantity <= 0) {
            return next((0, http_errors_1.default)(400, 'Quantity must be a positive number.'));
        }
        try {
            // Check if the order exists
            const order = yield order_model_1.default.findById(orderId);
            if (!order) {
                return next((0, http_errors_1.default)(404, 'Order not found.'));
            }
            // Check the product associated with the order
            const product = yield product_model_1.default.findById(order.productId);
            if (!product) {
                return next((0, http_errors_1.default)(404, 'Product not found.'));
            }
            // Adjust stock based on the quantity change
            if (quantity > order.quantity) {
                // Increase order quantity, decrease stock
                const quantityDifference = quantity - order.quantity;
                if (product.stock < quantityDifference) {
                    return next((0, http_errors_1.default)(400, 'Insufficient stock for the product.'));
                }
                product.stock -= quantityDifference;
            }
            else if (quantity < order.quantity) {
                // Decrease order quantity, increase stock
                const quantityDifference = order.quantity - quantity;
                product.stock += quantityDifference;
            }
            // Update the order quantity
            order.quantity = quantity;
            yield order.save();
            yield product.save(); // Save the updated product stock
            return res.status(200).json({
                data: order,
                message: 'Order updated successfully',
            });
        }
        catch (error) {
            return next(error);
        }
    });
}
function getOrderById(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const orderId = req.params.id; // Get order ID from request parameters
        // Validate order ID
        const idRegex = /^[0-9a-fA-F]{24}$/;
        if (!idRegex.test(orderId)) {
            return next((0, http_errors_1.default)(400, 'Invalid order ID format.'));
        }
        try {
            const order = yield order_model_1.default.findById(orderId); // Find order by ID
            if (!order) {
                return next((0, http_errors_1.default)(404, 'Order not found.'));
            }
            return res
                .status(200)
                .json({ data: order, message: 'Order retrieved successfully' });
        }
        catch (error) {
            return next(error);
        }
    });
}
function getRecentOrders(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Calculate the date 7 days ago from today
            const sevenDaysAgo = (0, date_fns_1.subDays)(new Date(), 7);
            // Find orders placed in the last 7 days
            const recentOrders = yield order_model_1.default
                .find({
                orderDate: { $gte: sevenDaysAgo },
            })
                .populate('productId')
                .populate('userId');
            return res.status(200).json({
                data: recentOrders,
                message: 'Recent orders retrieved successfully',
            });
        }
        catch (error) {
            return next(error);
        }
    });
}
