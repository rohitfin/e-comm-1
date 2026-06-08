const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrder,
  getOrderDetail,
} = require("../controllers/order.controllers");
const asyncHandler = require("../middlewares/asyncHandler");
const { authProtect } = require("../middlewares/auth.middleware");

router.get("/", asyncHandler(getOrder));
router.post("/create", asyncHandler(authProtect), asyncHandler(createOrder));

router.get(
  "/:orderId",
  asyncHandler(authProtect),
  asyncHandler(getOrderDetail),
);

module.exports = router;
