# 🪐 Aurae E-Commerce

A premium, minimalist e-commerce application designed for high-end fashion cataloging. Built with a decoupled architecture featuring a Vite/React client and an Express/PostgreSQL API, it incorporates verified customer reviews, dynamic variant management, JWT-based security with SMTP OTP verification, and a fully integrated SSLCommerz payment gateway.

---

## 🌐 Live Deployments

*   **Frontend Client (Vercel)**: [https://aurae-ecommerce.vercel.app](https://aurae-ecommerce.vercel.app)
*   **Backend Server API (Render)**: [https://aurae-ecommerce.onrender.com](https://aurae-ecommerce.onrender.com)

---

## 🛠️ Technology Stack

### Frontend Client
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=FFD62B)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)

*   **Framework & Bundler**: React 19 + Vite (Fast compilation, asset bundling)
*   **Styling**: Tailwind CSS v4 & PostCSS (High-contrast typography, glassmorphism UI tokens)
*   **State Management**: React Context (`AuthContext` for sessions, `CartContext` for cart drawer)

### Backend API
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

*   **Runtime & Server**: Node.js (v18+) & Express.js (v5)
*   **ORM & Database**: Prisma Client connected to PostgreSQL (Hosted on Neon)
*   **Security & OTP**: `bcryptjs` (passwords), `jsonwebtoken` (auth tokens), `SendGrid API` (Verification email OTP)
*   **Payment Gateway**: SSLCommerz LTS API (Redirects, background IPN webhook validation)

---

## 🌟 Key Features

*   🔒 **Secure OTP Authentication**: JWT-based session security combined with email OTP verification during registration.
*   📐 **Minimalist High-Contrast UI**: Curated, responsive layout, interactive product filters, sliding cart drawer, and sleek micro-animations.
*   📊 **Relational Database Model**: PostgreSQL tables mapped through Prisma with cascading updates, index optimizations, and database constraints.
*   ⭐ **Verified Purchaser Review System**: Anti-spam mechanisms restricting review logging to verified purchasers only, enforcing a strict one-review-per-product limit per user.
*   💳 **SSLCommerz Integration**: Online checkout flow with support for BDT gateway channels, automated transaction verifiers, and callback status handlers.
*   🛡️ **Admin Inventory Panel**: Role-based access control protecting product creation, category updates, and order journey tracker updates.

---

## 🗄️ Relational Database Schema

The relational database architecture is defined in [schema.prisma](file:///home/ahnaf/Desktop/Trial%20Projects/aurae-ecommerce/backend/prisma/schema.prisma):

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

Create a `.env` file in the `backend/` directory based on the keys below:

```env
# SendGrid API Key (used for sending signup validation OTPs)
SENDGRID_API_KEY="SG.your-sendgrid-api-key"

# Prisma PostgreSQL connection string
DATABASE_URL="postgresql://username:password@hostname:port/database?sslmode=require"

# JWT configuration key
JWT_SECRET="your-secure-jwt-secret-key"

# SSLCommerz Sandbox credentials
STORE_ID="your-sslcommerz-store-id"
STORE_PASSWORD="your-sslcommerz-store-password"

# Server Network addresses
BACKEND_URL="http://localhost:5000"
FRONTEND_URL="http://localhost:5173"
```

---

## 🚀 Installation & Local Development Setup

Follow these commands to get your local development environment up and running.

### 1. Configure & Launch Database & Backend

1. Navigate to the `backend/` directory and install the packages:
   ```bash
   cd backend
   npm install
   ```
2. Create your `.env` configuration file in the `backend/` folder based on the schema above.
3. Generate the Prisma Client:
   ```bash
   npx prisma generate
   ```
4. Apply the database migrations:
   ```bash
   npx prisma migrate dev --name init
   ```
5. Seed the database with sample products and categories:
   ```bash
   npm run seed
   ```
6. Run the backend server in reload/dev mode:
   ```bash
   npm run dev
   ```

### 2. Configure & Launch Frontend Client

1. Open a new terminal and navigate to the `frontend/` directory:
   ```bash
   cd frontend
   npm install
   ```
2. Run the client dev server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:5173](http://localhost:5173) in your web browser.

---

## 🔌 API Reference Guide

### 1. Authentication
Endpoint prefix: `/api/auth`

| Method | Endpoint | Access | Body Params | Description |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/signup` | Public | `{ name, email, password }` | Registers a new user and triggers verification OTP email |
| `POST` | `/verify-otp` | Public | `{ email, otp }` | Validates the OTP verification token |
| `POST` | `/login` | Public | `{ email, password }` | Authenticates credentials and returns a JWT token |

### 2. Products Catalog
Endpoint prefix: `/api/products`

| Method | Endpoint | Access | Body Params | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/all` | Public | *None* | Lists all catalog items along with variants and category relations |
| `GET` | `/:id` | Public | *None* | Retrieve product detail by database ID |
| `POST` | `/add` | Admin | `{ name, description, basePrice, categoryId, variants: [...] }` | Creates a new product and inserts corresponding variants |
| `PUT` | `/:id` | Admin | `{ name, basePrice, description, ... }` | Updates item detail fields |
| `DELETE`| `/:id` | Admin | *None* | Deletes the product. Associated variants cascade delete |

### 3. Categories
Endpoint prefix: `/api/categories`

| Method | Endpoint | Access | Body Params | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/` | Public | *None* | Returns all product categories |
| `POST` | `/` | Admin | `{ name }` | Registers a new category |

### 4. Orders Ledger
Endpoint prefix: `/api/orders`

| Method | Endpoint | Access | Body Params | Description |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/` | User | `{ items: [...], totalAmount }` | Logs a pending transaction request |
| `GET` | `/my-orders` | User | *None* | Returns order history details of the logged-in user |
| `GET` | `/all` | Admin | *None* | Returns a complete listing of all store orders |
| `PUT` | `/:id/status`| Admin | `{ status: "PROCESSING" }` | Updates order tracking milestones |

### 5. Payments (SSLCommerz)
Endpoint prefix: `/api/payment`

| Method | Endpoint | Access | Body Params | Description |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/init` | User | `{ items, totalAmount, customerPhone, address, ... }` | Initiates payment gateway details and yields checkout URL |
| `POST` | `/success/:tranId` | Webhook | *None* | Payment callback redirect. Adjusts item stock count on success |
| `POST` | `/fail/:tranId` | Webhook | *None* | Redirect trigger on payment failure |

### 6. Product Reviews
Endpoint prefix: `/api/reviews`

| Method | Endpoint | Access | Body Params | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/:productId` | Public | *None* | Lists all customer reviews logged for the target product |
| `POST` | `/` | User | `{ productId, rating, comment }` | Publishes a review. Only verified buyers can submit |

---

## ☁️ Deployment Architecture

This application runs as a decoupled architecture (separated frontend client and backend server):

### Frontend Hosting (Vercel)
*   **Subdirectory Root**: `/frontend`
*   **Build Command**: `vite build`
*   **Output folder**: `dist`
*   **Redirect Handling**: Uses `vercel.json` rewrites for SPA client-side routing fallback support.
*   **Configured Variables**: `VITE_API_URL` pointing to `https://aurae-ecommerce.onrender.com/api`

### Backend Hosting (Render)
*   **Service Platform**: Web Service
*   **Subdirectory Root**: `/backend`
*   **Runtime Environment**: `Node`
*   **Build Command**: `npm install && npm run build` (triggering Prisma generator compile)
*   **Start Command**: `npm start`
*   **Configured Variables**: Database connection URL (`DATABASE_URL`), JWT configs, SendGrid API key (`SENDGRID_API_KEY`), SSLCommerz keys, and CORS settings (`FRONTEND_URL` and `BACKEND_URL`).
