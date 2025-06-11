# User Service - MLM System

This service is part of the **MLM-System** backend. It handles user authentication, registration, profile management, password reset, referral logic, user placement (how users are connected in the referral/binary tree), and admin operations. It is designed to be accessed via the API Gateway and communicates with a MongoDB database.

---

## 📁 Directory Structure

```
user-service/
│
├── .env                # Environment variables (not committed)
├── .env.example        # Example environment variables
├── Dockerfile          # Docker build file
├── index.js            # Main entry point (legacy, use src/index.js)
├── package.json        # NPM dependencies and scripts
├── seed.js             # Script to seed admin users
└── src/
    ├── controllers/
    │   ├── auth.js         # User authentication, registration, profile, password logic
    │   ├── admin.js        # Admin-specific logic
    │   └── referral.js     # Referral tree and validation logic
    ├── middlewares/
    │   ├── jwtAuth.js      # JWT authentication middleware
    │   └── ...             # Other custom middlewares
    ├── models/
    │   └── User.js         # Mongoose User schema
    ├── routes/
    │   ├── auth.js         # Auth/user-related API routes
    │   ├── adminRoutes.js  # Admin API routes
    │   └── referral.js     # Referral API routes
    ├── utils/
    │   ├── referralUtils.js # Referral code generation, tree helpers
    │   ├── sendEmail.js     # Email sending utility (nodemailer)
    │   └── wrapAsync.js     # Async error wrapper for routes
    └── index.js            # Main Express app entry point
```

---

## 🚦 Main Functionality

- **User Registration & Login:**  
  Handles new user sign-up, login, and JWT issuance.
- **Profile Management:**  
  Fetch and update user profile, including personal and bank details.
- **Password Management:**  
  Forgot password (email reset link), reset password, and change password.
- **Referral System:**  
  Supports direct and binary tree referral logic, referral code validation.
- **User Placement (Referral/Binary Tree):**  
  When a user registers with a referral code, the system places them in the correct position in the referral/binary tree. Placement logic ensures each user is connected to their sponsor and, if using a binary tree, to the left or right position as per business rules. This structure enables tracking of downlines and network growth.
- **Admin Operations:**  
  Admin login, user management, and admin-specific endpoints.
- **Email Notifications:**  
  Sends password reset and other transactional emails.
- **Security:**  
  Uses JWT for authentication, bcrypt for password hashing, and CORS for frontend access.

---

## 🛡️ Middlewares

- **CORS:**  
  Configured to allow requests from the frontend (`CLIENT_URL` or `http://localhost:3000`), with credentials and standard headers.
- **cookieParser:**  
  Parses cookies for JWT and session management.
- **express.json:**  
  Parses incoming JSON requests.
- **jwtAuth:**  
  Protects routes that require authentication by verifying JWT tokens.
- **wrapAsync:**  
  Utility to catch async errors in route handlers and pass them to Express error handling.
- **Error Handler:**  
  Catches all errors and returns a JSON response with error details.

---

## 🛣️ Routes Overview

### `/api/auth` (see [`src/routes/auth.js`](src/routes/auth.js))

| Method | Endpoint                | Description                        | Middleware      |
|--------|-------------------------|------------------------------------|-----------------|
| POST   | `/register`             | Register new user                  |                 |
| POST   | `/login`                | User login (returns JWT)           |                 |
| POST   | `/forgot-password`      | Request password reset email       |                 |
| POST   | `/reset-password`       | Reset password with token          |                 |
| PUT    | `/profile`              | Update user profile                | `jwtAuth`       |
| PUT    | `/change-password`      | Change password                    | `jwtAuth`       |
| GET    | `/me`                   | Get current user profile           | `jwtAuth`       |

### `/api/admin` (see [`src/routes/adminRoutes.js`](src/routes/adminRoutes.js))

| Method | Endpoint                | Description                        | Middleware      |
|--------|-------------------------|------------------------------------|-----------------|
| POST   | `/login`                | Admin login                        |                 |
| GET    | `/users`                | List all users                     | `jwtAuth` (admin only) |
| ...    | ...                     | Other admin operations             |                 |

### `/api/referral` (see [`src/routes/referral.js`](src/routes/referral.js))

| Method | Endpoint                | Description                        | Middleware      |
|--------|-------------------------|------------------------------------|-----------------|
| GET    | `/validate/:code`       | Validate referral code             |                 |
| GET    | `/tree/:userId`         | Get referral tree for user         | `jwtAuth`       |
| POST   | `/placement`            | Place a new user under a sponsor (binary/left/right logic) | `jwtAuth` or as required |
| ...    | ...                     | Other referral endpoints           |                 |

---

## 🌳 User Placement & Connection Logic

### How User Placement Works

- **Referral Code:**  
  When a new user registers, they provide a referral code. The system validates this code and determines the sponsor.
- **Binary Tree Placement:**  
  The system checks the sponsor's left and right positions. If a position is available, the new user is placed there. If both are filled, placement may follow a spillover or other business logic.
- **User Document Fields:**
  - `sponsorId`: The direct sponsor (referrer).
  - `parentId`: The parent in the binary tree (may be same as sponsor or determined by placement logic).
  - `leftUser` / `rightUser`: References to the user's left and right downlines.
  - `referralCodeLeft` / `referralCodeRight`: Codes for left/right placement.
- **Placement Endpoint:**  
  The `/api/referral/placement` endpoint (or handled during registration) manages this logic, ensuring users are connected correctly in the tree.

### Example Placement Flow

1. **User registers with referral code.**
2. **System validates the code and finds the sponsor.**
3. **System checks sponsor's left/right positions:**
   - If left is empty, user is placed left.
   - If right is empty, user is placed right.
   - If both are filled, system finds next available position (spillover).
4. **User document is updated with sponsor/parent/left/right references.**
5. **Sponsor's user document is updated to reference the new user.**

---

## 🧩 Key Files

- [`src/controllers/auth.js`](src/controllers/auth.js):  
  All user authentication, registration, profile, and password logic.
- [`src/controllers/referral.js`](src/controllers/referral.js):  
  Referral validation and tree logic.
- [`src/models/User.js`](src/models/User.js):  
  Mongoose schema for users, including referral fields.
- [`src/middlewares/jwtAuth.js`](src/middlewares/jwtAuth.js):  
  JWT authentication middleware.
- [`src/utils/sendEmail.js`](src/utils/sendEmail.js):  
  Utility for sending emails (e.g., password reset).
- [`src/utils/referralUtils.js`](src/utils/referralUtils.js):  
  Referral code generation and helpers.

---

## ⚙️ Environment Variables

See `.env.example` for all required variables:

```
MONGO_URI=your-mongodb-uri
JWT_SECRET=your-jwt-secret
CLIENT_URL=http://localhost:3000
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email
EMAIL_PASS=your-app-password
EMAIL_FROM=your-email
```

---

## 🏁 Running the Service

```bash
# Install dependencies
npm install

# Start the service (development)
npm run dev

# Or with Docker
docker build -t user-service .
docker run --env-file .env -p 5001:5001 user-service
```

---

## 📝 Notes

- All passwords are hashed with bcrypt.
- JWT tokens are set as HTTP-only cookies on login.
- Profile update does not allow changing referral or admin fields.
- All errors are returned as JSON.
- Referral and placement logic supports both direct and binary tree relationships.
- Admin users can be seeded via `seed.js`.
- **User placement logic ensures every new user is connected in the referral/binary tree as per business rules.**

---

## 📚 See Also

- [API Gateway README](../api-gateway/README.md)
- [Frontend README](../../frontend/README.md)