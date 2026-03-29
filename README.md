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

/*
-- sanitizeUser 
-- hide sensitive data like password, OTP, token

SECTION 1 — Authentication & Security
1️⃣ Login API
  Build a login API.
  Requirements:
    •	Validate email + password - ✅
    •	Generate JWT access token - ✅
    •	Generate refresh token - ✅ (Before generate check if session is already create for this user then make it isActive false)
    •	Create login session - ✅
  •	Save:
    o	IP address
    o	device
    o	browser
    o	refresh token expiry
  •	Return:
    {
      "token": "",
      "refreshToken": "",
      "user": {}
    }
  Edge cases:
    •	inactive user
    •	deleted user
    •	wrong password
    •	multiple device login
________________________________________
2️⃣ Refresh Token API
Create:
  POST /auth/refresh-token - ✅
  Requirements:
    •	Validate refresh token - ✅
    •	Verify session - ✅
    •	Issue new access token - ✅
    •	Update session lastActivity - ✅
  Security:
    •	Refresh token rotation
________________________________________
3️⃣ Logout API
  POST /auth/logout - ✅
    Requirements: - ✅
      •	invalidate session - ✅
      •	update logoutTime - ✅
      •	set isActive=false - ✅
________________________________________
4️⃣ Logout All Devices
  POST /auth/logout-all - ✅
  Invalidate all sessions of the user.
  ________________________________________
5️⃣ Middleware
  Build middleware:
  authProtect
  Must validate:
    •	JWT - ✅
    •	session active - ✅
    •	user active - ✅
________________________________________
6️⃣ Role Based Authorization
    Create middleware:
    authorize("admin")
    authorize("seller")
    authorize("customer")
    Example:
    DELETE /users/:id
    Admin only - ✅
________________________________________
SECTION 2 — User Management
7️⃣ Admin Create User
    Admin can create:
    •	seller
    •	customer
    Validation:
    •	unique email - ✅
    •	roleId must exist - ✅
________________________________________
8️⃣ Get Users with Filters
    GET /users
    Support:
    •	pagination - ✅
    •	role filter and multiple role - ✅
    •	search by email/name - ✅
    •	active users - ✅
    Example:
    /users?page=1&limit=10&role=seller,admin&search=rohit
________________________________________
9️⃣ Soft Delete User
    Instead of deleting:
    isDeleted = true - ✅
    User cannot login anymore. - ✅
________________________________________
SECTION 3 — Product APIs
🔟 Seller Create Product
    POST /products
    Rules:
    •	seller can only create products for themselves - ✅
    •	validate category - ✅
    •	price > 0 - ✅
________________________________________
11️⃣ Product Listing API
    GET /products
    Filters:
    •	category - ✅
    •	price range - ✅
    •	seller - ✅
    •	pagination - ✅
    •	sorting
    Example:
    /products?category=electronics&minPrice=500&maxPrice=50000

    Future
    Aggregation-based filtering - ✅
    OR caching + performance (Redis)
    Search engine (ElasticSearch vs MongoDB)

    👉 Real difference between "text" vs normal index vs regex performance
    👉 OR how Mongo splits words internally (very interesting)
________________________________________
12️⃣ Product Detail API
    GET /products/:id
    Return:
    •	product - ✅
    •	category - ✅
    •	seller - ✅
    •	inventory - ✅
________________________________________
13️⃣ Update Product
    Only seller who created it can update. - ✅
________________________________________
14️⃣ Delete Product
    Soft delete product. - ✅
________________________________________
SECTION 4 — Inventory
    15️⃣ Inventory API
    GET /inventory/:productId  - ✅
    Return stock.
________________________________________
16️⃣ Update Inventory
    PATCH /inventory/:productId
    Seller can update stock.
    Edge cases:
    •	stock cannot be negative
________________________________________
17️⃣ Low Stock Alert API
    Return products where:
    stock < 10
________________________________________
SECTION 5 — Cart System
18️⃣ Add to Cart
    POST /cart/add
    Rules:
    •	user must be customer
    •	check product exists
    •	check stock available
________________________________________
19️⃣ Update Cart Item
    PATCH /cart/item/:id
    Update quantity.
________________________________________
20️⃣ Remove Cart Item
    DELETE /cart/item/:id   
________________________________________
21️⃣ Get Cart
    GET /cart
    Return:
    •	product details
    •	quantity
    •	price
    •	subtotal
________________________________________
22️⃣ Cart Total Calculation
    Return:
    subtotal
    tax
    grandTotal
________________________________________
SECTION 6 — Order System
23️⃣ Place Order
    POST /orders
    Flow:
    cart → order
    Steps:
    1.	validate cart
    2.	check inventory
    3.	create order
    4.	create order_items
    5.	reduce stock
    6.	clear cart
________________________________________
24️⃣ Get My Orders
    GET /orders/my
    Customer only.
________________________________________
25️⃣ Order Detail API
GET /orders/:id
    Return:
    •	items
    •	address
    •	total
    •	status
________________________________________
26️⃣ Update Order Status
    Admin or seller:
    PATCH /orders/:id/status
    Example:
    PLACED → SHIPPED → DELIVERED
________________________________________
27️⃣ Cancel Order
    Rules:
    •	only before shipped
    •	restore inventory
________________________________________
SECTION 7 — Address System
28️⃣ Add Address
    POST /addresses
    User can add multiple.
________________________________________
29️⃣ Set Default Address
    Only one address per user can be:
    isDefault=true
________________________________________
SECTION 8 — Advanced Production Questions
30️⃣ Prevent Double Order
    If user clicks place order twice.
    Solution?
    Implement:
    idempotency
________________________________________
31️⃣ Prevent Overselling
    Two users buying last item simultaneously.
    Solution?
    Use:
    transactions
    or
    atomic stock update
________________________________________
32️⃣ Product Search Optimization
    Implement:
    MongoDB text index
________________________________________
33️⃣ Rate Limiting
    Protect login API.
    Use:
    express-rate-limit
________________________________________
34️⃣ Logging System
    Implement logging using:
    winston
    Log:
    •	errors
    •	login attempts
    •	orders
________________________________________
35️⃣ API Response Standardization
    Return consistent format:
    {
    "success": true,
    "message": "",
    "data": {}
    }
________________________________________
SECTION 9 — System Design Questions
Explain how you would implement:
36️⃣ Product Reviews
37️⃣ Wishlist
38️⃣ Coupon System
39️⃣ Payment Gateway Integration
40️⃣ Order Tracking
________________________________________
SECTION 10 — Performance Questions
Explain how to handle:
41️⃣ 1 million users
42️⃣ 100k products
43️⃣ heavy traffic sale event
________________________________________
BONUS HARD QUESTIONS (Senior Level)
44️⃣ Microservice design for this system
45️⃣ Event driven order processing
46️⃣ Distributed inventory management
47️⃣ Prevent fraud orders
48️⃣ Cache product listing using Redis










1️⃣ Atomic Checkout Challenge (Most Important)
Problem
Implement:
POST /checkout
Flow:
cart → order → order_items → inventory update → cart clear
Tricky Requirements
1.	If inventory fails, order must not be created.
2.	If order fails, inventory must not reduce.
3.	If network retry happens, order must not duplicate.
4.	If user clicks checkout twice, still only one order.
Must use
MongoDB transactions
idempotency keys
________________________________________
2️⃣ Inventory Overselling Challenge
Scenario
Inventory:
product stock = 1
Two customers:
Customer A checkout
Customer B checkout
Both succeed.
Stock becomes:
-1
Challenge
Design inventory update so overselling never happens.
Hint
Atomic update:
$inc: { stock: -1 }
with condition:
stock > 0
________________________________________
3️⃣ Cart Price Manipulation Attack
Scenario
Frontend sends:
{
 "productId": "123",
 "price": 100
}
But real price:
799
Challenge
Ensure backend never trusts client price.
Solution expectation
Server must always:
fetch price from DB
________________________________________
4️⃣ Double Cart Item Problem
Scenario
User sends:
POST /cart/add
productId=123
twice.
Cart becomes:
productId=123
productId=123
Challenge
Instead it should become:
quantity: 2
________________________________________
5️⃣ Seller Product Ownership
Scenario
Seller A tries:
PATCH /products/{sellerBProduct}
Challenge
Prevent cross-seller modification.
Hint
Verify:
product.sellerId === req.user.id
________________________________________
6️⃣ Session Hijacking Detection
Scenario
User logs in from:
Mumbai
Chrome
Next request:
Germany
Firefox
Challenge
Detect suspicious login.
Possible solution:
compare IP + device
________________________________________
7️⃣ Order Cancellation Race Condition
Scenario
Two requests:
POST /orders/123/cancel
POST /orders/123/cancel
Inventory restored twice.
Challenge
Prevent double restore.
Hint
Check order status:
if status !== PLACED
throw error
________________________________________
8️⃣ Pagination Trap
Scenario
Database has:
100000 products
API:
GET /products?page=1
Challenge
Implement efficient pagination.
Expected:
limit
skip
index
Bonus:
cursor pagination
________________________________________
9️⃣ Search Optimization
Problem
Implement:
GET /products/search?q=iphone
Challenge
Handle:
100k products
Expected
Mongo index:
db.products.createIndex({ name: "text" })
________________________________________
🔟 Global Soft Delete Protection
Your models have:
isDeleted
Challenge
Ensure deleted records never appear in queries.
Expected solution:
mongoose query middleware
________________________________________
1️⃣1️⃣ Prevent Cart Checkout After Stock Change
Scenario
User adds item:
stock = 5
Before checkout stock becomes:
0
Challenge
Checkout must fail.
________________________________________
1️⃣2️⃣ Rate Limit Login API
Prevent brute force.
POST /auth/login
Limit:
5 attempts / minute
________________________________________
1️⃣3️⃣ Order Total Integrity
Scenario
User modifies request:
{
 "totalAmount": 10
}
Actual total:
80799
Challenge
Prevent manipulation.
Expected:
recalculate total on server
________________________________________
1️⃣4️⃣ Prevent Massive Cart Size
User adds:
10000 items
Challenge
Limit cart size.
Example:
max 50 items
________________________________________
1️⃣5️⃣ Transaction Failure Recovery
Scenario
Server crashes during checkout.
inventory reduced
order not created
Challenge
Design system to prevent inconsistency.
Expected:
transactions
________________________________________
1️⃣6️⃣ Multi Device Session Management
User logs in from:
Laptop
Mobile
Tablet
Challenge
Implement:
GET /sessions
Return active devices.
Allow:
logout specific session
________________________________________
1️⃣7️⃣ Order Status Validation
Prevent invalid transitions:
Invalid:
DELIVERED → PLACED
Expected solution
state machine
________________________________________
1️⃣8️⃣ Secure Product Deletion
If product exists in:
orders
Challenge
Prevent deletion.
Expected:
soft delete
________________________________________
1️⃣9️⃣ Seller Analytics Aggregation
Build:
GET /seller/dashboard
Return:
revenue
orders
top products
Use:
aggregation pipeline
________________________________________
2️⃣0️⃣ Admin Fraud Detection
Detect:
20 orders in 1 minute
Possible fraud.
Challenge
Add system to flag suspicious users.
________________________________________
Senior Backend Challenge
Implement one API covering many tricky cases:
POST /checkout
Must handle:
transactions
inventory
order creation
cart validation
price validation
idempotency
________________________________________
If You Solve These
You will practice:
security
race conditions
transactions
data integrity
scalability
performance
These are exactly the hard problems backend engineers solve in production.
	

*/

