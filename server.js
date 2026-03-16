require("dotenv").config();
const express = require("express");
const connectDB = require("./configs/db.connection");
const errorHandler = require("./middlewares/error.middleware");
const ApiError = require("./utils/apiError");
const userRoutes = require("./routers/user.router");
const roleRoutes = require("./routers/role.router");
const authRoutes = require("./routers/auth.router");

const app = express();

// If running behind a proxy (nginx, load balancer), trust proxy to get correct IP
app.set("trust proxy", true); // app.set('trust proxy', 1);

const cors = require("cors"); // allow cross origin user can access api
const helmet = require("helmet"); // setting various HTTP security headers
const morgan = require("morgan"); // logs HTTP requests in the console.

// middle ware
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));

// DB connection
connectDB();

const port = process.env.PORT || 3000;

// router
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/role", roleRoutes);

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
