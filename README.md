# E-Commerce API v1.0.0

A robust, production-ready Node.js backend application for e-commerce platforms with authentication, user management, and role-based access control.

---

## 📋 Table of Contents
- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Authentication & Authorization](#authentication--authorization)
- [Improvements & Recommendations](#improvements--recommendations)
- [Future Roadmap](#future-roadmap)

---

## 📖 Project Overview

This is a scalable Node.js backend application built with Express.js and MongoDB, designed for e-commerce platforms. The application implements:

- **User Authentication** with JWT tokens and session management
- **Role-Based Access Control (RBAC)** for different user types (admin, customer, etc.)
- **User Management** with CRUD operations
- **Role Management** for defining permissions
- **Session Tracking** to monitor active user sessions
- **Security Best Practices** with helmet, bcrypt password hashing, and input validation

The application follows a clean, layered architecture separating concerns into controllers, services, models, and middleware, making it maintainable and testable.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│           Express Server (Port 3000)            │
├─────────────────────────────────────────────────┤
│                    Routes                       │
│  ├─ /api/auth (Authentication)                  │
│  ├─ /api/user (User Management)                 │
│  └─ /api/role (Role Management)                 │
├─────────────────────────────────────────────────┤
│                  Middleware                     │
│  ├─ Error Handler (error.middleware.js)        │
│  ├─ Auth Protect (auth.middleware.js)          │
│  ├─ Role Authorization (role.middleware.js)    │
│  ├─ Input Validation (validate.middleware.js)  │
│  └─ Async Handler (asyncHandler.js)            │
├─────────────────────────────────────────────────┤
│              Controllers & Services             │
│  ├─ auth.controllers ↔ auth.service            │
│  ├─ user.controllers ↔ user.service            │
│  └─ role.controllers ↔ role.service            │
├─────────────────────────────────────────────────┤
│                 MongoDB Models                  │
│  ├─ User (tbl_users)                           │
│  ├─ Role (tbl_roles)                           │
│  └─ LoginSession (tbl_login_sessions)          │
├─────────────────────────────────────────────────┤
│                   MongoDB                       │
└─────────────────────────────────────────────────┘
```

---

## ✨ Features

### Authentication & Security
- ✅ User login with email and password
- ✅ JWT token-based authentication
- ✅ Session management with login/logout tracking
- ✅ Password hashing with bcrypt
- ✅ Token expiration (24 hours)
- ✅ IP address and User-Agent logging for security auditing
- ✅ Security headers with Helmet
- ✅ CORS enabled for cross-origin requests

### User Management
- ✅ Create users with role assignment
- ✅ Get all users (admin only)
- ✅ Get user details by ID
- ✅ Update user password
- ✅ Soft delete users
- ✅ Track user creation/modification metadata (who, when, IP)

### Role Management
- ✅ Create roles
- ✅ List all roles
- ✅ Update role information
- ✅ Delete roles
- ✅ Role-based access control (RBAC)

### API Features
- ✅ Comprehensive error handling with custom ApiError class
- ✅ Input validation with Joi
- ✅ Request logging with Morgan
- ✅ Async/await error handling
- ✅ RESTful API design

---

## 🛠️ Tech Stack

| Technology | Purpose | Version |
|-----------|---------|---------|
| **Express** | Web Framework | ^5.2.1 |
| **MongoDB** | NoSQL Database | - |
| **Mongoose** | ODM for MongoDB | ^9.1.6 |
| **JWT** | Authentication | ^9.0.3 |
| **Bcrypt** | Password Hashing | ^6.0.0 |
| **Joi** | Input Validation | ^18.0.2 |
| **Helmet** | Security Headers | ^7.0.0 |
| **CORS** | Cross-Origin Support | ^2.8.5 |
| **Morgan** | Request Logging | ^1.10.0 |
| **Dotenv** | Environment Variables | ^17.2.4 |
| **Nodemon** | Development Auto-reload | ^3.1.11 |

---

## 📦 Installation & Setup

### Prerequisites
- Node.js >= 14.x
- npm or yarn
- MongoDB instance running locally or cloud (MongoDB Atlas)

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/rohitfin/e-comm-1.git
   cd e-comm-1
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file** (see Environment Variables section)
   ```bash
   cp .env.example .env
   ```

4. **Start the server**
   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

5. **Server will be running at** `http://localhost:3000`

---

## 🔑 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=3000

# Database Configuration
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/e-comm-1?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_random

# Bcrypt Configuration
BCRYPT_ROUNDS=10

# Optional: For production
NODE_ENV=development
```

### Important Notes:
- `JWT_SECRET`: Use a strong, random string (min 32 characters)
- `BCRYPT_ROUNDS`: Higher values = more secure but slower (10-12 recommended)
- `MONGO_URL`: Use MongoDB Atlas for cloud or local MongoDB URI

---

## 📂 Project Structure

```
e-comm-1/
├── server.js                    # Entry point, Express app initialization
├── package.json                 # Dependencies and scripts
├── .env                         # Environment variables (create this)
├── .gitignore                   # Git ignore rules
│
├── configs/
│   └── db.connection.js        # MongoDB connection logic
│
├── models/                      # Mongoose schemas
│   ├── user.model.js           # User schema with password hashing
│   ├── role.model.js           # Role schema
│   └── loginSession.model.js   # Session tracking schema
│
├── controllers/                 # Request handlers
│   ├── auth.controllers.js      # Login/logout logic
│   ├── user.controllers.js      # User CRUD operations
│   └── role.controllers.js      # Role CRUD operations
│
├── services/                    # Business logic
│   ├── auth.service.js         # Authentication logic
│   ├── user.service.js         # User service
│   └── role.service.js         # Role service
│
├── routers/                     # API route definitions
│   ├── auth.router.js          # Auth endpoints
│   ├── user.router.js          # User endpoints
│   └── role.router.js          # Role endpoints
│
├── middlewares/                 # Express middleware
│   ├── auth.middleware.js       # JWT verification
│   ├── role.middleware.js       # Role-based authorization
│   ├── error.middleware.js      # Global error handler
│   ├── validate.middleware.js   # Input validation
│   ├── validateId.middleware.js # ObjectId validation
│   └── asyncHandler.js          # Async error wrapper
│
├── validators/                  # Input validation schemas (Joi)
│   ├── user.validator.js        # User validation rules
│   └── role.validator.js        # Role validation rules
│
└── utils/
    └── ApiError.js             # Custom error class
```

---

## 🔌 API Endpoints

### Authentication Endpoints
```
POST   /api/auth/login           - User login (email + password)
GET    /api/auth/logout          - User logout (requires auth)
```

### User Endpoints
```
GET    /api/user/                - Get all users (admin only)
GET    /api/user/:id             - Get user by ID
GET    /api/user/detail/:id      - Get detailed user info
POST   /api/user/                - Create new user
PUT    /api/user/update-password/:id - Update user password
DELETE /api/user/:id             - Delete user (admin only)
```

### Role Endpoints
```
GET    /api/role/                - Get all roles
POST   /api/role/                - Create new role
PUT    /api/role/:id             - Update role
DELETE /api/role/:id             - Delete role
```

---

## 🔐 Authentication & Authorization

### Login Flow
1. User sends `POST /api/auth/login` with email and password
2. System verifies credentials and password hash
3. JWT token is generated with 24-hour expiration
4. Login session is created in database tracking IP and User-Agent
5. Token and user info returned in response

### Token Structure
```javascript
{
  _id: "user_id",
  roleId: "role_id",
  role: "admin|customer|...",
  sessionId: "session_id",
  iat: 1234567890,
  exp: 1234567890 + 86400 // 24 hours
}
```

### Protected Routes
- Include `Authorization: Bearer <token>` header in requests
- Middleware verifies token validity and session status
- Invalid/expired tokens return 401 Unauthorized

### Role-Based Access Control (RBAC)
- Routes can require specific roles using `authorize("admin")`
- Only users with matching role can access the endpoint
- Returns 403 Forbidden if user lacks permissions

---

## 🚀 Improvements & Recommendations

### High Priority (Critical)

1. **Add Environment Configuration File**
   - Create `.env.example` template for developers
   - Document all required environment variables
   - Add validation for critical env variables on startup

2. **Implement Input Validation on All Routes**
   - Add validation schemas for all POST/PUT endpoints (role, user update, password)
   - Currently only login and user creation are validated
   - Use Joi schemas consistently across all validators

3. **Add Request/Response Logging**
   - Implement structured logging (Winston or Pino)
   - Log all authentication attempts (success/failure)
   - Track API usage and performance metrics
   - Add correlation IDs for request tracing

4. **Database Query Optimization**
   - Add database indexes for frequently queried fields
   - Implement pagination for user and role endpoints
   - Use lean() for read-only queries to improve performance

5. **Error Handling & Validation Consistency**
   - Standardize error response format across all endpoints
   - Add proper HTTP status codes (400 for validation, 401 for auth, 403 for authorization)
   - Return detailed error messages in development, generic in production

### Medium Priority (Important)

6. **Testing Implementation**
   - Add unit tests for services and middleware (Jest/Mocha)
   - Add integration tests for API endpoints
   - Aim for 80%+ code coverage
   - Add test scripts to package.json

7. **Rate Limiting & Throttling**
   - Implement rate limiting to prevent brute force attacks
   - Use express-rate-limit package
   - Different limits for login (stricter) vs other endpoints

8. **Email Verification**
   - Add email verification for new user registrations
   - Implement password reset functionality
   - Use nodemailer or similar service

9. **Refresh Token Implementation**
   - Implement refresh tokens for longer sessions
   - Separate access token (short-lived) from refresh token (long-lived)
   - Add token rotation mechanism

10. **API Documentation**
    - Add Swagger/OpenAPI documentation
    - Use @swagger decorator comments in routes
    - Generate interactive API docs at `/api-docs`

### Low Priority (Nice to Have)

11. **Caching Layer**
    - Implement Redis caching for frequently accessed data
    - Cache roles, frequently accessed users
    - Reduces database load

12. **Audit Logging**
    - Track all user actions (create, update, delete)
    - Maintain audit trail for compliance
    - Store who did what, when, from where

13. **Advanced Security**
    - Implement two-factor authentication (2FA)
    - Add OAuth2/SSO integration
    - Implement CSRF protection
    - Add request signing

14. **Performance Monitoring**
    - Integrate APM tool (New Relic, DataDog, or Elastic APM)
    - Monitor response times and error rates
    - Set up alerts for performance degradation

---

## 📋 Next Tasks/Features to Implement

### Phase 2 - User Management Enhancement
- [ ] Implement user profile endpoints (GET, PUT)
- [ ] Add user avatar/image upload functionality
- [ ] Add user preferences/settings
- [ ] Implement user account recovery flows

### Phase 3 - Security Hardening
- [ ] Add email verification on signup
- [ ] Implement password reset via email
- [ ] Add 2FA (Two-Factor Authentication)
- [ ] Implement refresh token rotation
- [ ] Add request signing/HMAC verification

### Phase 4 - Testing & Documentation
- [ ] Write comprehensive unit tests
- [ ] Add integration tests
- [ ] Generate Swagger API documentation
- [ ] Create postman collection
- [ ] Write developer guide

### Phase 5 - Performance & Monitoring
- [ ] Implement Redis caching
- [ ] Add database query optimization
- [ ] Implement API rate limiting
- [ ] Set up structured logging
- [ ] Add APM monitoring

### Phase 6 - Checkout & Payment
- [ ] Implement product catalog endpoints
- [ ] Add shopping cart functionality
- [ ] Integrate payment gateway (Stripe, PayPal)
- [ ] Add order management
- [ ] Implement order tracking

---

## 🔍 Code Quality Observations

### Strengths ✅
- Clean separation of concerns (controllers, services, middleware)
- Good use of middleware for cross-cutting concerns
- Proper error handling with custom ApiError class
- Password hashing with bcrypt before storing
- JWT with session validation
- Input validation framework in place
- Security headers with Helmet
- CORS configuration

### Areas to Improve ⚠️
- Missing error handling middleware wrapper on some endpoints
- No input validation on role CRUD operations
- No pagination for list endpoints
- Missing request logging
- No test files
- Limited API documentation
- No rate limiting
- Missing field-level access control

---

## 📝 Usage Examples

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

### Get Users (Admin Only)
```bash
curl -X GET http://localhost:3000/api/user/ \
  -H "Authorization: Bearer <token>"
```

### Create User
```bash
curl -X POST http://localhost:3000/api/user/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "secure123",
    "roleId": "<role_id>"
  }'
```

---

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit your changes (`git commit -m 'Add AmazingFeature'`)
3. Push to the branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License - see the package.json file for details.

---

## 🔗 Repository

- **GitHub**: [rohitfin/e-comm-1](https://github.com/rohitfin/e-comm-1)
- **Issues**: [Report Issues](https://github.com/rohitfin/e-comm-1/issues)

---

## 📧 Support

For questions or issues, please open an issue on the GitHub repository.

---

**Last Updated**: March 2026  
**Status**: Active Development  
**Version**: 1.0.0
