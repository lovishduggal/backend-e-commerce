"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const { PORT, MONGODB_URI, NODE_ENV } = process.env;
const _config = {
    PORT,
    MONGODB_URI,
    NODE_ENV,
};
exports.config = Object.freeze(_config);
