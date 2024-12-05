# Backend E-commerce API

## Project Overview

A robust backend API for an e-commerce platform built with Node.js, Express, and TypeScript. The API provides essential functionalities for managing users, products, and orders with a focus on performance and scalability.

## Features

-   **User Management**

    -   Create and update user profiles
    -   Retrieve user details
    -   View user-specific orders
    -   Email and phone validation
    -   Duplicate user prevention

-   **Product Management**

    -   Create and update products
    -   Track product inventory
    -   Get product details
    -   View users who purchased specific products
    -   Calculate total stock quantity
    -   Category-based organization

-   **Order Management**

    -   Create and update orders
    -   Automatic stock management
    -   View order details
    -   Get recent orders (last 7 days)
    -   Order quantity validation

-   **Performance Monitoring**
    -   Database indexing for optimization

## Tech Stack

-   **Runtime**: Node.js
-   **Language**: TypeScript
-   **Framework**: Express.js
-   **Database**: MongoDB with Mongoose
-   **Date Handling**: date-fns
-   **Error Handling**: http-errors
-   **Development Tools**:
    -   nodemon
    -   ESLint
    -   Prettier
    -   TypeScript ESLint

## Getting Started

### Prerequisites

-   Node.js (v14 or higher)
-   MongoDB
-   npm or yarn

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/lovishduggal/backend-e-commerce.git
    cd backend-e-commerce
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Create a `.env` file in the root directory and add your environment variables:

    ```
    PORT=3000
    MONGODB_URI=your_mongodb_connection_string
    NODE_ENV=development
    ```

4. Start the development server:

    ```bash
    npm run dev
    ```

## Folder Structure

The project follows a modular structure:

```
├── dist/                  # Compiled TypeScript output
├── src/                   # Source files
│   ├── config/           # Configuration files
│   │   ├── config.ts     # Environment configuration
│   │   └── db.ts        # Database connection setup
│   ├── middlewares/      # Middleware functions
│   │   └── globalErrorHandler.ts
│   ├── user/            # User module
│   │   ├── user-controller.ts
│   │   ├���─ user-model.ts
│   │   └── user-router.ts
│   ├── product/         # Product module
│   │   ├── product-controller.ts
│   │   ├── product-model.ts
│   │   └── product-router.ts
│   ├── order/           # Order module
│   │   ├── order-controller.ts
│   │   ├── order-model.ts
│   │   └── order-router.ts
│   └── app.ts           # Express app setup
├── server.ts            # Application entry point
├── .env                 # Environment variables
├── .gitignore          # Git ignore file
├── package.json        # Project metadata and dependencies
├── tsconfig.json       # TypeScript configuration
└── README.md           # Project documentation
```

Each module (user, product, order) follows a similar structure:

-   `*-controller.ts`: Request handlers and business logic
-   `*-model.ts`: Database schema and model definitions
-   `*-router.ts`: Route definitions and middleware configuration

## API Reference

### Users

-   **POST /api/user**: Create a new user
-   **PUT /api/user/:id**: Update user information
-   **GET /api/user/:id**: Retrieve user information
-   **GET /api/user/:id/orders**: Get orders for a specific user

### Products

-   **POST /api/product**: Create a new product
-   **PUT /api/product/:id**: Update product information
-   **GET /api/product/:id**: Retrieve product information
-   **GET /api/product/total-stock**: Get total stock quantity
-   **GET /api/product/:id/users**: Get users who bought a specific product

### Orders

-   **POST /api/order**: Create a new order
-   **PUT /api/order/:id**: Update order information
-   **GET /api/order/:id**: Retrieve order information
-   **GET /api/order/recent**: Get recent orders

## License

This project is licensed under the ISC License.
