"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user-controller");
const user_controller_2 = require("./user-controller");
const userRouter = express_1.default.Router();
userRouter.post('/', user_controller_1.createUser);
userRouter.put('/:id', user_controller_1.updateUser);
userRouter.get('/:id', user_controller_1.getUserById);
userRouter.get('/:id/orders', user_controller_2.getUserOrders);
exports.default = userRouter;
