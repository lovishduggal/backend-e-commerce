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
exports.createUser = createUser;
exports.updateUser = updateUser;
exports.getUserById = getUserById;
exports.getUserOrders = getUserOrders;
const http_errors_1 = __importDefault(require("http-errors"));
const user_model_1 = __importDefault(require("./user-model"));
const order_model_1 = __importDefault(require("../order/order-model"));
function createUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, email, phone } = req.body;
        // Validate name (min 3, max 50 characters)
        const nameRegex = /^[A-Za-z\s]{3,50}$/;
        if (!nameRegex.test(name)) {
            return next((0, http_errors_1.default)(400, 'Name must be between 3 and 50 characters.'));
        }
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return next((0, http_errors_1.default)(400, 'Invalid email format.'));
        }
        // Validate phone (10 digits)
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phone)) {
            return next((0, http_errors_1.default)(400, 'Phone number must be 10 digits.'));
        }
        try {
            const existingUser = yield user_model_1.default.findOne({ email });
            if (existingUser) {
                return next((0, http_errors_1.default)(400, 'User already exists.'));
            }
            const newUser = yield user_model_1.default.create({ name, email, phone });
            return res
                .status(201)
                .json({ data: newUser, message: 'User created successfully' });
        }
        catch (error) {
            return next(error);
        }
    });
}
function updateUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, email, phone } = req.body;
        const userId = req.params.id; // Get user ID from request parameters
        // Validate user ID
        const idRegex = /^[0-9a-fA-F]{24}$/;
        if (!idRegex.test(userId)) {
            return next((0, http_errors_1.default)(400, 'Invalid user ID format.'));
        }
        // Validate name (if provided)
        if (name) {
            const nameRegex = /^[A-Za-z\s]{3,50}$/;
            if (!nameRegex.test(name)) {
                return next((0, http_errors_1.default)(400, 'Name must be between 3 and 50 characters.'));
            }
        }
        // Validate email (if provided)
        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return next((0, http_errors_1.default)(400, 'Invalid email format.'));
            }
        }
        // Validate phone (if provided)
        if (phone) {
            const phoneRegex = /^\d{10}$/;
            if (!phoneRegex.test(phone)) {
                return next((0, http_errors_1.default)(400, 'Phone number must be 10 digits.'));
            }
        }
        try {
            const existingUser = yield user_model_1.default.findByIdAndUpdate(userId, { name, email, phone }, { new: true, runValidators: true });
            if (!existingUser) {
                return next((0, http_errors_1.default)(404, 'User not found.'));
            }
            return res
                .status(200)
                .json({ data: existingUser, message: 'User updated successfully' });
        }
        catch (error) {
            return next(error);
        }
    });
}
function getUserById(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = req.params.id; // Get user ID from request parameters
        // Validate user ID
        const idRegex = /^[0-9a-fA-F]{24}$/;
        if (!idRegex.test(userId)) {
            return next((0, http_errors_1.default)(400, 'Invalid user ID format.'));
        }
        try {
            const user = yield user_model_1.default.findById(userId); // Find user by ID
            if (!user) {
                return next((0, http_errors_1.default)(404, 'User not found.'));
            }
            return res
                .status(200)
                .json({ data: user, message: 'User retrieved successfully' });
        }
        catch (error) {
            return next(error);
        }
    });
}
function getUserOrders(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = req.params.id; // Get user ID from request parameters
        // Validate userId
        const userIdRegex = /^[0-9a-fA-F]{24}$/;
        if (!userIdRegex.test(userId)) {
            return next((0, http_errors_1.default)(400, 'Invalid user ID format.'));
        }
        try {
            // Find orders for the specified user
            const userOrders = yield order_model_1.default
                .find({ userId })
                .populate('productId');
            if (userOrders.length === 0) {
                return res.status(404).json({
                    message: 'No orders found for this user.',
                });
            }
            return res.status(200).json({
                data: userOrders,
                message: 'User orders retrieved successfully',
            });
        }
        catch (error) {
            return next(error);
        }
    });
}
