# Mini E-Commerce

## Overview
This repository contains two services:

- **mini-ecom-back** – Spring Boot backend providing REST APIs.
- **mini-ecom-front** – Next.js frontend for the customer interface.

## Setup
### Backend
```bash
cd mini-ecom-back
./mvnw spring-boot:run
```

### Frontend
```bash
cd mini-ecom-front
npm install
npm run dev
```

## Project Architecture
- **Controllers** such as `AuthController`, `ProductController`, `OrderController`, and `AdminController` define HTTP endpoints.
- **Entities** like `User`, `Product`, `Order`, and `OrderItem` represent database models.
- **Context Providers** `AuthProvider` and `CartProvider` manage authentication and cart state on the frontend.

## Default Admin & Database
- Default admin credentials: `admin@admin.com` / `123456`.
- The backend uses an H2 file database (`./data/ecdb`) with a console available at `/h2`.

## Notes
This project covers the minimum requested setup. Production-ready e-commerce applications also require features such as email verification, images and payment processing. etc..
