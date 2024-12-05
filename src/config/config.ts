import { config as dotenvConfig } from 'dotenv';
dotenvConfig();

const { PORT, MONGODB_URI, NODE_ENV } = process.env;

const _config = {
    PORT,
    MONGODB_URI,
    NODE_ENV,
};

export const config = Object.freeze(_config);
