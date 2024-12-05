import app from './src/app';
import { config } from './src/config/config';
import connectDB from './src/config/db';

async function startServer() {
    // Connect to MongoDB
    await connectDB();

    const port = config.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

startServer();
