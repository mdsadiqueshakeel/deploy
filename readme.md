# MLM System (Multi-Level Marketing)

A complete MLM system with binary tree structure, built using Next.js, Express.js microservices, and MongoDB.

## 🌟 Overview

This MLM system provides a platform for managing multi-level marketing operations with features like user management, binary tree referrals, business volume tracking, and comprehensive admin controls.

## 🏗 Architecture

### Frontend (Next.js)
- Port: 3000
- Features:
  - User Dashboard
  - Admin Panel
  - Referral Management
  - Binary Tree Visualization
  - Real-time Business Volume Tracking

### Backend Microservices

1. **API Gateway**
   - Port: 5000
   - Entry point for all API requests
   - Handles routing and authentication
   - CORS enabled for frontend communication

2. **User Service**
   - Port: 5001
   - Manages user authentication
   - Handles referral logic
   - Binary tree management

3. **Admin Service**
   - Port: 5002
   - Admin authentication
   - User management
   - System statistics

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd MLM-System
```

2. **Set up environment variables**
```bash
# Copy environment files
cp .env.example api-gateway/.env
cp .env.example backend/user-service/.env
cp .env.example backend/admin-service/.env
```

3. **Install dependencies**
```bash
# Frontend
cd frontend
npm install

# API Gateway
cd ../api-gateway
npm install

# User Service
cd ../backend/user-service
npm install

# Admin Service
cd ../backend/admin-service
npm install
```

4. **Start the services**
```bash
# Frontend (Terminal 1)
cd frontend
npm run dev

# API Gateway (Terminal 2)
cd api-gateway
npm run dev

# User Service (Terminal 3)
cd backend/user-service
npm run dev

# Admin Service (Terminal 4)
cd backend/admin-service
npm run dev
```

## 🔌 Service URLs

- Frontend: http://localhost:3000
- API Gateway: http://localhost:5000
- User Service: http://localhost:5001
- Admin Service: http://localhost:5002

## 📝 Features

### User Features
- Registration and Authentication
- Binary Tree Position
- Referral Link Generation
- Business Volume Tracking
- Income Dashboard
- Profile Management
- Bank Details Management

### Admin Features
- Comprehensive User Management
- System Statistics Dashboard
- Business Volume Override
- User Status Management
- Transaction History
- Report Generation

## 🔒 Environment Variables

```env
# API Gateway
PORT=5000
USER_SERVICE_URL=http://localhost:5001
ADMIN_SERVICE_URL=http://localhost:5002

# User Service
PORT=5001
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email
EMAIL_PASS=your_app_password

# Admin Service
PORT=5002
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
USER_SERVICE_URL=http://localhost:5001
```

## 🗄️ Database Schema

### User Schema
- name: String
- email: String (unique)
- password: String (hashed)
- phone: Number
- referralCode: String
- parentId: ObjectId
- bankDetails: Object
  - accountNumber: Number
  - ifscCode: String
  - bankName: String
  - accountHolderName: String
- isActive: Boolean
- createdAt: Date
- updatedAt: Date

## 🔄 API Routes

### Auth Routes
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me
- PUT /api/auth/profile
- POST /api/auth/logout

### Admin Routes
- POST /api/admin/login
- GET /api/admin/users
- GET /api/admin/user/:id
- PUT /api/admin/user/:id
- GET /api/admin/dashboard

### User Routes
- GET /api/user/profile
- PUT /api/user/profile
- GET /api/user/referrals
- GET /api/user/business-volume

## 📁 Project Structure

```
MLM-System/
├── frontend/                   # Next.js frontend application
│   ├── components/            # Reusable components
│   │   ├── admin/            # Admin-specific components
│   │   │   ├── AdminLayout.js
│   │   │   └── AdminProtectedRoute.js
│   │   └── user/             # User-specific components
│   ├── pages/                # Next.js pages
│   │   ├── admin/           # Admin routes
│   │   │   ├── dashboard.js
│   │   │   ├── login.js
│   │   │   └── users/
│   │   │       ├── index.js
│   │   │       └── [userId].js
│   │   ├── user/            # User routes
│   │   │   ├── dashboard.js
│   │   │   └── profile.js
│   │   ├── _app.js
│   │   └── index.js
│   ├── public/              # Static files
│   ├── services/            # API services
│   │   └── api.js
│   └── styles/              # CSS styles
│
├── api-gateway/             # API Gateway service
│   ├── src/
│   │   ├── routes/
│   │   │   ├── adminRoutes.js
│   │   │   └── userRoutes.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   └── server.js
│   └── package.json
│
├── backend/
│   ├── user-service/        # User microservice
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   │   ├── auth.js
│   │   │   │   └── user.js
│   │   │   ├── models/
│   │   │   │   └── User.js
│   │   │   ├── routes/
│   │   │   │   └── userRoutes.js
│   │   │   └── server.js
│   │   └── package.json
│   │
│   └── admin-service/       # Admin microservice
│       ├── src/
│       │   ├── controllers/
│       │   │   └── adminController.js
│       │   ├── models/
│       │   │   └── Admin.js
│       │   ├── routes/
│       │   │   └── adminRoutes.js
│       │   └── server.js
│       └── package.json
│
├── .gitignore
├── README.md
└── package.json
```

## 🔧 Key Files Description

### Frontend
- `components/admin/AdminLayout.js`: Main layout for admin dashboard
- `components/admin/AdminProtectedRoute.js`: Authentication wrapper for admin routes
- `pages/admin/dashboard.js`: Admin dashboard with user management
- `pages/admin/users/[userId].js`: Individual user details page
- `services/api.js`: Axios configuration for API calls

### API Gateway
- `routes/adminRoutes.js`: Admin API route definitions
- `routes/userRoutes.js`: User API route definitions
- `middleware/auth.js`: Authentication middleware

### User Service
- `controllers/auth.js`: User authentication logic
- `controllers/user.js`: User management functions
- `models/User.js`: MongoDB user schema

### Admin Service
- `controllers/adminController.js`: Admin functionality
- `models/Admin.js`: MongoDB admin schema
- `routes/adminRoutes.js`: Admin route handlers

## 👥 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📜 License

This project is proprietary and confidential. Unauthorized copying or distribution is prohibited.