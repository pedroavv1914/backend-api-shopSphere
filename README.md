# 🛍️ ShopSphere Backend

🔗 A robust RESTful API built with Express, PostgreSQL, and Prisma to power a modern e-commerce platform.

## 📋 Table of Contents
- [✨ Features](#features)
- [🛠️ Technologies Used](#technologies-used)
- [🏗️ Project Structure](#project-structure)
- [🚀 Getting Started](#getting-started)
- [📡 API Endpoints](#api-endpoints)
- [🔒 Authentication](#authentication)
- [💳 Payment Integration](#payment-integration)
- [🐳 Docker Support](#docker-support)
- [🤝 Contributing](#contributing)

## ✨ Features
- 👤 User authentication and authorization with JWT
- 🛒 Complete shopping cart functionality
- 📦 Product catalog with categories
- 📝 Order management system
- 💳 Secure payment processing with Stripe
- 📧 Email notifications for order confirmations
- 🖼️ File uploads for product images
- 🔐 Role-based access control (Admin/Client)
- 🐳 Docker containerization for easy deployment

## 🛠️ Technologies Used
- **Express.js**: Fast, unopinionated web framework for Node.js
- **PostgreSQL**: Powerful, open-source relational database
- **Prisma**: Next-generation ORM for Node.js and TypeScript
- **JWT**: JSON Web Tokens for secure authentication
- **Stripe**: Payment processing platform
- **Nodemailer**: Module for email sending
- **Multer**: Middleware for handling file uploads
- **Docker**: Containerization platform

## 🏗️ Project Structure
```
backend/
├── prisma/                # 🗄️ Database schema and migrations
│   ├── migrations/        # 🔄 Database migration files
│   └── schema.prisma      # 📝 Prisma schema definition
├── src/                   # 📂 Source code
│   ├── controllers/       # 🎮 Business logic controllers
│   ├── middlewares/       # 🔍 Express middlewares
│   ├── routes/            # 🛣️ API route definitions
│   ├── utils/             # 🔧 Utility functions
│   └── index.js           # 🚀 Application entry point
├── uploads/               # 📁 Uploaded files storage
├── .env                   # 🔑 Environment variables
├── Dockerfile             # 🐳 Docker configuration
├── docker-compose.yml     # 🐙 Docker Compose configuration
└── package.json           # 📦 Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL database
- Stripe account for payments

### Installation

1. Clone the repository:
```bash
git clone https://github.com/pedroavv1914/backend-api-shopSphere.git
cd backend-api-shopSphere/backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```
DATABASE_URL=postgresql://username:password@localhost:5432/shopsphere
JWT_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
FRONTEND_URL=http://localhost:3000
PORT=4000
```

4. Run database migrations:
```bash
npx prisma migrate dev
```

5. Start the development server:
```bash
npm run dev
```

The API will run by default at: http://localhost:4000

### Using Docker

1. Build and run with Docker Compose:
```bash
docker-compose up -d
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login and get JWT token

### Categories
- `GET /api/categories` — List all categories
- `GET /api/categories/:id` — Get a specific category
- `POST /api/categories` — Create a new category (Admin only)
- `PUT /api/categories/:id` — Update a category (Admin only)
- `DELETE /api/categories/:id` — Delete a category (Admin only)

### Products
- `GET /api/products` — List all products
- `GET /api/products/:id` — Get a specific product
- `POST /api/products` — Create a new product (Admin only)
- `PUT /api/products/:id` — Update a product (Admin only)
- `DELETE /api/products/:id` — Delete a product (Admin only)

### Cart
- `GET /api/cart` — Get user's cart
- `POST /api/cart` — Add item to cart
- `PUT /api/cart/:id` — Update cart item quantity
- `DELETE /api/cart/:id` — Remove item from cart

### Orders
- `GET /api/orders` — List user's orders
- `GET /api/orders/:id` — Get a specific order
- `POST /api/orders` — Create a new order from cart
- `PUT /api/orders/:id` — Update order status (Admin only)

### Payments
- `POST /api/payments/:orderId` — Create payment session for order
- `POST /api/payments/webhook` — Stripe webhook endpoint

## 🔒 Authentication

The API uses JWT (JSON Web Tokens) for authentication. To access protected endpoints:

1. Login to get a token
2. Include the token in the Authorization header of your requests:
```
Authorization: Bearer your_token_here
```

Role-based authorization is implemented with two roles:
- `CLIENT`: Regular users who can shop
- `ADMIN`: Administrators who can manage products, categories, and orders

## 💳 Payment Integration

ShopSphere integrates with Stripe for secure payment processing:

1. When a user places an order, they are redirected to a Stripe Checkout session
2. After successful payment, Stripe sends a webhook notification
3. The order status is updated and a confirmation email is sent

## 🐳 Docker Support

The application includes Docker configuration for easy deployment:

- `Dockerfile`: Defines the container image
- `docker-compose.yml`: Orchestrates the application and database containers

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

Made with ❤️ by Pedro
