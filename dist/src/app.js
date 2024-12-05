"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const globalErrorHandler_1 = __importDefault(require("./middlewares/globalErrorHandler"));
const user_router_1 = __importDefault(require("./user/user-router"));
const product_router_1 = __importDefault(require("./product/product-router"));
const order_router_1 = __importDefault(require("./order/order-router"));
const app = (0, express_1.default)();
//*Middleware for parsing JSON
app.use(express_1.default.json());
//* Routes
app.get('/', (req, res) => {
    res.json({ message: 'Namaste 👋, Welcome to NodeJS Template!' });
});
app.use('/api/user', user_router_1.default);
app.use('/api/product', product_router_1.default);
app.use('/api/order', order_router_1.default);
//* Global error handler
app.use(globalErrorHandler_1.default);
exports.default = app;
