require("dotenv").config();
const express = require("express");
const connectDB = require("./configs/db.connection");
const errorHandler = require("./middlewares/error.middleware");
const ApiError = require("./utils/apiError");
const userRoutes = require("./routers/user.router");
const roleRoutes = require("./routers/role.router");
const authRoutes = require("./routers/auth.router");
const productRoutes = require("./routers/product.route");
const inventoryRoutes = require("./routers/inventory.router");
const cartRoutes = require("./routers/cart.router");
const orderRoutes = require("./routers/order.router");

const app = express();

// If running behind a proxy (nginx, load balancer), trust proxy to get correct IP
app.set("trust proxy", true); // app.set('trust proxy', 1);

const cors = require("cors"); // allow cross origin user can access api
const helmet = require("helmet"); // setting various HTTP security headers
const morgan = require("morgan"); // logs HTTP requests in the console.
const rateLimit = require("express-rate-limit");

// middle ware
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// DB connection
connectDB();

const port = process.env.PORT || 3000;

// router
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/role", roleRoutes);
app.use("/api/product", productRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res, next) => {
  next(new ApiError(404, "Route Not Found"));
});

// app.use((req, res, next) => {
//   res.status(404).json({ code: 404, message: "Not Found" });
// });

// basic error handler
app.use(errorHandler);
// app.use((err, req, res, next) => {
//   console.error(err);
//   res.status(500).json({ code: 500, message: "Internal Server Error" });
// });

app.listen(port, () => {
  console.log(`🚀 Server Running on http://localhost:${port}`);
});

// Export app for testing
module.exports = app;
