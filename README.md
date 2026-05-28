# Aurae E-Commerce

A premium, minimalist e-commerce application designed for high-end fashion cataloging, featuring verified customer reviews, dynamic variant management, JWT-based security with email OTP verification, and a fully integrated SSLCommerz payment gateway.

---

## 🌐 Live Deployments

*   **Frontend (Vercel)**: [https://aurae-ecommerce.vercel.app](https://aurae-ecommerce.vercel.app)
*   **Backend API (Render)**: [https://aurae-ecommerce.onrender.com](https://aurae-ecommerce.onrender.com)

---

## 🌟 Key Features

*   **Secure Authentication & Verification**:
    *   JWT-based user authentication.
    *   Signup flows integrated with OTP validation sent directly via SMTP (`Nodemailer`).
    *   Role-based access control protecting administrative actions.
*   **Minimalist Frontend UI**:
    *   Curated layouts built with **React 19**, **Vite**, and **Tailwind CSS v4**.
    *   Refined micro-animations, glassmorphism design tokens, and smooth responsive layouts.
    *   Global state management via React Context (`AuthContext`, `CartContext`).
    *   Slide-out Cart drawer, and dynamic interactive filters.
*   **Comprehensive Database & Catalog**:
    *   PostgreSQL database mapping managed via **Prisma ORM**.
    *   Structured models for `User`, `Category`, `Product`, `ProductVariant`, `Order`, `OrderItem`, and `Review`.
    *   Seamless transactional migrations and mock data seeding.
*   **Verified Purchase Review Engine**:
    *   Anti-spam mechanisms restricting reviews to verified product purchasers only.
    *   Constraint enforcing a maximum of one review per user per product.
*   **SSLCommerz Payment Gateway**:
    *   Seamless integration of the SSLCommerz payment gateway.
    *   Secure checkout initialization, redirects, and automated IPN/webhooks (`success`, `fail`, `cancel`).
*   **Admin Dashboard**:
    *   Comprehensive admin panel allowing inventory management (CRUD for products/variants/categories).
    *   Real-time order listing and status updates (e.g., `PENDING` ➔ `PROCESSING` ➔ `SHIPPED` ➔ `DELIVERED`).

---

## 🛠️ Technology Stack

### Backend (Server)
*   **Runtime Environment**: Node.js (v18+)
*   **Framework**: Express.js (v5)
*   **Database ORM**: Prisma Client
*   **Database engine**: PostgreSQL (hosted on Neon)
*   **Security**: bcryptjs (Password hashing) & JSON Web Tokens (Session state)
*   **Communications**: Nodemailer (Email SMTP client)
*   **Payments**: SSLCommerz LTS

### Frontend (Client)
*   **Bundler & Core**: Vite, React 19
*   **Styling**: Tailwind CSS v4, PostCSS
*   **Routing**: React Router DOM (v7)
*   **HTTP Client**: Axios
*   **Icons**: Lucide React

---

## 🗄️ Database Schema & Architecture

The database schema is defined in [schema.prisma](file:///home/ahnaf/Desktop/Trial%20Projects/aurae-ecommerce/backend/prisma/schema.prisma). Below is the relational architecture diagram representing the data models:

```mermaid
erDiagram
    User ||--o{ Order : places
    User ||--o{ Review : writes
    Category ||--o{ Product : classifies
    Product ||--o{ ProductVariant : contains
    Product ||--o{ OrderItem : details
    Product ||--o{ Review : receives
    Order ||--|{ OrderItem : includes

    User {
        Int id PK
        String name
        String email UK
        String password
        Role role "USER | ADMIN"
        Boolean isVerified
        String otp
        DateTime otpExpiresAt
        DateTime createdAt
    }

    Category {
        Int id PK
        String name UK
    }

    Product {
        Int id PK
        String name
        String description
        Float basePrice
        String imageUrl
        Int categoryId FK
        DateTime createdAt
    }

    ProductVariant {
        Int id PK
        Int productId FK
        String size
        String color
        Int stock
        Float price
    }

    Order {
        Int id PK
        Int userId FK
        Float totalAmount
        String status "PENDING | PROCESSING | SHIPPED | DELIVERED"
        DateTime createdAt
    }

    OrderItem {
        Int id PK
        Int orderId FK
        Int productId FK
        Int quantity
        Float price
        String size
        String color
    }

    Review {
        Int id PK
        Int rating "1 - 5"
        String comment
        DateTime createdAt
        Int userId FK
        Int productId FK
    }
```

---

## ⚙️ Environment Configuration

Create a `.env` file in the `backend/` directory based on the following keys:

```env
# Mailer configuration for SMTP OTP sends
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-specific-smtp-password"

# Connection string for your PostgreSQL instance
DATABASE_URL="postgresql://username:password@hostname:port/database?sslmode=require"

# JWT configuration
JWT_SECRET="your-secure-jwt-secret-key"

# SSLCommerz sandbox credentials
STORE_ID="your-sslcommerz-store-id"
STORE_PASSWORD="your-sslcommerz-store-password"

# Network addresses
BACKEND_URL="http://localhost:5000"
FRONTEND_URL="http://localhost:5173"
```

---

## 🚀 Installation & Local Development Setup

Follow these steps to set up the project locally.

### Prerequisites
*   Node.js (version 18 or above recommended)
*   A running PostgreSQL database instance (local or Neon/AWS RDS cloud instance)

### 1. Clone & Set Up Repositories

First, clone the repository and navigate into the root directory:
```bash
cd aurae-ecommerce
```

### 2. Configure & Seed the Backend Database

1.  Navigate to the `backend/` directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Set up your `.env` configuration file in the `backend/` folder (using the keys detailed above).
4.  Generate Prisma Client:
    ```bash
    npx prisma generate
    ```
5.  Run the Prisma migrations to create tables in PostgreSQL:
    ```bash
    npx prisma migrate dev --name init
    ```
6.  Seed the database with default categories, products, and variants:
    ```bash
    npm run seed
    ```

### 3. Spin Up Backend Server
Run the backend in development mode (starts Node with `nodemon` auto-reload):
```bash
npm run dev
```
The server will boot up and listen on port `5000` (or the port defined in `.env`).

### 4. Configure & Launch Frontend Client

1.  Open a new terminal session and navigate to the `frontend/` folder:
    ```bash
    cd frontend
    ```
2.  Install client dependencies:
    ```bash
    npm install
    ```
3.  Run the client application in development mode:
    ```bash
    npm run dev
    ```
4.  Open [http://localhost:5173](http://localhost:5173) in your web browser.

---

## 🔌 API Reference Guide

### 1. Authentication (`/api/auth`)

*   **`POST /api/auth/signup`**: Creates a new user profile and triggers an OTP verification email to the user.
    *   *Body*: `{ "name": "John Doe", "email": "john@example.com", "password": "password123" }`
*   **`POST /api/auth/verify-otp`**: Validates the OTP token emailed during signup.
    *   *Body*: `{ "email": "john@example.com", "otp": "123456" }`
*   **`POST /api/auth/login`**: Authenticates user credentials and signs a JWT token.
    *   *Body*: `{ "email": "john@example.com", "password": "password123" }`
    *   *Returns*: `{ "token": "JWT_TOKEN", "user": { "id": 1, "name": "John Doe", "email": "john@example.com", "role": "USER" } }`

### 2. Products Catalog (`/api/products`)

*   **`GET /api/products/all`**: Fetch all products with their associated variants and categories. *(Public)*
*   **`GET /api/products/:id`**: Fetch a single product detail with nested category/variants by database ID. *(Public)*
*   **`POST /api/products/add`**: Add a new product and create nested variants simultaneously. *(Admin Only)*
    *   *Headers*: `Authorization: Bearer <TOKEN>`
    *   *Body*:
        ```json
        {
          "name": "Linen Summer Shirt",
          "description": "Breathable high-quality casual shirt.",
          "basePrice": 49.99,
          "categoryId": 1,
          "variants": [
            { "size": "M", "color": "Blue", "stock": 15 },
            { "size": "L", "color": "Blue", "stock": 20 }
          ]
        }
        ```
*   **`PUT /api/products/:id`**: Update product attributes (such as price, categories, descriptions). *(Admin Only)*
*   **`DELETE /api/products/:id`**: Deletes a product. If cascades are enabled, variants are removed automatically. *(Admin Only)*

### 3. Categories (`/api/categories`)

*   **`GET /api/categories`**: Lists all catalog categories. *(Public)*
*   **`POST /api/categories`**: Creates a new category entity. *(Admin Only)*
    *   *Body*: `{ "name": "Outerwear" }`

### 4. Orders (`/api/orders`)

*   **`POST /api/orders`**: Create a new pending order transaction. *(Protected)*
    *   *Body*:
        ```json
        {
          "items": [
            { "id": 2, "quantity": 1, "basePrice": 55.00, "size": "M", "color": "Sage" }
          ],
          "totalAmount": 55.00
        }
        ```
*   **`GET /api/orders/my-orders`**: Retrieve order history for the authenticated user. *(Protected)*
*   **`GET /api/orders/all`**: Fetch every order stored in database. *(Admin Only)*
*   **`PUT /api/orders/:id/status`**: Update the status tag of an order. *(Admin Only)*
    *   *Body*: `{ "status": "SHIPPED" }`

### 5. Payments (`/api/payment`)

*   **`POST /api/payment/init`**: Prepares and initialises an SSLCommerz gateway URL session. *(Protected)*
    *   *Body*: `{ "orderId": 5, "totalAmount": 55.00 }`
    *   *Returns*: `{ "gatewayUrl": "https://sandbox.sslcommerz.com/...redirect-link" }`
*   **`POST /api/payment/success/:tranId`**: Gateway callback webhook invoked upon successful payment. Redirects the client to payment success state. *(Internal)*
*   **`POST /api/payment/fail/:tranId`**: Gateway callback webhook invoked upon payment failure or user cancellation. *(Internal)*

### 6. Reviews (`/api/reviews`)

*   **`GET /api/reviews/:productId`**: Publicly fetch review feedback for a product. *(Public)*
*   **`POST /api/reviews`**: Authenticates and posts reviews. Restricted to users with verified purchases of the product. *(Protected)*
    *   *Body*: `{ "productId": 2, "rating": 5, "comment": "Excellent texture and shade!" }`

## ☁️ Deployment

This project is configured for cloud deployment with a decoupled architecture (frontend client + backend server):

### Frontend (Vercel)
*   **Root Directory**: `frontend`
*   **Build Command**: `vite build` (preset by Vercel)
*   **Output Directory**: `dist`
*   **Routing**: Handled dynamically using `vercel.json` rewrites for client-side routing support.
*   **Environment Variables**: `VITE_API_URL` pointing to the deployed Render backend API (`https://aurae-ecommerce.onrender.com/api`).

### Backend (Render)
*   **Service Type**: Web Service
*   **Root Directory**: `backend`
*   **Runtime**: `Node`
*   **Build Command**: `npm install && npm run build` (runs `prisma generate` to compile DB client)
*   **Start Command**: `npm start` (runs `node server.js`)
*   **Environment Variables**: Configured for Neon Database URL, SSLCommerz credentials, JWT keys, and CORS origin urls (`FRONTEND_URL` and `BACKEND_URL`).

---

## 🔒 Security Practices

*   **Credential Hashing**: Uses `bcryptjs` with 10 salt rounds to hash database passwords.
*   **Payload Authentication**: Protects critical routes using JWT (JSON Web Tokens) inside the HTTP Authorization headers (`Bearer <token>`).
*   **SQL Injection Guard**: Utilizes Prisma ORM which leverages parameterized database queries natively.
*   **CORS Configuration**: Restricts origin requests strictly to the authorized client application URL in the server configuration.
