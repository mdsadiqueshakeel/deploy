MLM-System (Affiliate Project) — Backend & Frontend Overview

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
- **Service Proxying**: Auth and user requests are routed to the User Service.
- **CORS & Security**: Configured for secure cross-origin requests.

### Frontend (Next.js)
- **Modern UI**: Built with Next.js, responsive and fast.
- **Profile Card**: Users can view and edit their profile, including avatar and bank details.
- **Sidebar**: Displays user info (name, email, avatar) and updates instantly after profile changes.
- **Change Password**: Integrated into the profile card, with instant feedback.
- **Authentication State**: Persistent login using secure cookies.
- **Error Handling & Loading States**: User-friendly feedback throughout the app.

### DevOps & Deployment
- **Dockerized**: All services (API Gateway, User Service, Frontend) are containerized for easy deployment.
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

- **Frontend** (Next.js) → **API Gateway** (`/api/auth/...`)
- **API Gateway** proxies requests to **User Service**
- **User Service** connects to **MongoDB**
- **All services** are containerized and orchestrated with Docker Compose

---

## 🧑‍💻 Frontend Integration

- **Register/Login**: `/api/auth/register`, `/api/auth/login`
- **Profile**: `/api/auth/me` (get), `/api/auth/profile` (update)
- **Change Password**: `/api/auth/change-password`
- **Forgot/Reset Password**: `/api/auth/forgot-password`, `/api/auth/reset-password`
- **Logout**: `/api/auth/logout`
- **All endpoints** are protected with JWT and use secure cookies

---

## 🛠️ How to Run

### Local Development

```bash
# Backend
cd backend/api-gateway && npm install && npm run dev
cd ../user-service && npm install && npm run dev

# Frontend
cd ../../frontend && npm install && npm run dev
```

### With Docker

```bash
docker-compose up --build
```
- API Gateway: [http://localhost:5000](http://localhost:5000)
- User Service: [http://localhost:5001](http://localhost:5001)
- Frontend: [http://localhost:3000](http://localhost:3000)

---

## 📦 Project Structure

```
backend/
  api-gateway/
  user-service/
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
  - [`backend/api-gateway/src/routes/auth.js`](backend/api-gateway/src/routes/auth.js)
  - [`backend/user-service/src/controllers/auth.js`](backend/user-service/src/controllers/auth.js)
  - [`backend/user-service/src/models/User.js`](backend/user-service/src/models/User.js)
- **Frontend**
  - [`frontend/components/ProfileCard.js`](frontend/components/ProfileCard.js)
  - [`frontend/components/Sidebar.js`](frontend/components/Sidebar.js)
  - [`frontend/utils/profileService.js`](frontend/utils/profileService.js)
  - [`frontend/utils/api.js`](frontend/utils/api.js)

---

## 🎯 Highlights

- **Instant Sidebar Update**: When a user updates their profile, the sidebar reflects changes instantly—no page refresh needed.
- **Secure & Modern**: JWT, bcrypt, and secure cookies for authentication.
- **Scalable**: Microservices-ready, Dockerized, and easy to extend.
- **User-Friendly**: Clean UI, clear error messages, and smooth user experience.

---

## 📄 License

Internal use only. Not for public distribution.

---