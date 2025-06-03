# MLM-System (Affiliate Project) — Backend & Frontend Overview

This document summarizes the features and technical highlights of the MLM-System project, designed for affiliate and multi-level marketing operations. The system is built with a modern stack: **Node.js, Express, MongoDB, Next.js, and Docker**. It is modular, scalable, and ready for production deployment.

---

## 🚀 Features Delivered

### User Management & Authentication
- **User Registration & Login** (with email & password)
- **JWT-based Authentication** (secure, HTTP-only cookies)
- **Forgot/Reset Password** (email-based, secure token flow)
- **Profile Management**: Users can update their personal and bank details, including avatar upload and removal.
- **Change Password**: Users can securely change their password from their profile.
- **Admin User Support**: Admin flag in user schema for future admin panel.

### MLM Binary Tree Logic
- **Referral System**: Each user has a unique referral code.
- **Binary Tree Structure**: Users are placed in a binary tree (left/right child) for MLM logic.
- **Sponsor/Parent Tracking**: Each user tracks their sponsor and parent in the tree.

### API Gateway (Microservices Architecture)
- **Central API Gateway**: All frontend requests go through a single gateway.
- **Service Proxying**: Auth, user, and admin requests are routed to the appropriate backend service.
- **CORS & Security**: Configured for secure cross-origin requests.

### Admin Services (via API Gateway)
All admin APIs are accessible via the API Gateway at `/api/admin/...`.  
**Frontend developers:** Use these endpoints for admin dashboard and management features.  
**Authentication:** Admin routes require a valid admin JWT (set as `adminToken` cookie on login).

#### **Available Admin Routes via API Gateway**
| Method | Endpoint                  | Description                          | Auth Required |
|--------|---------------------------|--------------------------------------|--------------|
| POST   | `/api/admin/login`        | Admin login, returns JWT cookie      | No           |
| POST   | `/api/admin/logout`       | Admin logout, clears cookie          | Yes          |
| GET    | `/api/admin/me`           | Get admin profile info               | Yes          |
| PUT    | `/api/admin/change-password` | Change admin password              | Yes          |
| GET    | `/api/admin/users`        | List all users (for admin)           | Yes          |
| GET    | `/api/admin/user/:id`     | Get full user details by user ID     | Yes          |

> **Note:** All admin endpoints require the `adminToken` cookie or `Authorization: Bearer <token>` header.  
> The API Gateway handles authentication and proxies requests to the correct backend service.

### Frontend (Next.js)
- **Modern UI**: Built with Next.js, responsive and fast.
- **Profile Card**: Users can view and edit their profile, including avatar and bank details.
- **Sidebar**: Displays user info (name, email, avatar) and updates instantly after profile changes.
- **Change Password**: Integrated into the profile card, with instant feedback.
- **Authentication State**: Persistent login using secure cookies.
- **Error Handling & Loading States**: User-friendly feedback throughout the app.
- **Admin Panel Ready**: Easily integrate admin routes for dashboards, user management, and logs.

### DevOps & Deployment
- **Dockerized**: All services (API Gateway, User Service, Admin Service, Frontend) are containerized for easy deployment.
- **Docker Compose**: One command to run the entire stack locally or in production.
- **Environment Variables**: Secure, flexible configuration for all environments.

---

## 🗄️ Database Schema (User)

| Field                | Type      | Description                                  |
|----------------------|-----------|----------------------------------------------|
| name                 | String    | User's name                                  |
| email                | String    | User's email (unique)                        |
| password             | String    | Hashed password                              |
| referralCode         | String    | Unique code for referring others             |
| parentId             | ObjectId  | Parent in the binary tree                    |
| referralCodeLeft     | String    | Code for left child                          |
| referralCodeRight    | String    | Code for right child                         |
| phone                | Number    | User's phone number                          |
| country              | String    | Country (default: India)                     |
| panNumber            | String    | PAN number                                   |
| aadharNumber         | Number    | Aadhar number                                |
| avatar               | String    | Avatar URL or base64                         |
| bankDetails          | Object    | Bank info (accountNumber, ifscCode, bankName, accountHolderName) |
| isRootSponsor        | Boolean   | Is this the root sponsor?                    |
| leftUser             | ObjectId  | Left child in binary tree                    |
| rightUser            | ObjectId  | Right child in binary tree                   |
| isAdmin              | Boolean   | Admin flag                                   |
| resetPasswordToken   | String    | For password reset                           |
| resetPasswordExpires | Date      | Expiry for reset token                       |
| createdAt/updatedAt  | Date      | Timestamps                                   |

---

## 🔗 System Architecture

- **Frontend** (Next.js) → **API Gateway** (`/api/auth/...`, `/api/admin/...`, `/api/referral/...`)
- **API Gateway** proxies requests to **User Service** and **Admin Service**
- **User/Admin Services** connect to **MongoDB**
- **All services** are containerized and orchestrated with Docker Compose

---

## 🧑‍💻 Frontend Integration

### **User APIs** (via API Gateway)
- `POST /api/auth/register` — Register user
- `POST /api/auth/login` — Login
- `GET /api/auth/me` — Get current user
- `PUT /api/auth/profile` — Update profile
- `PUT /api/auth/change-password` — Change password
- `POST /api/auth/forgot-password` — Forgot password
- `POST /api/auth/reset-password` — Reset password
- `POST /api/auth/logout` — Logout

### **Admin APIs** (via API Gateway)
- `POST /api/admin/login` — Admin login (returns `adminToken` cookie)
- `POST /api/admin/logout` — Admin logout
- `GET /api/admin/me` — Get admin profile
- `PUT /api/admin/change-password` — Change admin password
- `GET /api/admin/users` — List all users (admin view)
- `GET /api/admin/user/:id` — Get full user details by user ID

**How to use in frontend:**
- Use the `/api/admin/...` endpoints for all admin dashboard features.
- On admin login, store the `adminToken` cookie (handled automatically if using `withCredentials: true` in axios/fetch).
- For protected admin routes, always send credentials/cookies.
- All responses and errors are standardized JSON.

---

## 🛠️ How to Run

### Local Development

```bash
# Backend
cd backend/api-gateway && npm install && npm run dev
cd ../user-service && npm install && npm run dev
cd ../admin-service && npm install && npm run dev

# Frontend
cd ../../frontend && npm install && npm run dev
```

### With Docker

```bash
docker-compose up --build
```
- API Gateway: [http://localhost:5000](http://localhost:5000)
- User Service: [http://localhost:5001](http://localhost:5001)
- Admin Service: [http://localhost:5002](http://localhost:5002)
- Frontend: [http://localhost:3000](http://localhost:3000)

---

## 📦 Project Structure

```
backend/
  api-gateway/
    src/routes/admin.js         # Admin API Gateway routes
    src/middlewares/adminAuth.js
  user-service/
    src/routes/adminRoutes.js   # User admin routes (for user data)
    src/controllers/adminUserController.js
  admin-service/
    src/routes/adminRoutes.js   # Admin service routes
    src/controllers/adminController.js
  shared/
frontend/
  components/
  pages/
  utils/
  styles/
```

---

## 📂 Key Files

- **Backend**
  - [`backend/api-gateway/src/routes/admin.js`](backend/api-gateway/src/routes/admin.js)
  - [`backend/api-gateway/src/middlewares/adminAuth.js`](backend/api-gateway/src/middlewares/adminAuth.js)
  - [`backend/user-service/src/routes/adminRoutes.js`](backend/user-service/src/routes/adminRoutes.js)
  - [`backend/user-service/src/controllers/adminUserController.js`](backend/user-service/src/controllers/adminUserController.js)
  - [`backend/admin-service/src/routes/adminRoutes.js`](backend/admin-service/src/routes/adminRoutes.js)
  - [`backend/admin-service/src/controllers/adminController.js`](backend/admin-service/src/controllers/adminController.js)
- **Frontend**
  - [`frontend/utils/adminService.js`](frontend/utils/adminService.js) *(for admin API calls)*
  - [`frontend/utils/api.js`](frontend/utils/api.js)

---

## 🎯 Highlights

- **Admin API Integration**: All admin routes are available via the API Gateway for easy frontend integration.
- **Instant Sidebar Update**: When a user updates their profile, the sidebar reflects changes instantly—no page refresh needed.
- **Secure & Modern**: JWT, bcrypt, and secure cookies for authentication.
- **Scalable**: Microservices-ready, Dockerized, and easy to extend.
- **User-Friendly**: Clean UI, clear error messages, and smooth user experience.

---

## 📄 License

Internal use only. Not for public distribution.

---