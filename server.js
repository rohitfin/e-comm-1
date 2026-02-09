
require('dotenv').config();
const express = require("express");
const userRoutes = require("./routers/userRoutes");
const connectDB = require("./configs/db.connection");

const app = express();

const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// middle ware
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));

// DB connection
connectDB();

const port = process.env.PORT || 3000;


// router
app.use("/api/user", userRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ code: 404, message: "Not Found" });
});

// basic error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ code: 500, message: "Internal Server Error" });
});

app.listen(port, () => {
  console.log("Running on " + port);
});
