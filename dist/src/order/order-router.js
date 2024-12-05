"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const order_controller_1 = require("./order-controller");
const orderRouter = express_1.default.Router();
orderRouter.post('/', order_controller_1.createOrder);
orderRouter.put('/:id', order_controller_1.updateOrder);
orderRouter.get('/recent', order_controller_1.getRecentOrders);
orderRouter.get('/:id', order_controller_1.getOrderById);
exports.default = orderRouter;
