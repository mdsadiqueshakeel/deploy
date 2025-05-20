# MLM-System Backend

This backend powers the MLM-System (Affiliate Project) and exposes all APIs needed for user management, authentication, referral logic, and more. It is designed to be consumed by a frontend (React, Vue, etc.) via the API Gateway.

---

## 📦 Project Structure

```
backend/
  api-gateway/      # Main entrypoint for all frontend/backend API calls
  user-service/     # Handles user, auth, and referral logic
  shared/           # Shared utilities
  .env.example      # Example environment variables
  readme.md         # This file
```

---

## 🗄️ Database Schema

The backend uses **MongoDB**. The main user schema is:

| Field                | Type      | Description                                  |
|----------------------|-----------|----------------------------------------------|
| name                 | String    | User's name                                  |
| email                | String    | User's email (unique)                        |
| password             | String    | Hashed password                              |
| referralCode         | String    | Unique code for referring others             |
| sponsorId            | ObjectId  | User who directly referred this user         |
| parentId             | ObjectId  | Parent in the binary tree                    |
| referralCodeLeft     | String    | Code for left child                          |
| referralCodeRight    | String    | Code for right child                         |
| isRootSponsor        | Boolean   | Is this the root sponsor?                    |
| leftUser             | ObjectId  | Left child in binary tree                    |
| rightUser            | ObjectId  | Right child in binary tree                   |
| isAdmin              | Boolean   | Admin flag                                   |
| resetPasswordToken   | String    | For password reset                           |
| resetPasswordExpires | Date      | Expiry for reset token                       |
| createdAt/updatedAt  | Date      | Timestamps                                   |

See [`user-service/src/models/User.js`](user-service/src/models/User.js) for details.

---

## 🔗 Service Connections

- **Frontend** → **API Gateway** (`/api/auth/...`)
- **API Gateway** proxies requests to **User Service**
- **User Service** connects to **MongoDB**

---

## 🚀 How to Run (with Docker)

1. **Copy environment variables:**

   ```
   cp .env.example user-service/.env
   cp .env.example api-gateway/.env
   # Edit the .env files with your secrets and DB URI
   ```

2. **Start all services:**

   ```
   docker-compose up --build
   ```

   - API Gateway: [http://localhost:5000](http://localhost:5000)
   - User Service: [http://localhost:5001](http://localhost:5001)

3. **Seed a root sponsor (optional):**

   ```
   cd user-service
   node seed.js
   ```

---

## 🛠️ Local Development (without Docker)

1. **Install dependencies:**

   ```
   cd api-gateway && npm install
   cd ../user-service && npm install
   ```

2. **Start services:**

   ```
   # In one terminal
   cd api-gateway && npm run dev

   # In another terminal
   cd user-service && npm run dev
   ```

---

## 🔑 API Endpoints (Frontend Integration)

All endpoints are available via the API Gateway (`http://localhost:5000/api/auth/...`):

| Method | Endpoint                | Description                       | Body/Params                          |
|--------|-------------------------|-----------------------------------|--------------------------------------|
| POST   | `/api/auth/register`    | Register new user                 | `{ name, email, password, referralCode }` |
| POST   | `/api/auth/login`       | Login user                        | `{ email, password }`                |
| POST   | `/api/auth/forgot-password` | Send password reset email      | `{ email }`                          |
| POST   | `/api/auth/reset-password`  | Reset password                 | `{ token, password }`                |
| POST   | `/api/auth/logout`      | Logout (clears cookie)            |                                      |
| GET    | `/api/auth/me`          | Get current user profile          | (JWT cookie required)                |
| GET    | `/api/referral/validate/:referralCode` | Validate referral code |                                      |

- **JWT tokens** are set as HTTP-only cookies on login.
- **Frontend** should send credentials (cookies) with requests to access protected endpoints.

---

## 🧑‍💻 Frontend Integration Tips

- **Register/Login:** Use `/api/auth/register` and `/api/auth/login`. On login, a JWT cookie is set.
- **Auth State:** Use `/api/auth/me` to get the current user (send cookie).
- **Password Reset:** Use `/api/auth/forgot-password` and `/api/auth/reset-password`.
- **Referral Codes:** Validate codes with `/api/referral/validate/:referralCode` before registration.
- **Logout:** Call `/api/auth/logout` to clear the session.

**CORS:** The API Gateway is configured for `http://localhost:3000` (React default). Update in [`api-gateway/src/index.js`](api-gateway/src/index.js) if needed.

---

## ⚙️ Environment Variables

See `.env.example` for all required variables:

```
MONGO_URI=your-mongodb-uri
JWT_SECRET=your-jwt-secret
API_GATEWAY_PORT=5000
USER_SERVICE_PORT=5001
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email
EMAIL_PASS=your-app-password
EMAIL_FROM=your-email
```

---

## 📝 Notes

- All passwords are hashed with bcrypt.
- Referral logic supports both direct and binary tree relationships.
- Admin users can be seeded via `seed.js`.
- All errors are returned as JSON.

---

## 📂 Useful Files

- [`api-gateway/src/routes/auth.js`](api-gateway/src/routes/auth.js) — All proxied auth endpoints
- [`user-service/src/controllers/auth.js`](user-service/src/controllers/auth.js) — Auth logic
- [`user-service/src/controllers/referral.js`](user-service/src/controllers/referral.js) — Referral validation

---

## 📄 License

Internal use only. Not for public distribution.